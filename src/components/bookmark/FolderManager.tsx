import {
  Folder,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { apiService as api } from '@/services/api';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface FolderItem {
  id: string;
  name: string;
  path: string;
  bookmarkCount: number;
  children?: FolderItem[];
}

interface FolderManagerProps {
  folders: FolderItem[];
  onFoldersChange: (folders: FolderItem[]) => void;
}

/**
 * 文件夹管理组件
 * 显示和管理文件夹结构
 */
export default function FolderManager({
  folders,
  onFoldersChange,
}: FolderManagerProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [localFolders, setLocalFolders] = useState<FolderItem[]>(folders);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 当外部folders变化时更新本地状态
  useEffect(() => {
    setLocalFolders(folders);
  }, [folders]);

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
      const updatedFolders = updateFolderName(
        localFolders,
        folderId,
        editValue.trim()
      );
      setLocalFolders(updatedFolders);
      onFoldersChange(updatedFolders);
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

  // 获取文件夹建议
  const fetchFolderSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await api.getFolderSuggestions();
      setSuggestions(response.data.folder_suggestions);
      toast.success('获取文件夹建议成功');
    } catch (error: any) {
      toast.error('获取文件夹建议失败', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 应用建议的文件夹结构
  const applySuggestedFolders = (suggestionType: string) => {
    if (suggestions && suggestions[suggestionType]) {
      setLocalFolders(suggestions[suggestionType]);
      onFoldersChange(suggestions[suggestionType]);
      toast.success('已应用文件夹建议');
    }
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-text-primary">
            文件夹结构
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={fetchFolderSuggestions}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? '获取中...' : '获取建议'}
            </button>
          </div>
        </div>

        {/* 文件夹建议 */}
        {suggestions && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              文件夹建议
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applySuggestedFolders('category_based')}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              >
                按分类组织
              </button>
              <button
                onClick={() => applySuggestedFolders('tag_based')}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              >
                按标签组织
              </button>
              <button
                onClick={() => applySuggestedFolders('mixed')}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              >
                混合组织
              </button>
            </div>
          </div>
        )}

        {/* 文件夹树 */}
        <div className="border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
          {localFolders.length > 0 ? (
            renderFolderTree(localFolders)
          ) : (
            <p className="text-text-secondary text-center py-4">
              暂无文件夹结构
            </p>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => onFoldersChange(localFolders)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            保存文件夹结构
          </button>
        </div>
      </div>
    </div>
  );
}
