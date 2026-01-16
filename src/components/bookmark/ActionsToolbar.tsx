/**
 * 书签批量操作工具栏组件
 * 提供批量删除、自动打标、自动分类等批量操作
 */

import { Trash2, Tag, Sparkles, ChevronDown, Check, X } from 'lucide-react';
import { useState, useRef } from 'react';
import type { Bookmark } from '../../types';

interface BookmarkActionsToolbarProps {
  selectedBookmarks: string[];
  filteredBookmarksLength: number;
  onBatchDelete: () => void;
  onBatchAutoTag: () => void;
  onBatchAutoClassify: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onClearSelection?: () => void;
  isAutoTagging?: boolean;
  isAutoClassifying?: boolean;
}

export function BookmarkActionsToolbar({
  selectedBookmarks,
  filteredBookmarksLength,
  onBatchDelete,
  onBatchAutoTag,
  onBatchAutoClassify,
  onExport,
  onRefresh,
  onClearSelection,
  isAutoTagging = false,
  isAutoClassifying = false,
}: BookmarkActionsToolbarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const isAllSelected = selectedBookmarks.length === filteredBookmarksLength;
  const hasSelection = selectedBookmarks.length > 0;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection?.();
    } else {
      // 全选逻辑由父组件处理
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    setShowConfirmDialog(false);
    onBatchDelete();
  };

  return (
    <>
      {hasSelection && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={onClearSelection}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>取消选择</span>
                <span className="text-sm text-gray-500">
                  ({selectedBookmarks.length}个)
                </span>
              </button>

              <button
                onClick={handleToggleSelectAll}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {isAllSelected ? (
                  <span>取消全选</span>
                ) : (
                  <>
                    <span>全选</span>
                    <span className="text-sm text-gray-500">
                      ({filteredBookmarksLength}个)
                    </span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onBatchAutoTag}
                disabled={isAutoTagging}
                className="px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isAutoTagging ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    <span>AI打标中...</span>
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4" />
                    <span>AI打标</span>
                  </>
                )}
              </button>

              <button
                onClick={onBatchAutoClassify}
                disabled={isAutoClassifying}
                className="px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isAutoClassifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    <span>AI分类中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI分类</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>批量删除</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onExport}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>导出</span>
              </button>

              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <ChevronDown className="w-4 h-4" />
                <span>更多</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">确认批量删除</h3>
                <p className="text-gray-600">
                  您确定要删除选中的 <span className="font-bold text-gray-900">{selectedBookmarks.length}</span> 个书签吗？
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  此操作无法撤销，请谨慎操作。
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                ref={confirmButtonRef}
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-medium transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
