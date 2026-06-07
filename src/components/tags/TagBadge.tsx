/**
 * 标签徽章组件
 * 可点击、可删除的标签展示组件
 */

import { X } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface TagBadgeProps {
  /** 标签名称 */
  name: string;
  /** 标签颜色 */
  color?: string;
  /** 是否可删除 */
  removable?: boolean;
  /** 是否可点击 */
  clickable?: boolean;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 删除回调 */
  onRemove?: () => void;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 显示使用计数 */
  count?: number;
  /** 是否选中 */
  selected?: boolean;
}

export function TagBadge({
  name,
  color = '#3B82F6',
  removable = false,
  clickable = false,
  size = 'md',
  onRemove,
  onClick,
  className,
  count,
  selected = false,
}: TagBadgeProps) {
  // 根据背景色计算对比文字颜色
  const getContrastColor = (bgColor: string) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1f2937' : '#ffffff';
  };

  const textColor = getContrastColor(color);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-all',
        sizeClasses[size],
        clickable && 'cursor-pointer hover:opacity-80 hover:shadow-sm',
        selected && 'ring-2 ring-offset-1 ring-blue-500',
        className
      )}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      <span className="truncate max-w-[120px]">{name}</span>
      {count !== undefined && (
        <span
          className="ml-0.5 text-xs opacity-70"
          style={{ color: textColor }}
        >
          ({count})
        </span>
      )}
      {removable && (
        <button
          onClick={handleRemove}
          className={cn(
            'ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10',
            'focus:outline-none focus:ring-1 focus:ring-white/50'
          )}
          style={{ color: textColor }}
          aria-label={`移除标签 ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

export default TagBadge;
