import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 定义状态类型
interface Bookmark {
  url: string;
  title: string;
  alias?: string;
  tags: string[];
  category?: string;
  isValid: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Tag {
  id: string;
  name: string;
  description?: string;
  category: string;
}

interface Folder {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ValidationTask {
  id: string;
  bookmarkUrl: string;
  round: number;
  method: string;
  result?: boolean;
  details?: string;
  createdAt: string;
  completedAt?: string;
}

// 创建书签状态管理store
export const useBookmarkStore = create(
  devtools(
    (set) => ({
      // 状态字段
      bookmarks: [] as Bookmark[],        // 书签列表
      categories: [] as string[],         // 分类列表
      tags: [] as Tag[],                  // 标签列表
      folders: [] as Folder[],            // 文件夹列表
      validationTasks: [] as ValidationTask[], // 验证任务列表
      loading: false,                     // 加载状态
      error: null as string | null,       // 错误信息
      uploadProgress: 0,                  // 上传进度
      validationProgress: 0,              // 验证进度

      // 动作函数
      // 设置加载状态
      setLoading: (loading) => set({ loading }),

      // 设置错误信息
      setError: (error) => set({ error }),

      // 设置书签列表
      setBookmarks: (bookmarks) => set({ bookmarks }),

      // 添加书签
      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [...state.bookmarks, bookmark]
      })),

      // 更新书签
      updateBookmark: (updatedBookmark) => set((state) => ({
        bookmarks: state.bookmarks.map(b => 
          b.url === updatedBookmark.url ? updatedBookmark : b
        )
      })),

      // 删除书签
      deleteBookmark: (url) => set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.url !== url)
      })),

      // 设置分类列表
      setCategories: (categories) => set({ categories }),

      // 设置标签列表
      setTags: (tags) => set({ tags }),

      // 设置文件夹列表
      setFolders: (folders) => set({ folders }),

      // 添加文件夹
      addFolder: (folder) => set((state) => ({
        folders: [...state.folders, folder]
      })),

      // 更新文件夹
      updateFolder: (updatedFolder) => set((state) => ({
        folders: state.folders.map(f => 
          f.id === updatedFolder.id ? updatedFolder : f
        )
      })),

      // 删除文件夹
      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id)
      })),

      // 设置验证任务列表
      setValidationTasks: (validationTasks) => set({ validationTasks }),

      // 添加验证任务
      addValidationTask: (validationTask) => set((state) => ({
        validationTasks: [...state.validationTasks, validationTask]
      })),

      // 更新验证任务
      updateValidationTask: (updatedTask) => set((state) => ({
        validationTasks: state.validationTasks.map(t => 
          t.id === updatedTask.id ? updatedTask : t
        )
      })),

      // 设置上传进度
      setUploadProgress: (progress) => set({ uploadProgress: progress }),

      // 设置验证进度
      setValidationProgress: (progress) => set({ validationProgress: progress }),

      // 重置进度
      resetProgress: () => set({ uploadProgress: 0, validationProgress: 0 }),
    }),
    { name: 'BookmarkStore' }
  )
);