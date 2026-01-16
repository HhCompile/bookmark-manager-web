import {
  Search,
  Filter,
  Grid,
  List,
  Table,
  Trash2,
  Folder,
  Tag,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { debounceFn } from '@/lib/utils';

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
  onRetryFailed,
  onExport,
  onManageFolders,
}: BookmarkToolbarProps) {
  // 防抖搜索处理
  const debouncedSearch = debounceFn((term: string) => {
    setSearchTerm(term);
  }, 300);

  return (
    <div className="space-y-4">
      {/* 工具栏主内容 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 左侧操作按钮 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 全选控制 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={
                selectedBookmarks.length === filteredBookmarksLength &&
                filteredBookmarksLength > 0
              }
              onChange={toggleSelectAll}
              className="h-4 w-4 text-primary rounded border-input focus:ring-primary focus:ring-2"
            />
            <span className="ml-2 text-sm text-text-secondary">
              {selectedBookmarks.length > 0
                ? `已选择 ${selectedBookmarks.length} 项`
                : '全选'}
            </span>
          </div>

          {/* 批量操作按钮 */}
          {selectedBookmarks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleBatchDelete}
                variant="destructive"
                size="sm"
                className="flex items-center"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                批量删除
              </Button>
              <Button
                onClick={handleBatchAutoTag}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Tag className="w-3 h-3 mr-1" />
                批量打标
              </Button>
              <Button
                onClick={handleBatchAutoClassify}
                size="sm"
                className="flex items-center"
              >
                <Folder className="w-3 h-3 mr-1" />
                批量分类
              </Button>
            </div>
          )}

          {/* 验证控制按钮 */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onStartValidation}
              disabled={isValidationRunning}
              size="sm"
              className="flex items-center"
            >
              {isValidationRunning ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  暂停验证
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  开始验证
                </>
              )}
            </Button>
            <Button
              onClick={onRetryFailed}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              重试失败项
            </Button>
          </div>

          {/* 导出按钮 */}
          <Button
            onClick={onExport}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Download className="w-3 h-3 mr-1" />
            导出书签
          </Button>

          {/* 文件夹管理按钮 */}
          <Button
            onClick={onManageFolders}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Folder className="w-3 h-3 mr-1" />
            管理文件夹
          </Button>
        </div>

        {/* 右侧搜索和视图控制 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 搜索框 */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-text-tertiary" />
            </div>
            <input
              type="text"
              placeholder="搜索书签..."
              value={searchTerm}
              onChange={e => debouncedSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors bg-background"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => debouncedSearch('')}
                className="absolute right-2 top-2 p-1"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* 筛选按钮 */}
          <Button
            variant={isFilterOpen ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center"
          >
            <Filter className="w-4 h-4 mr-1" />
            筛选
          </Button>

          {/* 视图切换按钮 */}
          <div className="flex bg-background rounded-lg p-0.5">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-3 h-3 mr-1" />
              网格
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('list')}
            >
              <List className="w-3 h-3 mr-1" />
              列表
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('table')}
            >
              <Table className="w-3 h-3 mr-1" />
              表格
            </Button>
          </div>
        </div>
      </div>

      {/* 筛选面板 */}
      {isFilterOpen && (
        <div className="mt-3 p-4 bg-background rounded-lg border border-border">
          <div className="flex flex-wrap items-center gap-3">
            {/* 分类筛选 */}
            <div className="flex items-center gap-2 flex-1 min-w-[150px]">
              <Folder className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-surface"
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
            <div className="flex items-center gap-2 flex-1 min-w-[150px]">
              <Tag className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <select
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-surface"
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
            <div className="flex items-center gap-2 flex-1 min-w-[150px]">
              <CheckCircle className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <select
                value={selectedValidity}
                onChange={e => setSelectedValidity(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-surface"
              >
                <option value="">所有状态</option>
                <option value="valid">有效链接</option>
                <option value="invalid">无效链接</option>
              </select>
            </div>

            {/* 清除筛选 */}
            {(selectedCategory || selectedTag || selectedValidity) && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="flex items-center w-full sm:w-auto mt-2 sm:mt-0"
              >
                <XCircle className="w-3 h-3 mr-1" />
                清除筛选
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
