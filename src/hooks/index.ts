/**
 * Hooks 统一导出
 * 包含 ahooks 的增强包装和自定义 hooks
 */

// 原始的 React Query hooks
export {
  bookmarkKeys,
  useBookmarks,
  useFolders,
  useCreateBookmark,
  useUpdateBookmark,
  useDeleteBookmark,
  useCreateFolder,
} from './useBookmarks';

export {
  useChromeBookmarks,
  flattenBookmarks,
  getAllBookmarkUrls,
} from './useChromeBookmarks';

// ahooks 增强版 hooks（推荐新项目使用）
export {
  useBookmarksList,
  useFoldersList,
  useBookmarkSearch,
  useCreateBookmarkAHooks,
  useDeleteBookmarkAHooks,
  useBookmarkSelection,
} from './useBookmarksOptimized';

// 工具 hooks
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useToggle, useToggles } from './useToggle';

// 注意：推荐使用直接使用 ahooks
// import { useRequest, useToggle, useSetState } from 'ahooks';
