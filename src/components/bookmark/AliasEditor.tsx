import { Edit3, Save, X } from 'lucide-react';
import { useState } from 'react';

interface AliasEditorProps {
  alias?: string;
  onSave: (alias: string) => void;
}

/**
 * 别名编辑器组件
 * 允许用户编辑书签的别名
 */
export default function AliasEditor({ alias, onSave }: AliasEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(alias || '');

  // 开始编辑
  const startEditing = () => {
    setIsEditing(true);
    setEditValue(alias || '');
  };

  // 保存编辑
  const saveEdit = () => {
    onSave(editValue.trim());
    setIsEditing(false);
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditValue(alias || '');
    setIsEditing(false);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center">
        <input
          type="text"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-2 py-1 text-sm border rounded"
          autoFocus
          onBlur={saveEdit}
        />
        <button
          onClick={saveEdit}
          className="ml-1 p-1 text-green-600 hover:bg-green-50 rounded"
        >
          <Save className="w-3 h-3" />
        </button>
        <button
          onClick={cancelEdit}
          className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {alias ? (
        <span className="text-sm text-text-secondary">{alias}</span>
      ) : (
        <span className="text-sm text-text-tertiary italic">无别名</span>
      )}
      <button
        onClick={startEditing}
        className="ml-2 p-1 text-text-secondary hover:bg-gray-100 rounded"
      >
        <Edit3 className="w-3 h-3" />
      </button>
    </div>
  );
}
