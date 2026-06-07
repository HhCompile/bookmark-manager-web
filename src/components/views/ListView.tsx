/**
 * 列表视图
 * 使用表格布局展示书签列表
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
import { getTagColor, formatDate, getCategoryColor } from '@/utils';
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

interface ListViewProps {
  bookmarks: Bookmark[];
  isPreview?: boolean; // 是否为预览模式（始终显示操作按钮）
}

// 单个行组件 - 使用 memo 优化
interface BookmarkRowProps {
  bookmark: Bookmark;
  isPreview?: boolean;
}

const BookmarkRow = memo(({ bookmark, isPreview: _isPreview }: BookmarkRowProps) => {
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
      <tr className="hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-b-0">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{bookmark.favicon || '🔖'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                  title={bookmark.title}
                >
                  {bookmark.title}
                </p>
                {bookmark.alias && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded whitespace-nowrap">
                    {bookmark.alias}
                  </span>
                )}
                {bookmark.isLocked && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Lock className="w-4 h-4 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>已锁定</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {bookmark.isDead && (
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>链接失效</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p
                className="text-sm text-gray-500 truncate max-w-[250px]"
                title={bookmark.url}
              >
                {bookmark.url}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col gap-1">
            {bookmark.category ? (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full w-fit ${getCategoryColor(
                  bookmark.category
                )}`}
              >
                <FolderOpen className="w-3 h-3" />
                {bookmark.category}
              </span>
            ) : (
              <span className="text-gray-400 text-xs">未分类</span>
            )}
            {bookmarkFolders.length > 0 && (
              <span className="text-xs text-gray-500">
                位于: {bookmarkFolders.map((f) => f.name).join(', ')}
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 5).map((tag, index) => (
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
            {bookmark.tags.length > 5 && (
              <Tooltip>
                <TooltipTrigger>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded cursor-pointer">
                    +{bookmark.tags.length - 5}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>还有 {bookmark.tags.length - 5} 个标签</p>
                </TooltipContent>
              </Tooltip>
            )}
            {bookmark.tags.length === 0 && (
              <span className="text-gray-400 text-xs">无标签</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          {formatDate(bookmark.addedDate)}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleQuickOpen}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>打开链接</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>编辑书签</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>删除书签</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </td>
      </tr>

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

BookmarkRow.displayName = 'BookmarkRow';

// 主组件
function ListView({ bookmarks }: ListViewProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-12 text-center text-gray-500">暂无书签</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                书签
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[18%]">
                分类/文件夹
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[22%]">
                标签
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                添加日期
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookmarks.map((bookmark) => (
              <BookmarkRow key={bookmark.id || bookmark.url} bookmark={bookmark} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(ListView);
