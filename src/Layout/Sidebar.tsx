import { Folder, Lock, ChevronRight, Tag } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFolders, useBookmarks } from '../hooks';
import { getTagColor } from '../mocks/data';

export default function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const { data: folders = [] } = useFolders();
  const { data: bookmarks = [] } = useBookmarks();

  // 使用 useMemo 缓存标签计算结果，避免重复计算
  const tagCounts = useMemo(() => {
    const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));
    return allTags.map((tag) => ({
      name: tag,
      count: bookmarks.filter((b) => b.tags.includes(tag)).length,
    }));
  }, [bookmarks]);

  // 获取文件夹书签数量
  const getBookmarkCount = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return 0;
    return folder.bookmarks.length;
  };

  const handleFolderClick = (folderId: string | null) => {
    setSelectedFolder(folderId);
    if (folderId) {
      navigate(`/app/bookmarks?folder=${folderId}`);
    } else {
      navigate('/app/bookmarks');
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            {t('sidebar.folders')}
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => handleFolderClick(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === null
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span className="flex-1 text-left">{t('sidebar.allBookmarks')}</span>
              <span className="text-sm text-gray-500">{bookmarks.length}</span>
            </button>

            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleFolderClick(folder.id)}
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
            onClick={() => navigate('/app/analytics')}
            className="text-sm font-semibold text-gray-500 uppercase mb-3 hover:text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {t('sidebar.tagCloud')}
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
