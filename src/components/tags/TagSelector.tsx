/**
 * 标签选择器组件
 * 弹窗形式的标签选择，支持多选
 */

import { useState, useMemo } from 'react';
import { Search, Check, Tag } from 'lucide-react';
import { TagBadge } from './TagBadge';
import { useTagsQuery } from '@/api/tags';
import { cn } from '@/components/ui/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagSelectorProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 当前选中的标签 */
  selectedTags: string[];
  /** 选择变更回调 */
  onChange: (tags: string[]) => void;
  /** 标题 */
  title?: string;
  /** 最多选择数量 */
  maxSelection?: number;
}

export function TagSelector({
  open,
  onClose,
  selectedTags,
  onChange,
  title = '选择标签',
  maxSelection,
}: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelected, setLocalSelected] = useState<string[]>(selectedTags);

  // 获取所有标签
  const { data: tagsData, isLoading } = useTagsQuery({
    limit: 100,
    sort_by: 'usage',
  });

  const allTags = tagsData?.tags || [];

  // 过滤标签
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return allTags;
    const query = searchQuery.toLowerCase();
    return allTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(query) ||
        tag.description?.toLowerCase().includes(query)
    );
  }, [allTags, searchQuery]);

  // 切换标签选择
  const toggleTag = (tagName: string) => {
    setLocalSelected((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((t) => t !== tagName);
      }
      if (maxSelection && prev.length >= maxSelection) {
        return prev;
      }
      return [...prev, tagName];
    });
  };

  // 确认选择
  const handleConfirm = () => {
    onChange(localSelected);
    onClose();
    setSearchQuery('');
  };

  // 取消选择
  const handleCancel = () => {
    setLocalSelected(selectedTags);
    onClose();
    setSearchQuery('');
  };

  // 清空选择
  const handleClear = () => {
    setLocalSelected([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* 搜索框 */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* 已选标签展示 */}
        {localSelected.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                已选择 {localSelected.length}
                {maxSelection ? ` / ${maxSelection}` : ''} 个标签
              </span>
              <button
                onClick={handleClear}
                className="text-xs text-red-500 hover:text-red-600"
              >
                清空
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-2 bg-gray-50 rounded-lg">
              {localSelected.map((tagName) => {
                const tag = allTags.find((t) => t.name === tagName);
                return (
                  <TagBadge
                    key={tagName}
                    name={tagName}
                    color={tag?.color}
                    size="sm"
                    removable
                    onRemove={() => toggleTag(tagName)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* 标签列表 */}
        <div className="flex-1 overflow-y-auto mt-3 -mx-6 px-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : filteredTags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? '未找到匹配的标签' : '暂无标签'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredTags.map((tag) => {
                const isSelected = localSelected.includes(tag.name);
                const isDisabled =
                  !isSelected &&
                  !!maxSelection &&
                  localSelected.length >= maxSelection;

                return (
                  <button
                    key={tag.id}
                    onClick={() => !isDisabled && toggleTag(tag.name)}
                    disabled={isDisabled}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg text-left transition-all',
                      'hover:bg-gray-50 border',
                      isSelected && 'border-blue-500 bg-blue-50',
                      !isSelected && 'border-transparent',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full flex items-center justify-center',
                        isSelected && 'bg-blue-500'
                      )}
                      style={{
                        backgroundColor: isSelected ? undefined : tag.color,
                      }}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{tag.name}</div>
                      {tag.description && (
                        <div className="text-xs text-gray-400 truncate">
                          {tag.description}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {tag.usage_count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确认 ({localSelected.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TagSelector;
