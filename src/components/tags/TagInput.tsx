/**
 * 标签输入组件
 * 支持输入标签、自动补全、创建新标签
 */

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { TagBadge } from './TagBadge';
import { useTagSuggestionsQuery } from '@/api/tags';
import { cn } from '@/components/ui/utils';

interface TagInputProps {
  /** 当前标签列表 */
  value: string[];
  /** 标签变更回调 */
  onChange: (tags: string[]) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否允许创建新标签 */
  allowCreate?: boolean;
  /** 最大标签数量 */
  maxTags?: number;
  /** 禁用状态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 输入框尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示标签计数 */
  showCount?: boolean;
  /** 预设颜色（用于新标签） */
  presetColors?: string[];
}

const DEFAULT_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
  '#10B981', '#EF4444', '#6366F1', '#14B8A6',
];

export function TagInput({
  value = [],
  onChange,
  placeholder = '添加标签...',
  allowCreate = true,
  maxTags = 10,
  disabled = false,
  className,
  size = 'md',
  showCount = false,
  presetColors = DEFAULT_COLORS,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // 获取标签建议
  const { data: suggestionsData } = useTagSuggestionsQuery(
    inputValue,
    8
  );

  const suggestions = suggestionsData?.suggestions || [];

  // 过滤已选择的标签
  const filteredSuggestions = suggestions.filter(
    (s) => !value.includes(s.name)
  );

  // 是否显示创建新标签选项
  const canCreateNew =
    allowCreate &&
    inputValue.trim() &&
    !value.includes(inputValue.trim().toLowerCase()) &&
    !filteredSuggestions.some((s) => s.name === inputValue.trim().toLowerCase());

  // 添加标签
  const addTag = useCallback(
    (tagName: string) => {
      const normalizedTag = tagName.trim().toLowerCase();
      if (
        normalizedTag &&
        !value.includes(normalizedTag) &&
        value.length < maxTags
      ) {
        onChange([...value, normalizedTag]);
        setInputValue('');
        setSelectedIndex(-1);
      }
    },
    [value, onChange, maxTags]
  );

  // 移除标签
  const removeTag = useCallback(
    (tagToRemove: string) => {
      onChange(value.filter((t) => t !== tagToRemove));
    },
    [value, onChange]
  );

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const totalOptions = filteredSuggestions.length + (canCreateNew ? 1 : 0);

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          addTag(filteredSuggestions[selectedIndex].name);
        } else if (canCreateNew) {
          addTag(inputValue);
        }
        break;

      case 'Backspace':
        if (!inputValue && value.length > 0) {
          removeTag(value[value.length - 1]);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < totalOptions - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Escape':
        setInputValue('');
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 处理粘贴
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newTags = pastedText
      .split(/[,，;；\n]+/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && !value.includes(t))
      .slice(0, maxTags - value.length);

    if (newTags.length > 0) {
      onChange([...value, ...newTags]);
    }
  };

  // 为新标签生成颜色
  const getNewTagColor = (tagName: string) => {
    const index =
      tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      presetColors.length;
    return presetColors[index];
  };

  const sizeClasses = {
    sm: 'min-h-[32px] text-xs',
    md: 'min-h-[40px] text-sm',
    lg: 'min-h-[48px] text-base',
  };

  return (
    <div className={cn('relative', className)}>
      {/* 标签输入区域 */}
      <div
        className={cn(
          'flex flex-wrap items-center gap-1.5 p-2 border rounded-lg',
          'bg-white transition-all',
          isFocused && 'border-blue-500 ring-2 ring-blue-100',
          disabled && 'bg-gray-100 cursor-not-allowed',
          sizeClasses[size]
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {/* 已选标签 */}
        {value.map((tag) => (
          <TagBadge
            key={tag}
            name={tag}
            color={getNewTagColor(tag)}
            size={size === 'lg' ? 'md' : 'sm'}
            removable={!disabled}
            onRemove={() => removeTag(tag)}
          />
        ))}

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || value.length >= maxTags}
          className={cn(
            'flex-1 min-w-[80px] outline-none bg-transparent',
            'placeholder:text-gray-400',
            disabled && 'cursor-not-allowed'
          )}
        />

        {/* 标签计数 */}
        {showCount && maxTags > 0 && (
          <span className="text-xs text-gray-400 ml-auto">
            {value.length}/{maxTags}
          </span>
        )}
      </div>

      {/* 下拉建议列表 */}
      {isFocused && (filteredSuggestions.length > 0 || canCreateNew) && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* 现有标签建议 */}
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => addTag(suggestion.name)}
              className={cn(
                'w-full px-3 py-2 flex items-center gap-2 text-left',
                'hover:bg-gray-50 transition-colors',
                selectedIndex === index && 'bg-blue-50'
              )}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: suggestion.color }}
              />
              <span className="flex-1">{suggestion.name}</span>
              <span className="text-xs text-gray-400">
                使用 {suggestion.usage_count} 次
              </span>
            </button>
          ))}

          {/* 创建新标签选项 */}
          {canCreateNew && (
            <button
              onClick={() => addTag(inputValue)}
              className={cn(
                'w-full px-3 py-2 flex items-center gap-2 text-left',
                'hover:bg-gray-50 transition-colors text-blue-600',
                selectedIndex === filteredSuggestions.length && 'bg-blue-50'
              )}
            >
              <Plus className="w-4 h-4" />
              <span>创建标签 "{inputValue.trim()}"</span>
            </button>
          )}
        </div>
      )}

      {/* 输入提示 */}
      {value.length >= maxTags && (
        <p className="mt-1 text-xs text-amber-600">
          已达到最大标签数量限制 ({maxTags})
        </p>
      )}
    </div>
  );
}

export default TagInput;
