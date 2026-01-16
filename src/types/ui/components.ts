/**
 * UI组件相关类型定义
 */

/**
 * 视图模式
 */
export type ViewMode = 'grid' | 'list' | 'table';

/**
 * 排序方式
 */
export type SortBy = 'createdAt' | 'updatedAt' | 'title' | 'url';
export type SortOrder = 'asc' | 'desc';

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * 主题色
 */
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';

/**
 * 语言设置
 */
export type Language = 'zh-CN' | 'en-US';

/**
 * 筛选面板状态
 */
export interface FilterPanelState {
  isOpen: boolean;
  selectedCategory?: string;
  selectedTags?: string[];
  selectedValidity?: 'valid' | 'invalid' | 'all';
  dateRange?: {
    start?: string;
    end?: string;
  };
}

/**
 * 选中状态
 */
export interface SelectionState<T> {
  selectedItems: Set<T>;
  isAllSelected: boolean;
  selectedCount: number;
}

/**
 * 加载状态
 */
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

/**
 * 错误状态
 */
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: number;
  details?: any;
}

/**
 * Toast通知类型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast通知配置
 */
export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 模态框状态
 */
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

/**
 * 侧边栏状态
 */
export interface SidebarState {
  isOpen: boolean;
  activeItem?: string;
  collapsed: boolean;
}
