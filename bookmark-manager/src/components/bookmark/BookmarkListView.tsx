import { ExternalLink, Trash2, Folder, Tag, Globe } from 'lucide-react';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
}

interface BookmarkListViewProps {
  bookmarks: Bookmark[];
  selectedBookmarks: string[];
  toggleBookmarkSelection: (url: string) => void;
  handleDelete: (url: string) => void;
}

export default function BookmarkListView({
  bookmarks,
  selectedBookmarks,
  toggleBookmarkSelection,
  handleDelete
}: BookmarkListViewProps) {
  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-surface">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider w-12">
              <input
                type="checkbox"
                checked={selectedBookmarks.length === bookmarks.length && bookmarks.length > 0}
                onChange={() => {
                  // This would need to be handled by the parent component
                }}
                className="h-4 w-4 text-primary rounded border-input focus:ring-primary focus:ring-2"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
              网站
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
              标题
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
              URL
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
              分类
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-gray uppercase tracking-wider">
              标签
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-gray uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-border">
          {bookmarks.map((bookmark, index) => (
            <tr key={index} className="hover:bg-blue-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedBookmarks.includes(bookmark.url)}
                  onChange={() => toggleBookmarkSelection(bookmark.url)}
                  className="h-4 w-4 text-primary rounded border-input focus:ring-primary focus:ring-2"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="bg-gray-200 border-2 border-dashed rounded-lg w-10 h-10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-text-dark max-w-xs truncate" title={bookmark.title}>{bookmark.title || '无标题'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-text-gray max-w-xs truncate">
                  <a 
                    href={bookmark.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline transition-colors"
                    title={bookmark.url}
                  >
                    {bookmark.url}
                  </a>
                </div>
              </td>
              <td className="px-6 py-4">
                {bookmark.category && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <Folder className="w-3 h-3 mr-1" />
                    {bookmark.category}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {bookmark.tags && bookmark.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {bookmark.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-2.5 h-2.5 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {bookmark.tags.length > 2 && (
                      <span className="text-xs text-text-gray">+{bookmark.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => window.open(bookmark.url, '_blank')}
                    className="btn btn-outline p-2"
                    title="打开链接"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(bookmark.url)}
                    className="btn btn-danger p-2"
                    title="删除书签"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}