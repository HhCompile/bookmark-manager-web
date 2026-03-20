import { X, Check, AlertTriangle, ChevronRight, ThumbsUp, ThumbsDown, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect, useMemo } from 'react'
import { useBookmarks, Bookmark } from '../contexts/BookmarkContext'

interface AIConfirmationPanelProps {
  onClose: () => void
}

interface AISuggestion {
  id: string
  bookmarkId: string
  bookmarkTitle: string
  bookmarkUrl: string
  originalCategory?: string
  originalTags: string[]
  suggestedCategory: string
  suggestedAlias?: string
  suggestedTags: string[]
  confidence: 'high' | 'medium' | 'low'
  reason: string
}

// 智能分类规则
const categoryRules = [
  {
    category: '开发工具',
    keywords: ['github', 'gitlab', 'bitbucket', 'stackoverflow', 'npm', 'yarn', 'webpack', 'vite', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud', 'dev', 'code', 'programming', 'git', 'repo'],
    domains: ['github.com', 'gitlab.com', 'bitbucket.org', 'stackoverflow.com', 'npmjs.com', 'docker.com', 'kubernetes.io'],
  },
  {
    category: '前端开发',
    keywords: ['react', 'vue', 'angular', 'svelte', 'html', 'css', 'javascript', 'typescript', 'frontend', 'ui', 'component', 'framework'],
    domains: ['react.dev', 'vuejs.org', 'angular.io', 'svelte.dev', 'mui.com', 'tailwindcss.com'],
  },
  {
    category: '设计资源',
    keywords: ['design', 'ui', 'ux', 'figma', 'sketch', 'adobe', 'dribbble', 'behance', 'color', 'icon', 'font', 'typography'],
    domains: ['figma.com', 'dribbble.com', 'behance.net', 'adobe.com', 'sketch.com', 'icons8.com', 'fontawesome.com'],
  },
  {
    category: '学习教程',
    keywords: ['tutorial', 'course', 'learn', 'education', 'doc', 'guide', 'how to', 'lesson', 'class', 'study'],
    domains: ['coursera.org', 'udemy.com', 'edx.org', 'khanacademy.org', 'mdn.mozilla.org', 'w3schools.com', 'freecodecamp.org'],
  },
  {
    category: '技术文档',
    keywords: ['doc', 'api', 'reference', 'manual', 'specification', 'wiki', 'documentation'],
    domains: ['docs.', 'documentation.', 'wiki.', 'readme.io', 'swagger.io'],
  },
  {
    category: '社交媒体',
    keywords: ['social', 'twitter', 'facebook', 'instagram', 'linkedin', 'reddit', 'forum', 'community'],
    domains: ['twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'linkedin.com', 'reddit.com', 'discord.com', 'slack.com'],
  },
  {
    category: '视频平台',
    keywords: ['video', 'youtube', 'bilibili', 'vimeo', 'stream', 'watch'],
    domains: ['youtube.com', 'youtu.be', 'bilibili.com', 'vimeo.com', 'twitch.tv'],
  },
  {
    category: '新闻资讯',
    keywords: ['news', 'blog', 'article', 'media', 'press', 'report'],
    domains: ['medium.com', 'dev.to', 'hashnode.com', 'substack.com', 'techcrunch.com', 'theverge.com'],
  },
  {
    category: '工作效率',
    keywords: ['tool', 'productivity', 'efficiency', 'notion', 'trello', 'jira', 'management', 'collaboration'],
    domains: ['notion.so', 'trello.com', 'atlassian.com', 'asana.com', 'monday.com', 'linear.app'],
  },
  {
    category: '购物网站',
    keywords: ['shop', 'store', 'buy', 'product', 'amazon', 'taobao', 'jd', 'price'],
    domains: ['amazon.com', 'taobao.com', 'tmall.com', 'jd.com', 'ebay.com', 'aliexpress.com'],
  },
]

// 根据 URL 和标题智能分析分类
function analyzeBookmark(bookmark: Bookmark): AISuggestion | null {
  const url = bookmark.url.toLowerCase()
  const title = bookmark.title.toLowerCase()
  const hostname = new URL(bookmark.url).hostname.toLowerCase()

  let bestMatch: { category: string; confidence: 'high' | 'medium' | 'low'; reason: string } | null = null

  // 规则匹配
  for (const rule of categoryRules) {
    // 域名精确匹配 = 高置信度
    if (rule.domains.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
      bestMatch = {
        category: rule.category,
        confidence: 'high',
        reason: `匹配到${rule.category}专用网站`,
      }
      break
    }

    // 关键词匹配
    const urlMatch = rule.keywords.some(kw => url.includes(kw))
    const titleMatch = rule.keywords.some(kw => title.includes(kw))

    if (urlMatch || titleMatch) {
      const confidence: 'high' | 'medium' = urlMatch && titleMatch ? 'high' : 'medium'
      if (!bestMatch || (bestMatch.confidence === 'low' || (bestMatch.confidence === 'medium' && confidence === 'high'))) {
        bestMatch = {
          category: rule.category,
          confidence,
          reason: confidence === 'high' ? 'URL和标题都匹配' : titleMatch ? '标题匹配' : 'URL匹配',
        }
      }
    }
  }

  // 如果没有匹配，根据 URL 特征推测
  if (!bestMatch) {
    if (hostname.includes('github')) {
      bestMatch = { category: '开发工具', confidence: 'high', reason: 'GitHub 代码仓库' }
    } else if (hostname.includes('google')) {
      bestMatch = { category: '搜索工具', confidence: 'high', reason: 'Google 相关服务' }
    } else if (title.includes('文档') || title.includes('doc')) {
      bestMatch = { category: '技术文档', confidence: 'medium', reason: '可能是技术文档' }
    } else {
      return null // 置信度太低，不生成建议
    }
  }

  // 生成建议标签
  const suggestedTags = [bestMatch.category]
  
  // 从标题提取关键词作为标签
  const keywordMap: Record<string, string[]> = {
    'react': ['React', '前端'],
    'vue': ['Vue', '前端'],
    'angular': ['Angular', '前端'],
    'javascript': ['JavaScript', '前端'],
    'typescript': ['TypeScript', '前端'],
    'node': ['Node.js', '后端'],
    'python': ['Python', '后端'],
    'go': ['Go', '后端'],
    'rust': ['Rust', '后端'],
    'docker': ['Docker', '运维'],
    'kubernetes': ['K8s', '运维'],
    'aws': ['AWS', '云计算'],
    'design': ['设计', 'UI'],
    'tutorial': ['教程', '学习'],
  }

  for (const [key, tags] of Object.entries(keywordMap)) {
    if (title.includes(key) || url.includes(key)) {
      suggestedTags.push(...tags)
    }
  }

  // 生成别名（简短的命令式访问）
  let suggestedAlias: string | undefined
  const domainParts = hostname.split('.')
  if (domainParts.length >= 2) {
    const mainDomain = domainParts[domainParts.length - 2]
    suggestedAlias = mainDomain.substring(0, 8)
  }

  return {
    id: `ai-${bookmark.id}`,
    bookmarkId: bookmark.id,
    bookmarkTitle: bookmark.title,
    bookmarkUrl: bookmark.url,
    originalCategory: bookmark.category,
    originalTags: bookmark.tags,
    suggestedCategory: bestMatch.category,
    suggestedAlias,
    suggestedTags: [...new Set(suggestedTags)].slice(0, 4),
    confidence: bestMatch.confidence,
    reason: bestMatch.reason,
  }
}

export default function AIConfirmationPanel({ onClose }: AIConfirmationPanelProps) {
  const { bookmarks, updateBookmark, folders } = useBookmarks()
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [acceptedCount, setAcceptedCount] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  // 分析书签生成建议
  useEffect(() => {
    setIsAnalyzing(true)
    
    // 模拟 AI 分析延迟
    const timer = setTimeout(() => {
      const newSuggestions: AISuggestion[] = []
      
      // 只分析未分类或需要优化的书签
      const bookmarksToAnalyze = bookmarks.filter(b => {
        // 如果书签已经在正确的分类中，跳过
        if (b.category && b.category !== '未分类') return false
        return true
      })

      for (const bookmark of bookmarksToAnalyze.slice(0, 20)) { // 最多分析 20 个
        const suggestion = analyzeBookmark(bookmark)
        if (suggestion) {
          newSuggestions.push(suggestion)
        }
      }

      setSuggestions(newSuggestions)
      setIsAnalyzing(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [bookmarks])

  // 过滤建议
  const filteredSuggestions = useMemo(() => {
    if (filter === 'all') return suggestions
    return suggestions.filter(s => s.confidence === filter)
  }, [suggestions, filter])

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return 'bg-green-100 border-green-300 text-green-700'
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-700'
      case 'low': return 'bg-red-100 border-red-300 text-red-700'
      default: return 'bg-gray-100 border-gray-300 text-gray-700'
    }
  }

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return { icon: Check, text: '高置信度', color: 'text-green-700' }
      case 'medium': return { icon: AlertTriangle, text: '需确认', color: 'text-yellow-700' }
      case 'low': return { icon: AlertTriangle, text: '低置信度', color: 'text-red-700' }
      default: return { icon: AlertTriangle, text: '未知', color: 'text-gray-700' }
    }
  }

  const handleAccept = (suggestion: AISuggestion) => {
    // 应用建议到书签
    updateBookmark(suggestion.bookmarkId, {
      category: suggestion.suggestedCategory,
      tags: suggestion.suggestedTags,
      alias: suggestion.suggestedAlias,
    })
    
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
    setAcceptedCount(prev => prev + 1)
  }

  const handleReject = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id))
  }

  const handleAcceptAll = () => {
    const highConfidence = suggestions.filter(s => s.confidence === 'high')
    
    highConfidence.forEach(suggestion => {
      updateBookmark(suggestion.bookmarkId, {
        category: suggestion.suggestedCategory,
        tags: suggestion.suggestedTags,
        alias: suggestion.suggestedAlias,
      })
    })
    
    setSuggestions(prev => prev.filter(s => s.confidence !== 'high'))
    setAcceptedCount(prev => prev + highConfidence.length)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-end z-50"
        onClick={onClose}>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI 优化建议</h2>
                <p className="text-sm text-gray-500">
                  {isAnalyzing ? '正在分析书签...' : `发现 ${suggestions.length} 个建议，已采纳 ${acceptedCount} 个`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Analyzing State */}
          {isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">AI 正在分析您的书签...</p>
              <p className="text-sm text-gray-400 mt-2">识别分类、提取标签、生成别名</p>
            </div>
          ) : (
            <>
              {/* Quick Actions & Filter */}
              {suggestions.length > 0 && (
                <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      一键采用全部高置信度 ({suggestions.filter(s => s.confidence === 'high').length})
                    </button>
                  </div>
                  
                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1">
                    {(['all', 'high', 'medium', 'low'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          filter === f
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}>
                        {f === 'all' ? '全部' : f === 'high' ? '高置信度' : f === 'medium' ? '需确认' : '低置信度'}
                        {f !== 'all' && (
                          <span className="ml-1 opacity-70">
                            ({suggestions.filter(s => s.confidence === f).length})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredSuggestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    {suggestions.length === 0 ? (
                      <>
                        <Check className="w-16 h-16 mb-4 text-green-500" />
                        <p className="text-lg font-medium">分析完成！</p>
                        <p className="text-sm">您的书签已经整理得很好了</p>
                        <button
                          onClick={onClose}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          关闭
                        </button>
                      </>
                    ) : (
                      <>
                        <Filter className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-sm">该筛选条件下没有建议</p>
                        <button
                          onClick={() => setFilter('all')}
                          className="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                          查看全部
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  filteredSuggestions.map((suggestion) => {
                    const badge = getConfidenceBadge(suggestion.confidence)
                    const BadgeIcon = badge.icon

                    return (
                      <motion.div
                        key={suggestion.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`border-2 rounded-lg p-4 ${getConfidenceColor(suggestion.confidence)}`}>
                        
                        {/* Confidence Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`flex items-center gap-2 ${badge.color}`}>
                            <BadgeIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{badge.text}</span>
                          </div>
                          {suggestion.confidence === 'high' && (
                            <span className="px-2 py-1 bg-white/50 rounded text-xs">推荐采用</span>
                          )}
                        </div>

                        {/* Bookmark Info */}
                        <h3 className="font-semibold text-gray-900 mb-1">{suggestion.bookmarkTitle}</h3>
                        <p className="text-xs text-gray-500 mb-3 truncate">{suggestion.bookmarkUrl}</p>

                        {/* Suggestions */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                            <div className="text-sm">
                              <span className="text-gray-600">分类：</span>
                              {suggestion.originalCategory && (
                                <span className="line-through text-gray-500 mr-2">{suggestion.originalCategory}</span>
                              )}
                              <span className="font-medium">→ {suggestion.suggestedCategory}</span>
                            </div>
                          </div>

                          {suggestion.suggestedAlias && (
                            <div className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                              <div className="text-sm">
                                <span className="text-gray-600">别名：</span>
                                <span className="font-medium">{suggestion.suggestedAlias}</span>
                                <span className="text-xs text-gray-500 ml-2">(快速访问)</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                            <div className="text-sm">
                              <span className="text-gray-600">标签：</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {suggestion.suggestedTags.map((tag, index) => (
                                  <span key={index} className="px-2 py-0.5 bg-white/70 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Reason */}
                        <div className="bg-white/50 rounded p-2 mb-4">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">分析依据：</span>
                            {suggestion.reason}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(suggestion)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="font-medium">采纳</span>
                          </button>
                          <button
                            onClick={() => handleReject(suggestion.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                            <span className="font-medium">忽略</span>
                          </button>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              {suggestions.length > 0 && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>还有 {suggestions.length} 个建议待处理</span>
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                      稍后处理
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
