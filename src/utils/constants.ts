/**
 * 全局常量
 */

// ==================== 标签颜色配置 ====================

export const TAG_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
  'bg-lime-100 text-lime-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
] as const;

/**
 * 根据标签名称获取颜色类名
 * 使用哈希算法确保同一标签总是获得相同颜色
 */
export function getTagColor(tagName: string): string {
  const hash = tagName
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
}

// ==================== 分类颜色配置 ====================

export const CATEGORY_COLORS: Record<string, string> = {
  '开发': 'bg-blue-100 text-blue-700 border-blue-200',
  '设计': 'bg-purple-100 text-purple-700 border-purple-200',
  '工具': 'bg-green-100 text-green-700 border-green-200',
  '文档': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '教程': 'bg-orange-100 text-orange-700 border-orange-200',
  '博客': 'bg-pink-100 text-pink-700 border-pink-200',
  '视频': 'bg-red-100 text-red-700 border-red-200',
  '新闻': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  '购物': 'bg-teal-100 text-teal-700 border-teal-200',
  '社交': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  '娱乐': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  '学习': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  '工作': 'bg-slate-100 text-slate-700 border-slate-200',
  '生活': 'bg-rose-100 text-rose-700 border-rose-200',
  '未分类': 'bg-gray-100 text-gray-600 border-gray-200',
};

/**
 * 获取分类颜色
 */
export function getCategoryColor(category: string | undefined): string {
  return CATEGORY_COLORS[category || '未分类'] || CATEGORY_COLORS['未分类'];
}

// ==================== 视图模式配置 ====================

export type ViewMode = 'grid' | 'list' | 'tree';

export const VIEW_MODES: { value: ViewMode; label: string; shortcut: string; icon: string }[] = [
  { value: 'grid', label: '卡片视图', shortcut: 'Ctrl+1', icon: 'Grid3X3' },
  { value: 'list', label: '列表视图', shortcut: 'Ctrl+2', icon: 'List' },
  { value: 'tree', label: '树形视图', shortcut: 'Ctrl+3', icon: 'FolderTree' },
];

// ==================== 文件上传配置 ====================

export const UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['.html', '.htm', '.json'],
  allowedMimeTypes: ['text/html', 'application/json'],
} as const;

// ==================== 分页配置 ====================

export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPageSize: 100,
} as const;

// ==================== 动画配置 ====================

export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },
  easing: {
    default: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    smooth: [0.25, 0.1, 0.25, 1],
  },
} as const;

// ==================== 本地存储 Key ====================

export const STORAGE_KEYS = {
  viewMode: 'bookmark-view-mode',
  theme: 'bookmark-theme',
  language: 'bookmark-language',
  sidebarCollapsed: 'bookmark-sidebar-collapsed',
  recentSearches: 'bookmark-recent-searches',
  userPreferences: 'bookmark-user-preferences',
} as const;

// ==================== 正则表达式 ====================

export const REGEX = {
  url: /^https?:\/\/.+/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  alias: /^[a-zA-Z0-9_-]+$/,
  // 提取标签的正则
  tag: /^标签:\s*(.+)$/,
  // 提取分类的正则
  category: /^分类:\s*(.+)$/,
} as const;

// ==================== 错误消息 ====================

export const ERROR_MESSAGES = {
  fileTooLarge: '文件大小超过限制（最大 10MB）',
  invalidFileType: '不支持的文件类型，请上传 HTML 或 JSON 格式的书签文件',
  fileReadError: '文件读取失败',
  validationError: '验证过程中发生错误',
  networkError: '网络连接失败，请检查网络',
  notFound: '未找到书签',
  alreadyExists: '该书签已存在',
  unknownError: '发生未知错误，请稍后重试',
} as const;

// ==================== 成功消息 ====================

export const SUCCESS_MESSAGES = {
  uploadSuccess: '书签导入成功',
  deleteSuccess: '书签删除成功',
  updateSuccess: '书签更新成功',
  createSuccess: '书签创建成功',
  importSuccess: '导入完成',
  exportSuccess: '导出完成',
} as const;
