import {
  Folder,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface FolderItem {
  id: string;
  name: string;
  path: string;
  bookmarkCount: number;
  children?: FolderItem[];
}

interface FolderStructureConfirmationProps {
  folders: FolderItem[];
  onConfirm: (folders: FolderItem[]) => void;
  onCancel: () => void;
}

/**
 * 文件夹结构确认组件
 * 展示系统识别的文件夹结构并允许用户确认或调整
 *
 * @param props - 组件属性
 */
export default function FolderStructureConfirmation({
  folders,
  onConfirm,
  onCancel,
}: FolderStructureConfirmationProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [localFolders, setLocalFolders] = useState<FolderItem[]>(folders);

  // 切换文件夹展开/收起状态
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // 开始编辑文件夹名称
  const startEditing = (folderId: string, currentName: string) => {
    setEditingFolder(folderId);
    setEditValue(currentName);
  };

  // 保存编辑的文件夹名称
  const saveEdit = (folderId: string) => {
    if (editValue.trim()) {
      setLocalFolders(prev =>
        updateFolderName(prev, folderId, editValue.trim())
      );
    }
    setEditingFolder(null);
    setEditValue('');
  };

  // 递归更新文件夹名称
  const updateFolderName = (
    folders: FolderItem[],
    folderId: string,
    newName: string
  ): FolderItem[] => {
    return folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, name: newName };
      }
      if (folder.children) {
        return {
          ...folder,
          children: updateFolderName(folder.children, folderId, newName),
        };
      }
      return folder;
    });
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingFolder(null);
    setEditValue('');
  };

  // 渲染文件夹树
  const renderFolderTree = (folders: FolderItem[], level = 0) => {
    return folders.map(folder => (
      <div key={folder.id} className="ml-4">
        <div className="flex items-center py-2">
          {folder.children && folder.children.length > 0 && (
            <button
              onClick={() => toggleFolder(folder.id)}
              className="mr-1 p-1 rounded hover:bg-gray-100"
            >
              {expandedFolders[folder.id] ? (
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              ) : (
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              )}
            </button>
          )}
          {(!folder.children || folder.children.length === 0) && (
            <div className="w-6 mr-1" />
          )}

          <Folder className="w-4 h-4 text-text-secondary mr-2 flex-shrink-0" />

          {editingFolder === folder.id ? (
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border rounded"
                autoFocus
                onBlur={() => saveEdit(folder.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEdit(folder.id);
                  if (e.key === 'Escape') cancelEdit();
                }}
              />
              <button
                onClick={() => saveEdit(folder.id)}
                className="ml-2 p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-1">
              <span className="text-text-primary">{folder.name}</span>
              <div className="flex items-center">
                <span className="text-xs text-text-secondary mr-2">
                  {folder.bookmarkCount} 个书签
                </span>
                <button
                  onClick={() => startEditing(folder.id, folder.name)}
                  className="p-1 text-text-secondary hover:bg-gray-100 rounded"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {folder.children &&
          folder.children.length > 0 &&
          expandedFolders[folder.id] && (
            <div className="border-l border-border ml-2 pl-2">
              {renderFolderTree(folder.children, level + 1)}
            </div>
          )}
      </div>
    ));
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          文件夹结构确认
        </h3>

        <div className="rounded-lg border border-warning/20 bg-warning/5 p-5 mb-6">
          <div className="flex">
            <Folder className="flex-shrink-0 w-5 h-5 text-warning mt-0.5" />
            <div className="ml-4">
              <h4 className="text-base font-medium text-warning">
                请确认文件夹结构
              </h4>
              <p className="mt-2 text-sm text-text-secondary">
                系统已识别出以下文件夹结构，请确认是否正确。您可以点击编辑按钮修改文件夹名称。
              </p>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
          {localFolders.length > 0 ? (
            renderFolderTree(localFolders)
          ) : (
            <p className="text-text-secondary text-center py-4">
              未识别到文件夹结构
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(localFolders)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            确认并继续
          </button>
        </div>
      </div>
    </div>
  );
}
