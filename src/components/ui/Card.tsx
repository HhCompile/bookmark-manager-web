import React from 'react';

interface CardProps {
  /** 卡片子元素 */
  children: React.ReactNode;
  /** 卡片样式类名 */
  className?: string;
  /** 卡片内容样式类名 */
  contentClassName?: string;
  /** 卡片标题 */
  title?: string;
  /** 卡片底部内容 */
  footer?: React.ReactNode;
}

/**
 * 通用卡片组件
 * 用于展示各种内容卡片
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  contentClassName = '',
  title,
  footer,
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-border transition-all hover:shadow-md ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className={`p-5 ${contentClassName}`}>
        {children}
      </div>
      {footer && (
        <div className="px-5 py-4 border-t border-border">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;