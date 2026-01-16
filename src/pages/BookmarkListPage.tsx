import { Folder, X } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import GridView from '@/components/bookmark/GridView';
import TableView from '@/components/bookmark/TableView';
import Toolbar from '@/components/bookmark/Toolbar';
import FolderManager from '@/components/bookmark/FolderManager';
import { apiClient } from '@/services/apiClient';
import { extractKeywords } from '@/lib/tagging/keywordExtractor';
import { classifyBookmark } from '@/lib/classification/bookmarkClassifier';
import type { Bookmark } from '@/types/entities/bookmark';

export default function BookmarkListPage() {
  const queryClient = useQueryClient();
  
  // UI状态
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [showFolderManager, setShowFolderManager] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    tag: '',
    validity: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // 获取书签列表
  const { data: bookmarksData, isLoading, error, refetch } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await apiClient.get('/bookmarks');
      return response.data;
    },
  });
  
  const bookmarks = bookmarksData?.bookmarks || [];
  const categories = bookmarksData?.categories || [];
  const tags = bookmarksData?.tags || [];
  const folders = bookmarksData?.folders || [];
  
  // 删除书签Mutation
  const deleteMutation = useMutation({
    mutationFn: async (url: string) => {
      await apiClient.delete(`/bookmarks?url=${encodeURIComponent(url)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      setSelectedBookmarks(prev => prev.filter(url => url !== selectedBookmarks.find(s => s === url)));
      toast.success('删除成功');
    },
    onError: (error: any) => {
      toast.error('删除失败: ' + error.message);
    },
  });
  
  // 批量删除Mutation
  const batchDeleteMutation = useMutation({
    mutationFn: async (urls: string[]) => {
      await apiClient.post('/bookmarks/batch-delete', { urls });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      setSelectedBookmarks([]);
      toast.success(`成功删除 ${selectedBookmarks.length} 个书签`);
    },
    onError: (error: any) => {
      toast.error('批量删除失败: ' + error.message);
    },
  });
  
  // 更新书签Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ url, data }: { url: string; data: Partial<Bookmark> }) => {
      await apiClient.put(`/bookmarks?url=${encodeURIComponent(url)}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
  
  // 筛选书签
  const filteredBookmarks = bookmarks.filter((bookmark: Bookmark) => {
    // 搜索过滤
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!bookmark.title.toLowerCase().includes(searchLower) &&
          !bookmark.url.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    // 分类过滤
    if (filters.category && bookmark.category !== filters.category) {
      return false;
    }
    
    // 标签过滤
    if (filters.tag && (!bookmark.tags || !bookmark.tags.includes(filters.tag))) {
      return false;
    }
    
    // 有效性过滤
    if (filters.validity === 'valid' && !bookmark.isValid) {
      return false;
    }
    if (filters.validity === 'invalid' && bookmark.isValid) {
      return false;
    }
    
    return true;
  });
  
  // 处理单个删除
  const handleDelete = (url: string) => {
    if (window.confirm('确定要删除这个书签吗？')) {
      deleteMutation.mutate(url);
    }
  };
  
  // 处理批量删除
  const handleBatchDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedBookmarks.length} 个书签吗？`)) {
      batchDeleteMutation.mutate(selectedBookmarks);
    }
  };
  
  // 切换选择
  const toggleBookmarkSelection = (url: string) => {
    if (selectedBookmarks.includes(url)) {
      setSelectedBookmarks(prev => prev.filter(item => item !== url));
    } else {
      setSelectedBookmarks(prev => [...prev, url]);
    }
  };
  
  // 切换全选
  const toggleSelectAll = () => {
    if (selectedBookmarks.length === filteredBookmarks.length) {
      setSelectedBookmarks([]);
    } else {
      setSelectedBookmarks(filteredBookmarks.map((b: Bookmark) => b.url));
    }
  };
  
  // 清除筛选
  const clearFilters = () => {
    setFilters({ search: '', category: '', tag: '', validity: '' });
  };
  
  // 批量自动打标
  const handleBatchAutoTag = async () => {
    if (!window.confirm(`确定要为选中的 ${selectedBookmarks.length} 个书签自动打标吗？`)) {
      return;
    }
    
    try {
      const selectedItems = bookmarks.filter((b: Bookmark) => selectedBookmarks.includes(b.url));
      let successCount = 0;
      
      for (const bookmark of selectedItems) {
        const { keywords: newTags } = extractKeywords(bookmark.title, { maxTags: 3 });
        const updatedTags = [...new Set([...(bookmark.tags || []), ...newTags])].slice(0, 5);
        
        await updateMutation.mutateAsync({
          url: bookmark.url,
          data: { tags: updatedTags },
        });
        
        successCount++;
      }
      
      setSelectedBookmarks([]);
      toast.success(`成功为 ${successCount} 个书签自动打标`);
    } catch (error: any) {
      toast.error('批量自动打标失败: ' + error.message);
    }
  };
  
  // 批量自动分类
  const handleBatchAutoClassify = async () => {
    if (!window.confirm(`确定要为选中的 ${selectedBookmarks.length} 个书签自动分类吗？`)) {
      return;
    }
    
    try {
      const selectedItems = bookmarks.filter((b: Bookmark) => selectedBookmarks.includes(b.url));
      let successCount = 0;
      
      for (const bookmark of selectedItems) {
        const { category } = classifyBookmark(bookmark.title, bookmark.url);
        
        await updateMutation.mutateAsync({
          url: bookmark.url,
          data: { category },
        });
        
        successCount++;
      }
      
      setSelectedBookmarks([]);
      toast.success(`成功为 ${successCount} 个书签自动分类`);
    } catch (error: any) {
      toast.error('批量自动分类失败: ' + error.message);
    }
  };
  
  // 单个自动打标
  const handleAutoTag = async (bookmark: Bookmark) => {
    try {
      const { keywords: newTags } = extractKeywords(bookmark.title, { maxTags: 3 });
      const updatedTags = [...new Set([...(bookmark.tags || []), ...newTags])].slice(0, 5);
      
      await updateMutation.mutateAsync({
        url: bookmark.url,
        data: { tags: updatedTags },
      });
      
      toast.success(`为书签 "${bookmark.title}" 添加了标签: ${newTags.join(', ')}`);
    } catch (error: any) {
      toast.error('自动打标失败: ' + error.message);
    }
  };
  
  // 单个自动分类
  const handleAutoClassify = async (bookmark: Bookmark) => {
    try {
      const { category } = classifyBookmark(bookmark.title, bookmark.url);
      
      await updateMutation.mutateAsync({
        url: bookmark.url,
        data: { category },
      });
      
      toast.success(`书签 "${bookmark.title}" 已分类为: ${category}`);
    } catch (error: any) {
      toast.error('自动分类失败: ' + error.message);
    }
  };
  
  // 更新别名
  const handleUpdateAlias = async (bookmark: Bookmark, alias: string) => {
    try {
      await updateMutation.mutateAsync({
        url: bookmark.url,
        data: { alias: alias || undefined },
      });
      
      toast.success(`书签 "${bookmark.title}" 的别名已更新为: ${alias || '无别名'}`);
    } catch (error: any) {
      toast.error('更新别名失败: ' + error.message);
    }
  };
  
  // 文件夹管理
  const handleFoldersChange = () => {
    setShowFolderManager(false);
    toast.success('文件夹结构已更新');
  };
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-text-secondary">正在加载书签...</p>
      </div>
    );
  }
  
  // 错误状态
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="flex items-start">
          <X className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">加载失败</h3>
            <p className="text-red-600 dark:text-red-400 text-sm">{String(error)}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* 页面头部 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">书签管理</h1>
        <p className="text-text-secondary max-w-2xl">
          智能分类和整理您的书签，让您的收藏更加井井有条
        </p>
      </div>

      {/* 书签管理卡片 */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-lg">
        {/* 卡片头部 */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-purple-500/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                书签列表
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                找到{' '}
                <span className="font-medium text-primary">{filteredBookmarks.length}</span>{' '}
                个书签
              </p>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="p-6 border-b border-border">
          <Toolbar
            selectedBookmarks={selectedBookmarks}
            filteredBookmarksLength={filteredBookmarks.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
            toggleSelectAll={toggleSelectAll}
            handleBatchDelete={handleBatchDelete}
            handleBatchAutoTag={handleBatchAutoTag}
            handleBatchAutoClassify={handleBatchAutoClassify}
            searchTerm={filters.search}
            setSearchTerm={(term) => setFilters(prev => ({ ...prev, search: term }))}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            selectedCategory={filters.category}
            setSelectedCategory={(category) => setFilters(prev => ({ ...prev, category }))}
            selectedTag={filters.tag}
            setSelectedTag={(tag) => setFilters(prev => ({ ...prev, tag }))}
            selectedValidity={filters.validity}
            setSelectedValidity={(validity) => setFilters(prev => ({ ...prev, validity }))}
            categories={categories}
            tags={tags}
            clearFilters={clearFilters}
            onManageFolders={() => setShowFolderManager(true)}
          />
        </div>

        {/* 书签列表 */}
        <div className="p-6">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-4">
                <Folder className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                没有找到书签
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                {filters.search || filters.category || filters.tag || filters.validity
                  ? '没有匹配筛选条件的书签'
                  : '暂无书签，请先上传一些书签'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <GridView
              bookmarks={filteredBookmarks}
              selectedBookmarks={selectedBookmarks}
              toggleBookmarkSelection={toggleBookmarkSelection}
              handleDelete={handleDelete}
            />
          ) : (
            <TableView
              bookmarks={filteredBookmarks}
              selectedBookmarks={selectedBookmarks}
              toggleBookmarkSelection={toggleBookmarkSelection}
              handleDelete={handleDelete}
              handleAutoTag={handleAutoTag}
              handleAutoClassify={handleAutoClassify}
              handleUpdateAlias={handleUpdateAlias}
            />
          )}
        </div>
      </div>

      {/* 文件夹管理对话框 */}
      {showFolderManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-text-primary">
                  管理文件夹结构
                </h3>
                <button
                  onClick={() => setShowFolderManager(false)}
                  className="text-text-tertiary hover:text-text-secondary p-2 rounded-full hover:bg-surface-hover transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <FolderManager
                folders={folders}
                onFoldersChange={handleFoldersChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
