import { Folder, Lock, ChevronRight, Tag, Home, BarChart3, Shield, Target } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarkContext';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useMemo } from 'react';

interface SidebarProps {
  onNavigate?: (tab: string) => void;
  activeTab?: string;
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

export default function Sidebar({ onNavigate, activeTab = 'bookmarks' }: SidebarProps) {
  const { folders, selectedFolder, setSelectedFolder, bookmarks, setSearchQuery } =
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

  // 处理标签点击 - 设置搜索关键词
  const handleTagClick = (tagName: string) => {
    setSearchQuery(tagName);
    // 如果当前不在书签管理页面，导航到书签管理
    if (activeTab !== 'bookmarks') {
      onNavigate?.('bookmarks');
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* 主导航 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            导航
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => onNavigate?.('home')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="flex-1 text-left">首页</span>
            </button>
            <button
              onClick={() => onNavigate?.('bookmarks')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'bookmarks'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span className="flex-1 text-left">书签管理</span>
              <span className="text-sm text-gray-500">{bookmarks.length}</span>
            </button>
            <button
              onClick={() => onNavigate?.('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="flex-1 text-left">数据分析</span>
            </button>
            <button
              onClick={() => onNavigate?.('quality')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'quality'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="flex-1 text-left">质量监控</span>
            </button>
            <button
              onClick={() => onNavigate?.('private')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'private'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="flex-1 text-left">隐私空间</span>
            </button>
          </div>
        </div>

        {/* 书签分组 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            书签分组
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === null && activeTab === 'bookmarks'
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
                onClick={() => {
                  setSelectedFolder(folder.id);
                  if (activeTab !== 'bookmarks') {
                    onNavigate?.('bookmarks');
                  }
                }}
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

        {/* 标签云 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              标签云
            </h2>
            <button
              onClick={() => onNavigate?.('analytics')}
              className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              查看全部
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {tagCounts.slice(0, 10).map((tag) => (
              <Tooltip.Root key={tag.name}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => handleTagClick(tag.name)}
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
                    点击搜索: {tag.name}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>
          {tagCounts.length > 10 && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              还有 {tagCounts.length - 10} 个标签...
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
