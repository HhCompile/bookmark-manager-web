import { X, Check, AlertTriangle, ChevronRight, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

interface AIConfirmationPanelProps {
  onClose: () => void
}

interface AISuggestion {
  id: string
  bookmarkTitle: string
  originalCategory?: string
  suggestedCategory: string
  suggestedAlias?: string
  suggestedTags: string[]
  confidence: 'high' | 'medium' | 'low'
  reason: string
}

const mockSuggestions: AISuggestion[] = [
  {
    id: '1',
    bookmarkTitle: 'GitHub - React',
    originalCategory: '未分类',
    suggestedCategory: '开发工具',
    suggestedAlias: 'gh-react',
    suggestedTags: ['前端', 'React', '开源'],
    confidence: 'high',
    reason: '检测到 GitHub 链接和 React 关键词，高度确定属于开发工具分类'
  },
  {
    id: '2',
    bookmarkTitle: 'Notion 学习笔记',
    originalCategory: '未分类',
    suggestedCategory: '工作',
    suggestedAlias: 'notes',
    suggestedTags: ['笔记', '生产力', '个人'],
    confidence: 'medium',
    reason: 'Notion 可能属于"工作"或"笔记"分类，需要手动确认'
  },
  {
    id: '3',
    bookmarkTitle: 'Dribbble - Design Inspiration',
    originalCategory: '未分类',
    suggestedCategory: '灵感素材',
    suggestedAlias: 'dribbble',
    suggestedTags: ['设计', '灵感', 'UI'],
    confidence: 'high',
    reason: '检测到 Dribbble 设计网站，确定属于灵感素材分类'
  },
  {
    id: '4',
    bookmarkTitle: '在线工具集合',
    originalCategory: '未分类',
    suggestedCategory: '开发工具',
    suggestedTags: ['工具', '效率'],
    confidence: 'low',
    reason: '标题较为模糊，无法准确判断具体分类'
  }
]

export default function AIConfirmationPanel({ onClose }: AIConfirmationPanelProps) {
  const [suggestions, setSuggestions] = useState(mockSuggestions)
  const [acceptedCount, setAcceptedCount] = useState(0)

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 border-green-300 text-green-700'
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-700'
      case 'low':
        return 'bg-red-100 border-red-300 text-red-700'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700'
    }
  }

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return { icon: Check, text: '高置信度', color: 'text-green-700' }
      case 'medium':
        return {
          icon: AlertTriangle,
          text: '需确认',
          color: 'text-yellow-700'
        }
      case 'low':
        return { icon: AlertTriangle, text: '低置信度', color: 'text-red-700' }
      default:
        return { icon: AlertTriangle, text: '未知', color: 'text-gray-700' }
    }
  }

  const handleAccept = (id: string) => {
    setSuggestions((prev: AISuggestion[]) => prev.filter((s: AISuggestion) => s.id !== id))
    setAcceptedCount((prev: number) => prev + 1)
  }

  const handleReject = (id: string) => {
    setSuggestions((prev: AISuggestion[]) => prev.filter((s: AISuggestion) => s.id !== id))
  }

  const handleAcceptAll = () => {
    const highConfidence = suggestions.filter((s: AISuggestion) => s.confidence === 'high')
    setSuggestions((prev: AISuggestion[]) => prev.filter((s: AISuggestion) => s.confidence !== 'high'))
    setAcceptedCount((prev: number) => prev + highConfidence.length)
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
                  发现 {suggestions.length} 个优化建议，已接受 {acceptedCount} 个
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAcceptAll}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ThumbsUp className="w-5 h-5" />
                一键采用全部高置信度建议
              </button>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Check className="w-16 h-16 mb-4 text-green-500" />
                <p className="text-lg font-medium">全部处理完成！</p>
                <p className="text-sm">您已处理所有 AI 建议</p>
              </div>
            ) : (
              suggestions.map((suggestion) => {
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

                    {/* Bookmark Title */}
                    <h3 className="font-semibold text-gray-900 mb-2">{suggestion.bookmarkTitle}</h3>

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
                      <p className="text-xs text-gray-600">{suggestion.reason}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(suggestion.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-medium">接受</span>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
