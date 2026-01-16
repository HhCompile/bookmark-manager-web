/**
 * UI状态Store
 * 管理UI相关的全局状态（侧边栏、主题、模态框等）
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // 侧边栏状态
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // 主题状态
  theme: 'light' | 'dark' | 'auto';

  // 模态框状态
  activeModal: string | null;
  modalData: any;

  // 加载状态
  globalLoading: boolean;

  // 通知状态
  notificationsEnabled: boolean;

  actions: {
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebarCollapse: () => void;
    setTheme: (theme: 'light' | 'dark' | 'auto') => void;
    openModal: (modalId: string, data?: any) => void;
    closeModal: () => void;
    setGlobalLoading: (loading: boolean) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
  };
}

export const useUIStore = create<UIState>()(
  persist(
    set => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'auto',
      activeModal: null,
      modalData: null,
      globalLoading: false,
      notificationsEnabled: true,

      actions: {
        toggleSidebar: () => {
          set(state => ({ sidebarOpen: !state.sidebarOpen }));
        },

        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        toggleSidebarCollapse: () => {
          set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
        },

        setTheme: (theme: 'light' | 'dark' | 'auto') => {
          set({ theme });

          // 应用主题到DOM
          if (theme !== 'auto') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
          } else {
            // 自动主题：跟随系统
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(isDark ? 'dark' : 'light');
          }
        },

        openModal: (modalId: string, data?: any) => {
          set({ activeModal: modalId, modalData: data });
        },

        closeModal: () => {
          set({ activeModal: null, modalData: null });
        },

        setGlobalLoading: (loading: boolean) => {
          set({ globalLoading: loading });
        },

        setNotificationsEnabled: (enabled: boolean) => {
          set({ notificationsEnabled: enabled });
        },
      },
    }),
    {
      name: 'ui-store',
      // 只持久化主题设置
      partialize: (state) => ({
        theme: state.theme,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);

// 选择器
export const useSidebarOpen = () => useUIStore(state => state.sidebarOpen);
export const useSidebarCollapsed = () => useUIStore(state => state.sidebarCollapsed);
export const useTheme = () => useUIStore(state => state.theme);
export const useActiveModal = () => useUIStore(state => state.activeModal);
export const useModalData = () => useUIStore(state => state.modalData);
export const useGlobalLoading = () => useUIStore(state => state.globalLoading);
