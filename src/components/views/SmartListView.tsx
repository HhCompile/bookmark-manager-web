/**
 * 智能列表视图
 * 特性：
 * - 序号展示
 * - 真实网站图标
 * - 别名展示
 * - AI 智能标签
 * - 访问统计
 */

import { useState, useCallback, useMemo } from 'react';
import {
  ExternalLink,
  Lock,
  AlertCircle,
  Tag,
  Trash2,
  Edit,
  Star,
  Sparkles,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';
import { Bookmark } from '@/types/bookmark';
import Favicon from '@/components/ui/Favicon';
import { useRecordBookmarkVisit } from '@/api/bookmarks';

// 标签颜色数组
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

interface SmartListViewProps {
  bookmarks: Bookmark[];
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
  onOpen?: (bookmark: Bookmark) => void;
  showAIInsights?: boolean;
}

// 单行组件
interface BookmarkRowProps {
  bookmark: Bookmark;
  index: number;
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
  onOpen?: (bookmark: Bookmark) => void;
  showAIInsights: boolean;
  recordVisit: (url: string) => void;
}

const BookmarkRow = ({ 
  bookmark, 
  index, 
  onEdit, 
  onDelete, 
  onOpen, 
  showAIInsights,
  recordVisit 
}: BookmarkRowProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // 获取元数据
  const metadata = bookmark.metadata;
  const alias = metadata?.alias || bookmark.alias;
  const isFavorite = metadata?.is_favorite;
  const visitCount = metadata?.visit_count || 0;
  const customTags = metadata?.custom_tags || [];
  
  // 合并标签
  const allTags = useMemo(() => {
    const tags = new Set([...bookmark.tags, ...customTags]);
    return Array.from(tags).slice(0, 4);
  }, [bookmark.tags, customTags]);
  
  const handleOpen = useCallback(() => {
    recordVisit(bookmark.url);
    window.open(bookmark.url, '_blank');
    onOpen?.(bookmark);
  }, [bookmark, onOpen, recordVisit]);
  
  return (
    <div
      className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-blue-50/50 transition-colors group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 序号 */}
      <div className="w-12 flex-shrink-0 text-sm text-gray-400 font-mono text-center">
        {index + 1}
      </div>
      
      {/* 图标 */}
      <div className="w-10 flex-shrink-0 flex justify-center">
        <Favicon url={bookmark.url} size={32} />
      </div>
      
      {/* 标题和URL */}
      <div className="flex-1 min-w-0 px-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 truncate" title={bookmark.title}>
            {bookmark.title}
          </h3>
          
          {/* 别名 */}
          {alias && (
            <span className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full border border-purple-200">
              {alias}
            </span>
          )}
          
          {/* AI 智能标签 */}
          {showAIInsights && bookmark.category && (
            <span className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs rounded-full border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {bookmark.category}
            </span>
          )}
          
          {/* 状态图标 */}
          {isFavorite && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
          )}
          {bookmark.isLocked && (
            <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
          )}
          {bookmark.isDead && (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
        </div>
        
        <p className="text-sm text-gray-500 truncate" title={bookmark.url}>
          {bookmark.url}
        </p>
      </div>
      
      {/* 分类 */}
      <div className="w-28 flex-shrink-0 px-2">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
          <FolderOpen className="w-3 h-3" />
          {bookmark.category || '未分类'}
        </span>
      </div>
      
      {/* 标签 */}
      <div className="w-40 flex-shrink-0 px-2">
        <div className="flex flex-wrap gap-1">
          {allTags.map((tag, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${getTagColor(tag)}`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {bookmark.tags.length + customTags.length > 4 && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
              +{bookmark.tags.length + customTags.length - 4}
            </span>
          )}
        </div>
      </div>
      
      {/* 访问统计 */}
      <div className="w-20 flex-shrink-0 px-2 text-center">
        {visitCount > 0 ? (
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            {visitCount}
          </div>
        ) : (
          <span className="text-gray-300 text-sm">-</span>
        )}
      </div>
      
      {/* 日期 */}
      <div className="w-24 flex-shrink-0 px-2 text-sm text-gray-500 text-center">
        {bookmark.addedDate 
          ? new Date(bookmark.addedDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
          : '-'
        }
      </div>
      
      {/* 操作按钮 */}
      <div className={`w-28 flex-shrink-0 flex items-center justify-end gap-1 transition-opacity ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={handleOpen}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          title="打开"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
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
      </div>
    </div>
  );
};

// 表头组件
const TableHeader = () => (
  <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10">
    <div className="w-12 text-center">#</div>
    <div className="w-10 text-center">图标</div>
    <div className="flex-1 px-4">书签</div>
    <div className="w-28 px-2">分类</div>
    <div className="w-40 px-2">标签</div>
    <div className="w-20 px-2 text-center">访问</div>
    <div className="w-24 px-2 text-center">添加日期</div>
    <div className="w-28 text-right">操作</div>
  </div>
);

export default function SmartListView({ 
  bookmarks, 
  onEdit, 
  onDelete, 
  onOpen,
  showAIInsights = true 
}: SmartListViewProps) {
  const recordVisitMutation = useRecordBookmarkVisit();
  
  const recordVisit = useCallback((url: string) => {
    recordVisitMutation.mutate({ url });
  }, [recordVisitMutation]);
  
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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-h-[calc(100vh-280px)] overflow-y-auto">
      <TableHeader />
      
      <div className="divide-y divide-gray-100">
        {bookmarks.map((bookmark, index) => (
          <BookmarkRow
            key={bookmark.id}
            bookmark={bookmark}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpen={onOpen}
            showAIInsights={showAIInsights}
            recordVisit={recordVisit}
          />
        ))}
      </div>
      
      {/* 底部统计 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>共 {bookmarks.length} 个书签</span>
          {showAIInsights && (
            <span className="flex items-center gap-1 text-amber-600">
              <Sparkles className="w-4 h-4" />
              AI 智能分类已启用
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
