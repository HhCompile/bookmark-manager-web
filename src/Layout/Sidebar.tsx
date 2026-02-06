import { Folder, Lock, ChevronRight, Tag } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarkContext';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useMemo } from 'react';

interface SidebarProps {
  onNavigate?: (tab: string) => void;
}

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

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { folders, selectedFolder, setSelectedFolder, bookmarks } =
    useBookmarks();

  // 使用useMemo缓存计算结果，避免重复计算
  const getBookmarkCount = useMemo(() => {
    return (folderId: string) => {
      const folderName = folders.find((f) => f.id === folderId)?.name;
      if (!folderName) return 0;
      return bookmarks.filter((b) => b.category === folderName).length;
    };
  }, [bookmarks, folders]);

  // 使用useMemo缓存标签计算结果，避免重复计算
  const tagCounts = useMemo(() => {
    const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));
    return allTags.map((tag) => ({
      name: tag,
      count: bookmarks.filter((b) => b.tags.includes(tag)).length,
    }));
  }, [bookmarks]);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            书签分组
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === null
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span className="flex-1 text-left">全部书签</span>
              <span className="text-sm text-gray-500">{bookmarks.length}</span>
            </button>

            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {folder.name === '私密学习库' ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Folder className="w-4 h-4" />
                )}
                <span className="flex-1 text-left">{folder.name}</span>
                <span className="text-sm text-gray-500">
                  {getBookmarkCount(folder.id)}
                </span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => onNavigate?.('analytics')}
            className="text-sm font-semibold text-gray-500 uppercase mb-3 hover:text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            标签云
            <Tag className="w-3 h-3" />
          </button>
          <div className="grid grid-cols-2 gap-2">
            {tagCounts.map((tag) => (
              <Tooltip.Root key={tag.name}>
                <Tooltip.Trigger asChild>
                  <button
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm hover:opacity-90 transition-colors ${getTagColor(tag.name)} truncate`}
                    title={tag.name}
                  >
                    <Tag className="w-3 h-3 flex-shrink-0" />
                    <span className="flex-1 truncate">{tag.name}</span>
                    <span className="text-xs opacity-70 flex-shrink-0">
                      ({tag.count})
                    </span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                    <Tooltip.Arrow className="fill-gray-900" />
                    {tag.name}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
