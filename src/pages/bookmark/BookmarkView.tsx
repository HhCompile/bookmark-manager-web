import { LayoutList, LayoutGrid, Network } from 'lucide-react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import TreeView from '../../components/views/TreeView';
import ListView from '../../components/views/ListView';
import CardView from '../../components/views/CardView';

export default function BookmarkView() {
  const {
    viewMode,
    setViewMode,
    bookmarks,
    selectedFolder,
    folders,
    searchQuery,
  } = useBookmarks();

  // 过滤书签
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    // 文件夹过滤
    if (selectedFolder) {
      const folder = folders.find((f) => f.id === selectedFolder);
      if (folder && bookmark.category !== folder.name) return false;
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        bookmark.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        (bookmark.alias && bookmark.alias.toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* 视图切换器 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedFolder
            ? folders.find((f) => f.id === selectedFolder)?.name
            : '全部书签'}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredBookmarks.length})
          </span>
        </h2>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="列表视图"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'card'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="卡片视图"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'tree'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="树状视图"
          >
            <Network className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 视图内容 */}
      <div>
        {viewMode === 'list' && <ListView bookmarks={filteredBookmarks} />}
        {viewMode === 'card' && <CardView bookmarks={filteredBookmarks} />}
        {viewMode === 'tree' && <TreeView bookmarks={filteredBookmarks} />}
      </div>
    </div>
  );
}
