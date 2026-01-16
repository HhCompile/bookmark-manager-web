/**
 * 书签选中状态Store
 * 管理书签选择相关的全局状态
 */

import { create } from 'zustand';

interface SelectionState {
  selectedBookmarks: Set<string>;
  isAllSelected: boolean;
  selectedCount: number;

  actions: {
    toggleBookmarkSelection: (url: string) => void;
    setBookmarkSelection: (url: string, selected: boolean) => void;
    clearSelection: () => void;
    selectAll: (urls: string[]) => void;
  };
}

export const useSelectionStore = create<SelectionState>(set => ({
  selectedBookmarks: new Set<string>(),
  isAllSelected: false,
  selectedCount: 0,

  actions: {
    toggleBookmarkSelection: (url: string) => {
      set(state => {
        const newSelection = new Set(state.selectedBookmarks);
        if (newSelection.has(url)) {
          newSelection.delete(url);
        } else {
          newSelection.add(url);
        }

        return {
          selectedBookmarks: newSelection,
          isAllSelected: false,
          selectedCount: newSelection.size,
        };
      });
    },

    setBookmarkSelection: (url: string, selected: boolean) => {
      set(state => {
        const newSelection = new Set(state.selectedBookmarks);

        if (selected) {
          newSelection.add(url);
        } else {
          newSelection.delete(url);
        }

        return {
          selectedBookmarks: newSelection,
          selectedCount: newSelection.size,
          isAllSelected: false,
        };
      });
    },

    clearSelection: () => {
      set({
        selectedBookmarks: new Set(),
        isAllSelected: false,
        selectedCount: 0,
      });
    },

    selectAll: (urls: string[]) => {
      set({
        selectedBookmarks: new Set(urls),
        isAllSelected: true,
        selectedCount: urls.length,
      });
    },
  },
}));

// 选择器
export const useSelectedBookmarks = () => useSelectionStore(state => state.selectedBookmarks);
export const useIsAllSelected = () => useSelectionStore(state => state.isAllSelected);
export const useSelectedCount = () => useSelectionStore(state => state.selectedCount);
