/**
 * 隐私空间相关 API
 */

import { api, useApiQuery, useApiMutation } from './client';
import type { Bookmark } from '../types/bookmark';

// 解锁响应
export interface UnlockResponse {
  success: boolean;
  token?: string;
  expiresAt?: string;
}

// 隐私书签查询
export function useVaultBookmarksQuery(enabled: boolean = false) {
  return useApiQuery<Bookmark[]>(
    ['vault', 'bookmarks'],
    '/vault/bookmarks',
    {},
    { enabled }
  );
}

// 解锁隐私空间
export function useUnlockVault() {
  return useApiMutation<UnlockResponse, { password: string }>(
    '/vault/unlock',
    'POST',
    {
      onSuccess: () => {
        // 解锁成功后可以启用书签查询
      },
    }
  );
}

// 锁定隐私空间
export function useLockVault() {
  return useApiMutation<void, void>(
    '/vault/lock',
    'POST',
    {
      invalidateKeys: [['vault']],
    }
  );
}

// 创建隐私书签
export function useCreateVaultBookmark() {
  return useApiMutation<Bookmark, Omit<Bookmark, 'id' | 'addedDate'>>('/vault/bookmarks', 'POST', {
    invalidateKeys: [['vault', 'bookmarks']],
  });
}

// 直接调用 API
export const vaultApi = {
  getBookmarks: () => api.get<Bookmark[]>('/vault/bookmarks'),
  unlock: (password: string) => api.post<UnlockResponse>('/vault/unlock', { password }),
  lock: () => api.post<void>('/vault/lock'),
  createBookmark: (data: Omit<Bookmark, 'id' | 'addedDate'>) =>
    api.post<Bookmark>('/vault/bookmarks', data),
};
