import { AlertTriangle, Copy, Trash2, Merge, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { Bookmark } from '../types/bookmark';

interface DuplicateBookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  addedDate: Date;
  tags: string[];
}

interface DuplicateGroup {
  url: string;
  bookmarks: DuplicateBookmark[];
}

interface QualityMonitorProps {
  bookmarks: Bookmark[];
}

export default function QualityMonitor({ bookmarks }: QualityMonitorProps) {
  const { t } = useTranslation();

  // 检测重复书签
  const detectDuplicates = (): DuplicateGroup[] => {
    const urlMap: { [key: string]: DuplicateBookmark[] } = {};

    bookmarks.forEach((bookmark) => {
      if (!urlMap[bookmark.url]) {
        urlMap[bookmark.url] = [];
      }
      urlMap[bookmark.url].push(bookmark);
    });

    return Object.entries(urlMap)
      .filter(([_, items]) => items.length > 1)
      .map(([url, items]) => ({ url, bookmarks: items }));
  };

  // 检测失效链接
  const detectDeadLinks = () => {
    return bookmarks.filter((b) => b.isDead);
  };

  const duplicates = detectDuplicates();
  const deadLinks = detectDeadLinks();

  const handleMerge = (group: DuplicateGroup) => {
    console.log('合并书签:', group);
  };

  const handleDelete = (bookmarkId: string) => {
    console.log('删除书签:', bookmarkId);
  };

  const handleWaybackMachine = (url: string) => {
    window.open(`https://web.archive.org/web/*/${url}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 重复书签检测 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Copy className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('quality.duplicateDetection.title')}
            </h3>
          </div>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
            {t('quality.duplicateDetection.count', { count: duplicates.length })}
          </span>
        </div>

        {duplicates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Copy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>{t('quality.duplicateDetection.noDuplicates')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {duplicates.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-orange-200 rounded-lg p-4 bg-orange-50"
              >
                <p className="text-sm text-gray-600 mb-3">
                  {t('quality.duplicateDetection.duplicateUrl')}: {group.url}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {group.bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="bg-white border border-gray-200 rounded p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {bookmark.title}
                        </h4>
                        <button
                          onClick={() => handleDelete(bookmark.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p>{t('bookmarks.columns.category')}: {bookmark.category}</p>
                        <p>
                          {t('bookmarks.columns.date')}: {bookmark.addedDate.toLocaleDateString('zh-CN')}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {bookmark.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMerge(group)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Merge className="w-4 h-4" />
                    {t('quality.duplicateDetection.merge')}
                  </button>
                  <p className="text-xs text-gray-500">
                    {t('quality.duplicateDetection.mergeTip')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 失效链接检测 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('quality.deadLinks.title')}
            </h3>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
            {t('quality.deadLinks.count', { count: deadLinks.length })}
          </span>
        </div>

        {deadLinks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>{t('quality.deadLinks.noDeadLinks')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deadLinks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {bookmark.title}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {bookmark.url}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWaybackMachine(bookmark.url)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    title="Wayback Machine"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('quality.deadLinks.waybackMachine')}
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 质量统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('quality.stats.duplicateRate')}</p>
              <p className="text-2xl font-bold text-orange-600">
                {((duplicates.length / bookmarks.length) * 100).toFixed(1)}%
              </p>
            </div>
            <Copy className="w-8 h-8 text-orange-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('quality.stats.deadRate')}</p>
              <p className="text-2xl font-bold text-red-600">
                {((deadLinks.length / bookmarks.length) * 100).toFixed(1)}%
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('quality.stats.healthScore')}</p>
              <p className="text-2xl font-bold text-green-600">
                {(
                  100 -
                  ((duplicates.length + deadLinks.length) / bookmarks.length) *
                    100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>
      </div>
    </div>
  );
}
