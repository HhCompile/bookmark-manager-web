import {
  ExternalLink,
  Trash2,
  Folder,
  Tag,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
  isValid: boolean;
  alias?: string;
}

interface BookmarkGridViewProps {
  bookmarks: Bookmark[];
  selectedBookmarks: string[];
  toggleBookmarkSelection: (url: string) => void;
  handleDelete: (url: string) => void;
}

export default function BookmarkGridView({
  bookmarks,
  selectedBookmarks,
  toggleBookmarkSelection,
  handleDelete,
}: BookmarkGridViewProps) {
  const [expandedBookmarks, setExpandedBookmarks] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (url: string) => {
    setExpandedBookmarks(prev => ({
      ...prev,
      [url]: !prev[url],
    }));
  };

  // 获取分类颜色
  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-800';

    const colors: Record<string, string> = {
      技术: 'bg-blue-100 text-blue-800',
      新闻: 'bg-green-100 text-green-800',
      娱乐: 'bg-purple-100 text-purple-800',
      学习: 'bg-yellow-100 text-yellow-800',
      生活: 'bg-pink-100 text-pink-800',
      购物: 'bg-red-100 text-red-800',
      社交: 'bg-indigo-100 text-indigo-800',
    };

    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative"
        >
          {/* 有效性状态指示器 */}
          <div className="absolute top-3 right-3">
            {bookmark.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>

          {/* 分类角标 */}
          {bookmark.category && (
            <div
              className={`absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(bookmark.category)} shadow-sm`}
            >
              {bookmark.category}
            </div>
          )}

          <div className="p-5">
            {/* 顶部区域 - 网站图标和选择框 */}
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center">
                <Globe className="w-6 h-6 text-gray-400" />
              </div>
              <input
                type="checkbox"
                checked={selectedBookmarks.includes(bookmark.url)}
                onChange={() => toggleBookmarkSelection(bookmark.url)}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 mt-1"
              />
            </div>

            {/* 标题 */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {bookmark.title || '无标题'}
              {bookmark.alias && (
                <span className="block text-sm text-gray-500">
                  ({bookmark.alias})
                </span>
              )}
            </h3>

            {/* 链接 - 可折叠 */}
            <div className="mb-4">
              {bookmark.url.length > 40 && !expandedBookmarks[bookmark.url] ? (
                <div className="flex items-center">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline transition-colors truncate flex-1"
                    title={bookmark.url}
                  >
                    {bookmark.url.substring(0, 40)}...
                  </a>
                  <button
                    onClick={() => toggleExpand(bookmark.url)}
                    className="ml-1 text-gray-400 hover:text-blue-600 text-xs"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              ) : bookmark.url.length > 40 &&
                expandedBookmarks[bookmark.url] ? (
                <div>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline transition-colors break-all"
                  >
                    {bookmark.url}
                  </a>
                  <button
                    onClick={() => toggleExpand(bookmark.url)}
                    className="ml-1 text-gray-400 hover:text-blue-600 mt-1 text-xs"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline transition-colors break-all"
                >
                  {bookmark.url}
                </a>
              )}
            </div>

            {/* 标签 */}
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {bookmark.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="w-2.5 h-2.5 mr-1" />
                    {tag}
                  </span>
                ))}
                {bookmark.tags.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{bookmark.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => window.open(bookmark.url, '_blank')}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                title="打开链接"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                打开
              </button>
              <button
                onClick={() => handleDelete(bookmark.url)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
                title="删除书签"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                删除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
