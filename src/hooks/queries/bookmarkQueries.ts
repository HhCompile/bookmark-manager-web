/**
 * 书签相关Query Hooks
 * 使用TanStack Query管理书签数据获取
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

/**
 * 获取书签列表
 */
export function useBookmarks(isValid?: boolean) {
  return useQuery({
    queryKey: ['bookmarks', isValid],
    queryFn: async () => {
      const response = await apiService.getBookmarks(isValid);
      return response.data.bookmarks;
    },
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取分类列表
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiService.getBookmarks();
      const categories = new Set(
        response.data.bookmarks
          .filter(b => b.category)
          .map(b => b.category as string)
      );
      return Array.from(categories);
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取标签列表
 */
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await apiService.getBookmarks();
      const tags = new Set<string>();
      response.data.bookmarks.forEach(b => {
        if (b.tags) {
          b.tags.forEach(tag => tags.add(tag));
        }
      });
      return Array.from(tags);
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 创建书签
 */
export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmark: { url: string; title: string }) => {
      const response = await apiService.addBookmark(bookmark);
      return response.data.bookmark;
    },
    onSuccess: () => {
      // 清除书签列表缓存
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('添加成功');
    },
    onError: (error: any) => {
      toast.error('添加失败', { description: error.message || '未知错误' });
    },
  });
}

/**
 * 更新书签
 */
export function useUpdateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, data }: { url: string; data: any }) => {
      const response = await apiService.updateBookmark(url, data);
      return response.data.bookmark;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('更新成功');
    },
    onError: (error: any) => {
      toast.error('更新失败', { description: error.message || '未知错误' });
    },
  });
}

/**
 * 删除书签
 */
export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      await apiService.deleteBookmark(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('删除成功');
    },
    onError: (error: any) => {
      toast.error('删除失败', { description: error.message || '未知错误' });
    },
  });
}

/**
 * 批量删除书签
 */
export function useBatchDeleteBookmarks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (urls: string[]) => {
      for (const url of urls) {
        await apiService.deleteBookmark(url);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success(`成功删除 ${variables.length} 个书签`);
    },
    onError: (error: any) => {
      toast.error('批量删除失败', { description: error.message || '未知错误' });
    },
  });
}

/**
 * 导出书签
 */
export function useExportBookmarks() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiService.exportBookmarks();
      return response;
    },
    onSuccess: () => {
      toast.success('导出成功', { description: '书签已导出' });
    },
    onError: (error: any) => {
      toast.error('导出失败', { description: error.message || '未知错误' });
    },
  });
}

/**
 * 启动链接验证
 */
export function useStartValidation() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiService.startValidation();
      return response.data;
    },
    onSuccess: () => {
      toast.success('验证已启动', {
        description: '正在验证书签链接有效性',
      });
    },
    onError: (error: any) => {
      toast.error('启动验证失败', { description: error.message || '未知错误' });
    },
  });
}

/**
 * 获取验证状态
 */
export function useValidationStatus() {
  return useQuery({
    queryKey: ['validation-status'],
    queryFn: async () => {
      const response = await apiService.getValidationStatus();
      return response.data;
    },
    refetchInterval: 5000, // 每5秒自动刷新
  });
}
