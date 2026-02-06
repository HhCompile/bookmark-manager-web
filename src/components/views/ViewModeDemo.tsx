import { useState } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import ListView from './ListView';
import CardView from './CardView';
import TreeView from './TreeView';

interface ViewModeDemoProps {
  // 可选属性
  showTitle?: boolean;
}

export default function ViewModeDemo({ showTitle = true }: ViewModeDemoProps) {
  const { bookmarks, viewMode, setViewMode } = useBookmarks();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewModeChange = (mode: 'list' | 'card' | 'tree') => {
    setViewMode(mode);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-lg p-4 shadow-md">
      {showTitle && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">书签视图模式</h3>
          <button
            onClick={toggleExpanded}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {isExpanded ? '收起' : '查看示例'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => handleViewModeChange('list')}
          className={`p-3 bg-white rounded-lg border-2 ${viewMode === 'list' ? 'border-blue-500 shadow-md' : 'border-gray-200'} text-center transition-all hover:shadow-sm`}
        >
          <div className="mb-2 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${viewMode === 'list' ? 'text-blue-600' : 'text-gray-500'}`}>
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <h4 className={`font-medium text-xs ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-700'}`}>列表视图</h4>
          <p className="text-xs text-gray-500 mt-1">详细信息展示</p>
        </button>

        <button
          onClick={() => handleViewModeChange('card')}
          className={`p-3 bg-white rounded-lg border-2 ${viewMode === 'card' ? 'border-purple-500 shadow-md' : 'border-gray-200'} text-center transition-all hover:shadow-sm`}
        >
          <div className="mb-2 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${viewMode === 'card' ? 'text-purple-600' : 'text-gray-500'}`}>
              <path d="M12 7v14" />
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            </svg>
          </div>
          <h4 className={`font-medium text-xs ${viewMode === 'card' ? 'text-purple-600' : 'text-gray-700'}`}>卡片视图</h4>
          <p className="text-xs text-gray-500 mt-1">视觉化浏览</p>
        </button>

        <button
          onClick={() => handleViewModeChange('tree')}
          className={`p-3 bg-white rounded-lg border-2 ${viewMode === 'tree' ? 'border-green-500 shadow-md' : 'border-gray-200'} text-center transition-all hover:shadow-sm`}
        >
          <div className="mb-2 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${viewMode === 'tree' ? 'text-green-600' : 'text-gray-500'}`}>
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <h4 className={`font-medium text-xs ${viewMode === 'tree' ? 'text-green-600' : 'text-gray-700'}`}>树状视图</h4>
          <p className="text-xs text-gray-500 mt-1">层级结构展示</p>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h4 className="text-sm font-medium text-gray-900 mb-3">实际书签展示</h4>
          
          {viewMode === 'list' && <ListView bookmarks={bookmarks} />}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {bookmarks.map(bookmark => (
                <div key={bookmark.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-24 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      {bookmark.favicon}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {bookmark.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {bookmark.url}
                    </p>
                    {bookmark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {bookmark.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {bookmark.tags.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            +{bookmark.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {viewMode === 'tree' && <TreeView bookmarks={bookmarks} />}
        </div>
      )}

      {!isExpanded && (
        <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-700 text-center">
            点击"查看示例"按钮查看实际书签展示效果
          </p>
        </div>
      )}
    </div>
  );
}
