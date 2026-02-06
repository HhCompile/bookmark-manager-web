import {
  ExternalLink,
  Lock,
  AlertCircle,
  Tag,
  MoreVertical,
} from 'lucide-react';
import { Bookmark } from '../../contexts/BookmarkContext';

// 标签颜色数组
const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

// 根据标签名称获取颜色
const getTagColor = (tagName: string) => {
  const hash = tagName
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tagColors[hash % tagColors.length];
};

interface CardViewProps {
  bookmarks: Bookmark[];
}

export default function CardView({ bookmarks }: CardViewProps) {
  const handleQuickOpen = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {bookmarks.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          暂无书签
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
          >
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
                <h3 className="font-medium text-gray-900 truncate flex-1">
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

              <p className="text-sm text-gray-500 truncate mb-3">
                {bookmark.url}
              </p>

              {/* 标签 */}
              {bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {bookmark.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
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
                  {bookmark.addedDate.toLocaleDateString('zh-CN')}
                </span>
                <button
                  onClick={() => handleQuickOpen(bookmark.url)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  打开
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
