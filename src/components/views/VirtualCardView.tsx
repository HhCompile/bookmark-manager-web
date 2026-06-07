/**
 * 虚拟卡片视图
 * 使用 ahooks 的 useVirtualList 优化大量书签的性能
 * 只渲染可视区域内的书签卡片
 */

import { useRef, memo } from 'react';
import { useVirtualList } from 'ahooks';
import {
  ExternalLink,
  Lock,
  AlertCircle,
  Tag,
  MoreVertical,
} from 'lucide-react';
import { Bookmark } from '@/types/bookmark';
import { getTagColor, formatDate } from '@/utils';

interface VirtualCardViewProps {
  bookmarks: Bookmark[];
  itemHeight?: number;
  overscan?: number;
}

// 单个卡片组件 - 使用 memo 优化
const VirtualBookmarkCard = memo(({ 
  bookmark 
}: { 
  bookmark: Bookmark 
}) => {
  const handleQuickOpen = () => {
    window.open(bookmark.url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group h-full">
      {/* 卡片封面 */}
      <div className="h-28 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {bookmark.favicon}
        </div>
        {bookmark.isLocked && (
          <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
        {bookmark.isDead && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 rounded text-white text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            失效
          </div>
        )}
      </div>

      {/* 卡片内容 */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 truncate flex-1" title={bookmark.title}>
            {bookmark.title}
          </h3>
          <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {bookmark.alias && (
          <div className="mb-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
              别名: {bookmark.alias}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-500 truncate mb-3" title={bookmark.url}>
          {bookmark.url}
        </p>

        {/* 标签 */}
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bookmark.tags.slice(0, 3).map((tag: string, idx: number) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${getTagColor(tag)}`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {bookmark.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                +{bookmark.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {formatDate(bookmark.addedDate)}
          </span>
          <button
            onClick={handleQuickOpen}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            打开
          </button>
        </div>
      </div>
    </div>
  );
});

VirtualBookmarkCard.displayName = 'VirtualBookmarkCard';

export default function VirtualCardView({
  bookmarks,
  itemHeight = 280,
  overscan = 5,
}: VirtualCardViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用 useVirtualList 实现虚拟滚动
  const [list] = useVirtualList(bookmarks, {
    containerTarget: containerRef,
    wrapperTarget: null,
    itemHeight,
    overscan,
  });

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无书签
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-280px)] overflow-auto"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div style={{ height: list.length * itemHeight }} className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-4">
          {list.map((item: { index: number; data: Bookmark }) => (
            <VirtualBookmarkCard key={item.data.id} bookmark={item.data} />
          ))}
        </div>
      </div>
    </div>
  );
}
