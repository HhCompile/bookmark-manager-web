/**
 * 卡片视图
 * 使用网格布局展示书签卡片
 */

import { memo, useCallback, useState } from 'react';
import {
  ExternalLink,
  Lock,
  AlertCircle,
  Tag,
  Trash2,
  Edit,
  FolderOpen,
} from 'lucide-react';
import { Bookmark } from '@/contexts/BookmarkContext';
import { getTagColor, formatDate } from '@/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useBookmarkContext } from '@/contexts/BookmarkContext';
import { useDeleteBookmark } from '@/hooks';
import { toast } from 'sonner';
import { BookmarkEditDialog } from '@/components/bookmark/BookmarkEditDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CardViewProps {
  bookmarks: Bookmark[];
}

// 单个卡片组件 - 使用 memo 优化
const BookmarkCard = memo(({ bookmark }: { bookmark: Bookmark }) => {
  const { folders } = useBookmarkContext();
  const deleteBookmark = useDeleteBookmark();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleQuickOpen = useCallback(() => {
    window.open(bookmark.url, '_blank');
  }, [bookmark.url]);

  const handleDelete = async () => {
    if (!bookmark.url) return;
    try {
      await deleteBookmark.mutateAsync(bookmark.url);
      toast.success('书签已删除');
    } catch {
      toast.error('删除失败');
    }
  };

  // 查找书签所属文件夹
  const bookmarkFolders = folders.filter((f) =>
    f.bookmarks?.includes(bookmark.id || '')
  );

  return (
    <>
      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* 卡片封面 */}
        <div className="h-28 bg-gradient-to-br from-blue-500 to-purple-600 relative">
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {bookmark.favicon || '🔖'}
          </div>
          {bookmark.isLocked && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full cursor-help">
                  <Lock className="w-4 h-4 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>已锁定</p>
              </TooltipContent>
            </Tooltip>
          )}
          {bookmark.isDead && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 rounded text-white text-xs flex items-center gap-1 cursor-help">
                  <AlertCircle className="w-3 h-3" />
                  失效
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>链接可能已失效</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* 卡片内容 */}
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <h3
              className="font-medium text-gray-900 truncate flex-1 pr-2"
              title={bookmark.title}
            >
              {bookmark.title}
            </h3>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>编辑</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>删除</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {bookmark.alias && (
            <div className="mb-2">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                别名: {bookmark.alias}
              </span>
            </div>
          )}

          <p className="text-sm text-gray-500 truncate mb-2" title={bookmark.url}>
            {bookmark.url}
          </p>

          {/* 分类和文件夹 */}
          <div className="mb-3">
            {bookmark.category ? (
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <FolderOpen className="w-3 h-3" />
                <span>{bookmark.category}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">未分类</span>
            )}
            {bookmarkFolders.length > 0 && (
              <div className="text-xs text-gray-500">
                位于: {bookmarkFolders.map((f) => f.name).join(', ')}
              </div>
            )}
          </div>

          {/* 标签 */}
          {bookmark.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 mb-3">
              {bookmark.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${getTagColor(
                    tag
                  )}`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {bookmark.tags.length > 3 && (
                <Tooltip>
                  <TooltipTrigger>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded cursor-pointer">
                      +{bookmark.tags.length - 3}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      还有 {bookmark.tags.length - 3} 个标签:{' '}
                      {bookmark.tags.slice(3).join(', ')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-400 mb-3">无标签</div>
          )}

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {formatDate(bookmark.addedDate)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleQuickOpen}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  打开
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>在新标签页打开</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <BookmarkEditDialog
        bookmark={bookmark}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除书签「{bookmark.title}」吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

BookmarkCard.displayName = 'BookmarkCard';

// 主组件
function CardView({ bookmarks }: CardViewProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        暂无书签
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id || bookmark.url} bookmark={bookmark} />
      ))}
    </div>
  );
}

export default memo(CardView);
