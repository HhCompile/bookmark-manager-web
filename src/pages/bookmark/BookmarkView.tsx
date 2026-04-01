import { LayoutList, LayoutGrid, Network, Save, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TreeView from '../../components/views/TreeView';
import ListView from '../../components/views/ListView';
import CardView from '../../components/views/CardView';
import { useBookmarks, useFolders, useCreateBookmark } from '../../hooks';
import { useBookmarkContext } from '../../contexts/BookmarkContext';
import type { ViewMode } from '../../types/bookmark';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function BookmarkView() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('folder');
  const [searchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const { data: folders = [] } = useFolders();
  const { data: bookmarks = [] } = useBookmarks({ 
    folderId: folderId || undefined,
    search: searchQuery || undefined,
  });
  
  // 导入书签相关
  const { 
    importedBookmarks, 
    hasImportedBookmarks, 
    clearImportedBookmarks 
  } = useBookmarkContext();
  
  const createBookmark = useCreateBookmark();
  const [isSaving, setIsSaving] = useState(false);

  const currentFolder = folderId 
    ? folders.find((f) => f.id === folderId)
    : null;

  // 确定显示的书签：优先显示导入的，否则显示正常列表
  const displayBookmarks = hasImportedBookmarks ? importedBookmarks : bookmarks;

  // 保存导入的书签到数据库
  const handleSaveImported = async () => {
    setIsSaving(true);
    try {
      // 批量保存导入的书签
      const savePromises = importedBookmarks.map((bookmark) => 
        createBookmark.mutateAsync({
          title: bookmark.title,
          url: bookmark.url,
          category: bookmark.category,
          tags: bookmark.tags,
          favicon: bookmark.favicon,
          summary: bookmark.summary,
          alias: bookmark.alias,
          isLocked: bookmark.isLocked || false,
        })
      );
      
      await Promise.all(savePromises);
      toast.success(`成功保存 ${importedBookmarks.length} 个书签到您的收藏`);
      clearImportedBookmarks();
    } catch (error) {
      toast.error('保存书签失败，请重试');
      console.error('Save bookmarks error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 取消导入预览
  const handleCancelImport = () => {
    clearImportedBookmarks();
    toast.info('已取消导入预览');
  };

  return (
    <div className="space-y-4">
      {/* 导入书签提示条 */}
      <AnimatePresence>
        {hasImportedBookmarks && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    预览导入的书签
                  </h3>
                  <p className="text-sm text-gray-600">
                    共 <span className="font-medium text-blue-600">{importedBookmarks.length}</span> 个书签，
                    查看后可保存到您的收藏
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelImport}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-1" />
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveImported}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      保存到收藏
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 视图切换器 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {hasImportedBookmarks 
            ? '导入的书签预览' 
            : (currentFolder ? currentFolder.name : t('bookmarks.title'))
          }
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({displayBookmarks.length})
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
        {viewMode === 'list' && <ListView bookmarks={displayBookmarks} />}
        {viewMode === 'card' && <CardView bookmarks={displayBookmarks} />}
        {viewMode === 'tree' && <TreeView bookmarks={displayBookmarks} />}
      </div>
    </div>
  );
}
