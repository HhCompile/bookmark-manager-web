import { ExternalLink, Trash2, Folder, Tag } from 'lucide-react';
import BookmarkListItem from './BookmarkList';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
}

interface BookmarkTableProps {
  bookmarks: Bookmark[];
  selectedBookmarks: string[];
  onToggleSelection: (url: string) => void;
  onDelete: (url: string) => void;
  onOpen: (url: string) => void;
  toggleSelectAll: () => void;
  allSelected: boolean;
}

export default function BookmarkTable({
  bookmarks,
  selectedBookmarks,
  onToggleSelection,
  onDelete,
  onOpen,
  toggleSelectAll,
  allSelected,
}: BookmarkTableProps) {
  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-gray-50/50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-10"
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-primary rounded border-input focus:ring-primary"
              />
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
            >
              标题
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
            >
              URL
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
            >
              分类
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
            >
              标签
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-border">
          {bookmarks.map((bookmark, index) => (
            <BookmarkListItem
              key={index}
              bookmark={bookmark}
              isSelected={selectedBookmarks.includes(bookmark.url)}
              onToggleSelection={onToggleSelection}
              onDelete={onDelete}
              onOpen={onOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
