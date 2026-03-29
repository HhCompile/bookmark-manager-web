import { LayoutList, LayoutGrid, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import TreeView from '../../components/views/TreeView';
import ListView from '../../components/views/ListView';
import CardView from '../../components/views/CardView';
import { useBookmarks, useFolders } from '../../hooks';
import type { ViewMode } from '../../types/bookmark';

export default function BookmarkView() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('folder');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const { data: folders = [] } = useFolders();
  const { data: bookmarks = [] } = useBookmarks({ 
    folderId: folderId || undefined,
    search: searchQuery || undefined,
  });

  const currentFolder = folderId 
    ? folders.find((f) => f.id === folderId)
    : null;

  return (
    <div className="space-y-4">
      {/* 视图切换器 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {currentFolder ? currentFolder.name : t('bookmarks.title')}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({bookmarks.length})
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
            title={t('bookmarks.views.list')}
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
            title={t('bookmarks.views.card')}
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
            title={t('bookmarks.views.tree')}
          >
            <Network className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 视图内容 */}
      <div>
        {viewMode === 'list' && <ListView bookmarks={bookmarks} />}
        {viewMode === 'card' && <CardView bookmarks={bookmarks} />}
        {viewMode === 'tree' && <TreeView bookmarks={bookmarks} />}
      </div>
    </div>
  );
}
