import {
  Search,
  Filter,
  Grid,
  List,
  Table,
  Trash2,
  Folder,
  Tag,
  Sparkles,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Download,
} from 'lucide-react';
import { debounceFn } from '@/lib/utils';
import { useState } from 'react';

interface BookmarkToolbarProps {
  selectedBookmarks: string[];
  filteredBookmarksLength: number;
  viewMode: 'grid' | 'list' | 'table';
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  toggleSelectAll: () => void;
  handleBatchDelete: () => void;
  handleBatchAutoTag: () => void;
  handleBatchAutoClassify: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedValidity: string;
  setSelectedValidity: (validity: string) => void;
  categories: string[];
  tags: string[];
  clearFilters: () => void;
  isValidationRunning?: boolean;
  onStartValidation?: () => void;
  onPauseValidation?: () => void;
  onRetryFailed?: () => void;
  onExport?: () => void;
  onManageFolders?: () => void;
}

export default function BookmarkToolbar({
  selectedBookmarks,
  filteredBookmarksLength,
  viewMode,
  setViewMode,
  toggleSelectAll,
  handleBatchDelete,
  handleBatchAutoTag,
  handleBatchAutoClassify,
  searchTerm,
  setSearchTerm,
  isFilterOpen,
  setIsFilterOpen,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  selectedValidity,
  setSelectedValidity,
  categories,
  tags,
  clearFilters,
  isValidationRunning = false,
  onStartValidation,
  onPauseValidation,
  onRetryFailed,
  onExport,
  onManageFolders,
}: BookmarkToolbarProps) {
  // 防抖搜索处理
  const debouncedSearch = debounceFn((term: string) => {
    setSearchTerm(term);
  }, 300);

  return (
    <div className="card p-5 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={
                selectedBookmarks.length === filteredBookmarksLength &&
                filteredBookmarksLength > 0
              }
              onChange={toggleSelectAll}
              className="h-5 w-5 text-primary rounded border-input focus:ring-primary focus:ring-2"
            />
            <span className="ml-2 text-body text-text-gray">
              {selectedBookmarks.length > 0
                ? `已选择 ${selectedBookmarks.length} 项`
                : '全选'}
            </span>
          </div>

          {selectedBookmarks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleBatchDelete}
                className="btn btn-danger flex items-center px-3 py-1.5 text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                批量删除
              </button>
              <button
                onClick={handleBatchAutoTag}
                className="btn btn-warning flex items-center px-3 py-1.5 text-sm"
              >
                <Tag className="w-4 h-4 mr-1" />
                批量打标
              </button>
              <button
                onClick={handleBatchAutoClassify}
                className="btn btn-primary flex items-center px-3 py-1.5 text-sm"
              >
                <Folder className="w-4 h-4 mr-1" />
                批量分类
              </button>
            </div>
          )}

          {/* 验证控制按钮 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onStartValidation}
              disabled={isValidationRunning}
              className="btn btn-primary flex items-center px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {isValidationRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  暂停验证
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  开始验证
                </>
              )}
            </button>
            <button
              onClick={onRetryFailed}
              className="btn btn-warning flex items-center px-3 py-1.5 text-sm"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重试失败项
            </button>
          </div>

          {/* 导出按钮 */}
          <button
            onClick={onExport}
            className="btn btn-success flex items-center px-3 py-1.5 text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            导出书签
          </button>

          {/* 文件夹管理按钮 */}
          <button
            onClick={onManageFolders}
            className="btn btn-info flex items-center px-3 py-1.5 text-sm"
          >
            <Folder className="w-4 h-4 mr-1" />
            管理文件夹
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* 搜索框 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-text-light" />
            </div>
            <input
              type="text"
              placeholder="搜索书签..."
              value={searchTerm}
              onChange={e => debouncedSearch(e.target.value)}
              className="pl-9 pr-8 py-2 w-64 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => debouncedSearch('')}
                className="absolute right-2 top-2 text-text-light hover:text-danger"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 筛选按钮 */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`btn ${isFilterOpen ? 'btn-primary' : 'btn-outline'} flex items-center px-3 py-1.5 text-sm`}
          >
            <Filter className="w-4 h-4 mr-1" />
            筛选
          </button>

          {/* 视图切换按钮 - pills 样式 */}
          <div className="flex gap-1">
            <button
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'} flex items-center px-3 py-1.5 text-sm`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4 mr-1" />
              网格
            </button>
            <button
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'} flex items-center px-3 py-1.5 text-sm`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              列表
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'} flex items-center px-3 py-1.5 text-sm`}
              onClick={() => setViewMode('table')}
            >
              <Table className="w-4 h-4 mr-1" />
              表格
            </button>
          </div>
        </div>
      </div>

      {/* 筛选面板 */}
      {isFilterOpen && (
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
          {/* 分类筛选 */}
          <div className="flex items-center">
            <Folder className="w-4 h-4 text-text-light mr-2" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white shadow-sm"
            >
              <option value="">所有分类</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 标签筛选 */}
          <div className="flex items-center">
            <Tag className="w-4 h-4 text-text-light mr-2" />
            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              className="p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white shadow-sm"
            >
              <option value="">所有标签</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* 有效性筛选 */}
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-text-light mr-2" />
            <select
              value={selectedValidity}
              onChange={e => setSelectedValidity(e.target.value)}
              className="p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white shadow-sm"
            >
              <option value="">所有状态</option>
              <option value="valid">有效链接</option>
              <option value="invalid">无效链接</option>
            </select>
          </div>

          {/* 清除筛选 */}
          {(selectedCategory || selectedTag || selectedValidity) && (
            <button
              onClick={clearFilters}
              className="btn btn-ghost text-sm px-3 py-1.5"
            >
              清除筛选
            </button>
          )}
        </div>
      )}
    </div>
  );
}
