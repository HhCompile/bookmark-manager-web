/**
 * 无限滚动列表视图
 * 使用 ahooks 的 useInfiniteScroll 实现无限加载
 * 适合大量书签的分页加载
 */

import { useRef, memo } from 'react';
import { useInfiniteScroll } from 'ahooks';
import {
  ExternalLink,
  Lock,
  AlertCircle,
  Tag,
  Trash2,
  Edit,
  Loader2,
} from 'lucide-react';
import { Bookmark } from '@/types/bookmark';
import { getTagColor, formatDate, getCategoryColor } from '@/utils';

interface InfiniteListViewProps {
  bookmarks: Bookmark[];
  pageSize?: number;
}

// 单个行组件 - 使用 memo 优化
const BookmarkRow = memo(({ bookmark }: { bookmark: Bookmark }) => {
  const handleQuickOpen = () => {
    window.open(bookmark.url, '_blank');
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{bookmark.favicon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900 truncate" title={bookmark.title}>
                {bookmark.title}
              </p>
              {bookmark.alias && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                  {bookmark.alias}
                </span>
              )}
              {bookmark.isLocked && (
                <Lock className="w-4 h-4 text-amber-500" />
              )}
              {bookmark.isDead && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 truncate" title={bookmark.url}>
              {bookmark.url}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(bookmark.category)}`}>
          {bookmark.category || '未分类'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {bookmark.tags.slice(0, 5).map((tag: string, index: number) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${getTagColor(tag)}`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {bookmark.tags.length > 5 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              +{bookmark.tags.length - 5}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(bookmark.addedDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleQuickOpen}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="快速打开"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

BookmarkRow.displayName = 'BookmarkRow';

// 模拟分页加载
const mockLoadMore = async (
  allBookmarks: Bookmark[],
  page: number,
  pageSize: number
): Promise<{ list: Bookmark[]; hasMore: boolean }> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = allBookmarks.slice(start, end);
  const hasMore = end < allBookmarks.length;
  
  return { list, hasMore };
};

export default function InfiniteListView({
  bookmarks,
  pageSize = 20,
}: InfiniteListViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用 useInfiniteScroll 实现无限滚动
  const { data, loadingMore, noMore } = useInfiniteScroll(
    async (currentData) => {
      const currentPage = currentData ? Math.ceil(currentData.list.length / pageSize) + 1 : 1;
      const result = await mockLoadMore(bookmarks, currentPage, pageSize);
      
      return {
        list: result.list,
        hasMore: result.hasMore,
      };
    },
    {
      target: containerRef,
      isNoMore: (data) => !data?.hasMore,
      threshold: 100,
    }
  );

  const displayedBookmarks = data?.list || [];

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
      className="bg-white rounded-lg border border-gray-200 overflow-hidden max-h-[calc(100vh-280px)] overflow-auto"
    >
      <table className="w-full table-fixed">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
              书签
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
              分类
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
              标签
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
              添加日期
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {displayedBookmarks.map((bookmark) => (
            <BookmarkRow key={bookmark.id} bookmark={bookmark} />
          ))}
        </tbody>
      </table>

      {/* 加载状态 */}
      {loadingMore && (
        <div className="py-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-gray-500 mt-2">加载更多...</p>
        </div>
      )}

      {/* 没有更多数据 */}
      {noMore && displayedBookmarks.length > 0 && (
        <div className="py-4 text-center text-gray-400 text-sm">
          已加载全部 {bookmarks.length} 条书签
        </div>
      )}
    </div>
  );
}
