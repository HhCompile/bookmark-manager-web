import { create } from 'zustand';

// 创建书签状态管理store
export const useBookmarkStore = create((set, get) => ({
  // 状态字段
  bookmarks: [],        // 书签列表
  categories: [],       // 分类列表
  tags: [],             // 标签列表
  loading: false,       // 加载状态
  error: null,          // 错误信息

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
}));