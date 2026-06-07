/**
 * AI 智能批量操作
 * 提供智能整理、自动分类、批量编辑等功能
 */

import { useState, useCallback } from 'react';
import {
  Wand2,
  FolderOpen,
  Tag,
  Trash2,
  Star,
  
  X,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Bookmark, BookmarkFolder } from '@/types/bookmark';

interface AIBatchActionsProps {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
  selectedBookmarks: Set<string>;
  onClearSelection: () => void;
  onUpdateBookmarks: (urls: string[], updates: Partial<Bookmark>) => void;
  onDeleteBookmarks: (urls: string[]) => void;
  onMoveToFolder: (urls: string[], folderId: string | null) => void;
}

type BatchAction = 'none' | 'move' | 'tag' | 'favorite' | 'delete' | 'auto-organize';

export default function AIBatchActions({
  bookmarks: _bookmarks,
  folders,
  selectedBookmarks,
  onClearSelection,
  onUpdateBookmarks,
  onDeleteBookmarks,
  onMoveToFolder,
}: AIBatchActionsProps) {
  const [currentAction, setCurrentAction] = useState<BatchAction>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [newTag, setNewTag] = useState('');
  const [_showConfirm, setShowConfirm] = useState(false);
  
  const selectedCount = selectedBookmarks.size;
  const selectedUrls = Array.from(selectedBookmarks);
  
  // 执行批量移动
  const handleMove = useCallback(async () => {
    if (!selectedFolder) return;
    setIsProcessing(true);
    onMoveToFolder(selectedUrls, selectedFolder === 'none' ? null : selectedFolder);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsProcessing(false);
    setCurrentAction('none');
    onClearSelection();
  }, [selectedFolder, selectedUrls, onMoveToFolder, onClearSelection]);
  
  // 执行批量添加标签
  const handleAddTag = useCallback(async () => {
    if (!newTag.trim()) return;
    setIsProcessing(true);
    // 这里应该调用 API 添加标签
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsProcessing(false);
    setNewTag('');
    setCurrentAction('none');
    onClearSelection();
  }, [newTag, onClearSelection]);
  
  // 执行批量收藏
  const handleFavorite = useCallback(async () => {
    setIsProcessing(true);
    onUpdateBookmarks(selectedUrls, { metadata: { is_favorite: true } as any });
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsProcessing(false);
    setCurrentAction('none');
    onClearSelection();
  }, [selectedUrls, onUpdateBookmarks, onClearSelection]);
  
  // 执行批量删除
  const handleDelete = useCallback(async () => {
    setIsProcessing(true);
    onDeleteBookmarks(selectedUrls);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsProcessing(false);
    setShowConfirm(false);
    setCurrentAction('none');
    onClearSelection();
  }, [selectedUrls, onDeleteBookmarks, onClearSelection]);
  
  // 执行智能整理
  const handleAutoOrganize = useCallback(async () => {
    setIsProcessing(true);
    // 模拟 AI 整理过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setCurrentAction('none');
    onClearSelection();
  }, [onClearSelection]);
  
  if (selectedCount === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* 头部 - 选择统计 */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
            {selectedCount}
          </div>
          <span className="font-medium text-gray-900">
            已选择 {selectedCount} 个书签
          </span>
        </div>
        <button
          onClick={onClearSelection}
          className="p-1.5 text-gray-400 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        {currentAction === 'none' ? (
          /* 操作菜单 */
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setCurrentAction('move')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <FolderOpen className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">移动到</span>
            </button>
            
            <button
              onClick={() => setCurrentAction('tag')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <Tag className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">添加标签</span>
            </button>
            
            <button
              onClick={() => setCurrentAction('favorite')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all"
            >
              <Star className="w-6 h-6 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">收藏</span>
            </button>
            
            <button
              onClick={() => setCurrentAction('auto-organize')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all col-span-2"
            >
              <Sparkles className="w-6 h-6 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">AI 智能整理</span>
            </button>
            
            <button
              onClick={() => setCurrentAction('delete')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-6 h-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">删除</span>
            </button>
          </div>
        ) : currentAction === 'move' ? (
          /* 移动文件夹 */
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">选择目标文件夹</h4>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- 选择文件夹 --</option>
              <option value="none">未分类</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentAction('none')}
                className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleMove}
                disabled={!selectedFolder || isProcessing}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                确认移动
              </button>
            </div>
          </div>
        ) : currentAction === 'tag' ? (
          /* 添加标签 */
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">添加标签</h4>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="输入标签名称"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentAction('none')}
                className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || isProcessing}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                添加标签
              </button>
            </div>
          </div>
        ) : currentAction === 'favorite' ? (
          /* 收藏确认 */
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              <div>
                <h4 className="font-medium text-gray-900">收藏 {selectedCount} 个书签</h4>
                <p className="text-sm text-gray-500">收藏后可以快速访问重要书签</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentAction('none')}
                className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleFavorite}
                disabled={isProcessing}
                className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                <Star className="w-4 h-4" />
                确认收藏
              </button>
            </div>
          </div>
        ) : currentAction === 'delete' ? (
          /* 删除确认 */
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <h4 className="font-medium text-gray-900">删除 {selectedCount} 个书签</h4>
                <p className="text-sm text-gray-500">此操作无法撤销，请谨慎操作</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentAction('none')}
                className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                <Trash2 className="w-4 h-4" />
                确认删除
              </button>
            </div>
          </div>
        ) : currentAction === 'auto-organize' ? (
          /* AI 智能整理 */
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
              <Sparkles className="w-8 h-8 text-amber-500" />
              <div>
                <h4 className="font-medium text-gray-900">AI 智能整理</h4>
                <p className="text-sm text-gray-500">
                  AI 将分析书签内容，自动分类、打标签、检测失效链接
                </p>
              </div>
            </div>
            
            {isProcessing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-amber-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI 正在分析书签内容...</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-gray-500">
                  正在分析标题、URL、已有标签... 预计需要几秒钟
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentAction('none')}
                  className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAutoOrganize}
                  className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  开始整理
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
