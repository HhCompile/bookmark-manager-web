import { AlertTriangle, X } from 'lucide-react';

interface DuplicateGroupProps {
  bookmarks: any[];
  onRemoveBookmark: (url: string) => void;
  onKeepBookmark: (url: string) => void;
}

/**
 * 重复书签组组件
 * 显示一组重复的书签并提供操作选项
 */
export default function DuplicateGroup({
  bookmarks,
  onRemoveBookmark,
  onKeepBookmark,
}: DuplicateGroupProps) {
  if (bookmarks.length === 0) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-gray-50/50 p-4 border-b border-border">
        <h3 className="font-medium text-text-primary flex items-center">
          <AlertTriangle className="w-4 h-4 text-warning mr-2" />
          重复书签组
        </h3>
      </div>

      <div className="divide-y divide-border">
        {bookmarks.map((bookmark, index) => (
          <div
            key={index}
            className="p-4 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-text-primary mb-1">
                  {bookmark.title || '无标题'}
                </h4>
                <p className="text-sm text-text-secondary truncate mb-2">
                  {bookmark.url}
                </p>
                <div className="flex flex-wrap gap-2">
                  {bookmark.tags.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onKeepBookmark(bookmark.url)}
                  className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  保留
                </button>
                <button
                  onClick={() => onRemoveBookmark(bookmark.url)}
                  className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
