import React from 'react';
import { Card } from './Card';

interface StatsCardProps {
  /** 统计数据标题 */
  title: string;
  /** 统计数据值 */
  value: string | number;
  /** 统计数据描述 */
  description?: string;
  /** 统计数据图标 */
  icon?: React.ReactNode;
  /** 卡片样式类名 */
  className?: string;
}

/**
 * 统计数据卡片组件
 * 用于展示各种统计数据
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary mt-1">{value}</h3>
          {description && (
            <p className="text-xs text-text-secondary mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;