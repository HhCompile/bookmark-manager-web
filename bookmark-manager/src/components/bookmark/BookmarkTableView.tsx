import { ExternalLink, Trash2, Folder, Tag, Sparkles, Globe, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import AliasEditor from './AliasEditor';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
  isValid: boolean;
  alias?: string;
}

interface BookmarkTableViewProps {
  bookmarks: Bookmark[];
  selectedBookmarks: string[];
  toggleBookmarkSelection: (url: string) => void;
  handleDelete: (url: string) => void;
  handleAutoTag: (bookmark: Bookmark) => void;
  handleAutoClassify: (bookmark: Bookmark) => void;
  handleUpdateAlias: (bookmark: Bookmark, alias: string) => void;
}

export default function BookmarkTableView({
  bookmarks,
  selectedBookmarks,
  toggleBookmarkSelection,
  handleDelete,
  handleAutoTag,
  handleAutoClassify,
  handleUpdateAlias
}: BookmarkTableViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked={selectedBookmarks.length === bookmarks.length && bookmarks.length > 0}
                  onChange={() => {
                    // This would need to be handled by the parent component
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                网站
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标签
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                智能功能
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {bookmarks.map((bookmark, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedBookmarks.includes(bookmark.url)}
                    onChange={() => toggleBookmarkSelection(bookmark.url)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bookmark.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={bookmark.title}>
                    {bookmark.title || '无标题'}
                    {bookmark.alias && (
                      <span className="ml-2 text-xs text-gray-500">({bookmark.alias})</span>
                    )}
                  </div>
                  <div className="mt-1">
                    <AliasEditor 
                      alias={bookmark.alias} 
                      onSave={(alias) => handleUpdateAlias(bookmark, alias)} 
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline transition-colors"
                      title={bookmark.url}
                    >
                      {bookmark.url}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {bookmark.category ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Folder className="w-3 h-3 mr-1" />
                      {bookmark.category}
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleAutoClassify(bookmark)}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      自动分类
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  {bookmark.tags && bookmark.tags.length > 0 ? (
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
                        <span className="text-xs text-gray-500">+{bookmark.tags.length - 2}</span>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAutoTag(bookmark)}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      自动打标
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {!bookmark.category && (
                      <button 
                        onClick={() => handleAutoClassify(bookmark)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        分类
                      </button>
                    )}
                    {(!bookmark.tags || bookmark.tags.length === 0) && (
                      <button 
                        onClick={() => handleAutoTag(bookmark)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        打标
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => window.open(bookmark.url, '_blank')}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                      title="打开链接"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(bookmark.url)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
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
    </div>
  );
}