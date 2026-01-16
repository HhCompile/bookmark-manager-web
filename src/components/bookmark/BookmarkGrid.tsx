import { ExternalLink, Trash2 } from 'lucide-react';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
}

interface BookmarkGridItemProps {
  bookmark: Bookmark;
  isSelected: boolean;
  onToggleSelection: (url: string) => void;
  onDelete: (url: string) => void;
  onOpen: (url: string) => void;
}

// 书签网格项组件
export default function BookmarkGridItem({
  bookmark,
  isSelected,
  onToggleSelection,
  onDelete,
  onOpen,
}: BookmarkGridItemProps) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelection(bookmark.url)}
          className="h-4 w-4 text-primary rounded border-input focus:ring-primary"
        />
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-text-primary max-w-xs truncate">
          {bookmark.title || '无标题'}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-text-secondary max-w-xs truncate">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:underline transition-colors"
          >
            {bookmark.url}
          </a>
        </div>
      </td>
      <td className="px-4 py-3">
        {bookmark.category && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {bookmark.category}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 2).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
              >
                {tag}
              </span>
            ))}
            {bookmark.tags.length > 2 && (
              <span className="text-xs text-text-secondary">
                +{bookmark.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onOpen(bookmark.url)}
          className="text-primary hover:text-primary-dark mr-3 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(bookmark.url)}
          className="text-error hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
