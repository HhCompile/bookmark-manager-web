/**
 * AI 智能洞察面板
 * 展示 AI 分析的书签统计、推荐和优化建议
 */

import { useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  
  Tag,
  FolderOpen,
  Star,
  AlertCircle,
  Lightbulb,
  Zap,
  BarChart3,
} from 'lucide-react';
import { Bookmark } from '@/types/bookmark';

interface AIInsightsPanelProps {
  bookmarks: Bookmark[];
}

interface InsightStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function AIInsightsPanel({ bookmarks }: AIInsightsPanelProps) {
  // 计算统计数据
  const stats = useMemo(() => {
    const total = bookmarks.length;
    const favorites = bookmarks.filter(b => b.metadata?.is_favorite).length;
    const withAlias = bookmarks.filter(b => b.metadata?.alias || b.alias).length;
    const visited = bookmarks.filter(b => (b.metadata?.visit_count || 0) > 0).length;
    
    // 总访问次数
    const totalVisits = bookmarks.reduce((sum, b) => sum + (b.metadata?.visit_count || 0), 0);
    
    // 分类统计
    const categories = new Map<string, number>();
    bookmarks.forEach(b => {
      const cat = b.category || '未分类';
      categories.set(cat, (categories.get(cat) || 0) + 1);
    });
    const topCategory = [...categories.entries()].sort((a, b) => b[1] - a[1])[0];
    
    // 标签统计
    const tags = new Map<string, number>();
    bookmarks.forEach(b => {
      [...b.tags, ...(b.metadata?.custom_tags || [])].forEach(t => {
        tags.set(t, (tags.get(t) || 0) + 1);
      });
    });
    const topTag = [...tags.entries()].sort((a, b) => b[1] - a[1])[0];
    
    // 高频访问书签
    const topVisited = [...bookmarks]
      .sort((a, b) => (b.metadata?.visit_count || 0) - (a.metadata?.visit_count || 0))
      .slice(0, 3);
    
    return {
      total,
      favorites,
      withAlias,
      visited,
      totalVisits,
      topCategory: topCategory?.[0] || '-',
      topCategoryCount: topCategory?.[1] || 0,
      topTag: topTag?.[0] || '-',
      topTagCount: topTag?.[1] || 0,
      topVisited,
    };
  }, [bookmarks]);
  
  // 洞察卡片数据
  const insightCards: InsightStat[] = [
    {
      label: '总书签数',
      value: stats.total,
      icon: <FolderOpen className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: '已收藏',
      value: stats.favorites,
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: '带别名',
      value: stats.withAlias,
      icon: <Tag className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: '总访问',
      value: stats.totalVisits,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50',
    },
  ];
  
  // 生成建议
  const suggestions = useMemo(() => {
    const list: { type: 'info' | 'warning' | 'tip'; message: string }[] = [];
    
    if (stats.total > 0 && stats.withAlias / stats.total < 0.3) {
      list.push({
        type: 'tip',
        message: `只有 ${Math.round(stats.withAlias / stats.total * 100)}% 的书签设置了别名，建议为常用书签添加易记的别名`,
      });
    }
    
    if (stats.total > 100 && stats.visited / stats.total < 0.5) {
      list.push({
        type: 'warning',
        message: '超过半数的书签从未访问，建议清理或归档',
      });
    }
    
    if (stats.topCategoryCount > stats.total * 0.4) {
      list.push({
        type: 'info',
        message: `${stats.topCategory} 分类占比过高，建议进一步细分`,
      });
    }
    
    if (stats.favorites === 0 && stats.total > 10) {
      list.push({
        type: 'tip',
        message: '还没有收藏任何书签，点击星标收藏重要的书签吧',
      });
    }
    
    return list.slice(0, 3);
  }, [stats]);
  
  if (bookmarks.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <Sparkles className="w-5 h-5 text-amber-600" />
        <span className="font-semibold text-gray-900">AI 智能洞察</span>
      </div>
      
      <div className="p-4 space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-3">
          {insightCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className={`p-2 rounded-lg ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-xs text-gray-500">{card.label}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 热门分类和标签 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <FolderOpen className="w-4 h-4" />
              热门分类
            </div>
            <div className="font-medium text-gray-900">{stats.topCategory}</div>
            <div className="text-xs text-gray-500">{stats.topCategoryCount} 个书签</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Tag className="w-4 h-4" />
              热门标签
            </div>
            <div className="font-medium text-gray-900">{stats.topTag}</div>
            <div className="text-xs text-gray-500">{stats.topTagCount} 次使用</div>
          </div>
        </div>
        
        {/* 高频访问 */}
        {stats.topVisited.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Zap className="w-4 h-4 text-yellow-500" />
              高频访问
            </div>
            <div className="space-y-2">
              {stats.topVisited.map((bookmark, index) => (
                <a
                  key={bookmark.id || bookmark.url}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-xs font-mono text-gray-400">#{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {bookmark.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{bookmark.url}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    {bookmark.metadata?.visit_count || 0}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* AI 建议 */}
        {suggestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              智能建议
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                    suggestion.type === 'warning' 
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : suggestion.type === 'tip'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'bg-gray-50 text-gray-700 border border-gray-100'
                  }`}
                >
                  {suggestion.type === 'warning' ? (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : suggestion.type === 'tip' ? (
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <BarChart3 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  {suggestion.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
