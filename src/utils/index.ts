/**
 * 工具函数统一导出
 */

// 常量
export {
  TAG_COLORS,
  CATEGORY_COLORS,
  VIEW_MODES,
  UPLOAD_CONFIG,
  PAGINATION_CONFIG,
  ANIMATION_CONFIG,
  STORAGE_KEYS,
  REGEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  getTagColor,
  getCategoryColor,
} from './constants';

// 格式化
export {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatFileSize,
  formatNumber,
  truncateText,
  highlightText,
  escapeRegExp,
  extractDomain,
  getFaviconUrl,
  generateId,
  deepClone,
  debounce,
  throttle,
  groupBy,
  uniqueBy,
} from './format';

// 书签相关
export {
  checkBookmarkStatus,
  groupBookmarksByCategory,
  groupBookmarksByTag,
  extractAllTags,
  extractAllCategories,
  searchBookmarks,
  filterBookmarks,
  sortBookmarks,
  buildBookmarkTree,
  flattenBookmarkTree,
  exportBookmarksToHtml,
  exportBookmarksToJson,
  getBookmarkStats,
} from './bookmark';

// 原有导出
export { initOfflineSupport } from './serviceWorker';
