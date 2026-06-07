/**
 * 智能卡片视图
 * 特性：
 * - 真实网站图标（大尺寸）
 * - AI 内容预览
 * - 别名展示
 * - 智能分类标签
 * - 访问频次可视化
 * - 悬停快捷操作
 */

import { useState, useCallback } from 'react';
import {
  ExternalLink,
  Lock,
  AlertCircle,
  Tag,
  
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  FolderOpen,
  Edit,
  Trash2,
  Copy,
  Check,
  Wand2,
} from 'lucide-react';
import { Bookmark } from '@/types/bookmark';
import Favicon from '@/components/ui/Favicon';
import { useRecordBookmarkVisit } from '@/api/bookmarks';

// 标签颜色
const tagColors = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-red-100 text-red-700 border-red-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-teal-100 text-teal-700 border-teal-200',
];

const getTagColor = (tagName: string) => {
  const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tagColors[hash % tagColors.length];
};

// 根据访问频次获取颜色
const getVisitColor = (count: number): string => {
  if (count >= 50) return 'text-purple-600 bg-purple-50';
  if (count >= 20) return 'text-blue-600 bg-blue-50';
  if (count >= 5) return 'text-green-600 bg-green-50';
  return 'text-gray-500 bg-gray-50';
};

interface SmartCardViewProps {
  bookmarks: Bookmark[];
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
  onOpen?: (bookmark: Bookmark) => void;
  showAIInsights?: boolean;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
  onOpen?: (bookmark: Bookmark) => void;
  showAIInsights: boolean;
}

// 单个卡片组件
const BookmarkCard = ({ 
  bookmark, 
  index, 
  onEdit, 
  onDelete, 
  onOpen, 
  showAIInsights 
}: BookmarkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const recordVisitMutation = useRecordBookmarkVisit();
  
  // 获取元数据
  const metadata = bookmark.metadata;
  const alias = metadata?.alias || bookmark.alias;
  const isFavorite = metadata?.is_favorite;
  const visitCount = metadata?.visit_count || 0;
  const lastVisited = metadata?.last_visited;
  const customTags = metadata?.custom_tags || [];
  
  // 合并标签
  const allTags = [...bookmark.tags, ...customTags];
  
  const handleOpen = useCallback(() => {
    recordVisitMutation.mutate({ url: bookmark.url });
    window.open(bookmark.url, '_blank');
    onOpen?.(bookmark);
  }, [bookmark, onOpen, recordVisitMutation]);
  
  const handleCopyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [bookmark.url]);
  
  // 计算卡片渐变背景
  const getGradient = () => {
    if (isFavorite) return 'from-yellow-400 to-orange-500';
    if (bookmark.isDead) return 'from-gray-400 to-gray-500';
    if (visitCount > 20) return 'from-purple-500 to-pink-500';
    if (visitCount > 5) return 'from-blue-500 to-cyan-500';
    return 'from-indigo-500 to-purple-600';
  };
  
  return (
    <div
      className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 顶部横幅 */}
      <div className={`h-24 bg-gradient-to-br ${getGradient()} relative overflow-hidden`}>
        {/* 装饰图案 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        
        {/* 图标 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <Favicon url={bookmark.url} size={48} />
          </div>
        </div>
        
        {/* 状态徽章 */}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* 序号 */}
          <span className="px-2 py-1 bg-black/30 backdrop-blur text-white text-xs font-mono rounded-md">
            #{index + 1}
          </span>
          
          {bookmark.isDead && (
            <span className="px-2 py-1 bg-red-500/80 backdrop-blur text-white text-xs rounded-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              失效
            </span>
          )}
        </div>
        
        {/* 右侧操作 */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleCopyUrl}
            className="p-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white rounded-lg transition-colors"
            title={copied ? '已复制' : '复制链接'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        
        {/* 收藏星标 */}
        {isFavorite && (
          <div className="absolute bottom-3 right-3">
            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 drop-shadow-md" />
          </div>
        )}
        
        {/* 锁定图标 */}
        {bookmark.isLocked && (
          <div className="absolute bottom-3 left-3">
            <div className="p-1.5 bg-black/30 backdrop-blur rounded-full">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* 卡片内容 */}
      <div className="p-4">
        {/* 标题和别名 */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1" title={bookmark.title}>
            {bookmark.title}
          </h3>
          
          {alias && (
            <div className="flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-purple-500" />
              <span className="text-sm text-purple-600 font-medium">{alias}</span>
            </div>
          )}
        </div>
        
        {/* URL */}
        <p className="text-xs text-gray-500 truncate mb-3" title={bookmark.url}>
          {bookmark.url}
        </p>
        
        {/* AI 智能分类 */}
        {showAIInsights && bookmark.category && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs rounded-md border border-amber-200">
              <Sparkles className="w-3 h-3" />
              {bookmark.category}
            </span>
          </div>
        )}
        
        {/* 标签 */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {allTags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${getTagColor(tag)}`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {allTags.length > 3 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                +{allTags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* 访问统计 */}
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getVisitColor(visitCount)}`}>
            <TrendingUp className="w-3 h-3" />
            <span>{visitCount} 次访问</span>
          </div>
          
          {lastVisited && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{new Date(lastVisited).toLocaleDateString('zh-CN')}</span>
            </div>
          )}
        </div>
        
        {/* 底部操作栏 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {bookmark.addedDate 
              ? new Date(bookmark.addedDate).toLocaleDateString('zh-CN')
              : '-'
            }
          </span>
          
          <div className={`flex items-center gap-1 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={() => onEdit?.(bookmark)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(bookmark)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpen}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              打开
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SmartCardView({ 
  bookmarks, 
  onEdit, 
  onDelete, 
  onOpen,
  showAIInsights = true 
}: SmartCardViewProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <FolderOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无书签</h3>
        <p className="text-gray-500">开始添加您的第一个书签吧</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 统计信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>共 {bookmarks.length} 个书签</span>
          {showAIInsights && (
            <span className="flex items-center gap-1 text-amber-600">
              <Sparkles className="w-4 h-4" />
              AI 智能分析已启用
            </span>
          )}
        </div>
      </div>
      
      {/* 卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {bookmarks.map((bookmark, index) => (
          <BookmarkCard
            key={bookmark.id || bookmark.url}
            bookmark={bookmark}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpen={onOpen}
            showAIInsights={showAIInsights}
          />
        ))}
      </div>
    </div>
  );
}
