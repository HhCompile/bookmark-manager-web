/**
 * 标签管理页面
 * 提供标签的查看、创建、编辑、删除、合并等功能
 */

import { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  GitMerge,
  TrendingUp,
  LayoutGrid,
  List,
} from 'lucide-react';
import { TagBadge } from '@/components/tags/TagBadge';
import { useTagsQuery, useTagStatsQuery, useDeleteTag } from '@/api/tags';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Tag as TagType } from '@/types/tag';

type ViewMode = 'grid' | 'list';
type SortBy = 'usage' | 'name' | 'created';

export function TagManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('usage');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [_selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [_isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagType | null>(null);

  const limit = viewMode === 'grid' ? 24 : 20;

  // 获取标签列表
  const { data: tagsData, isLoading } = useTagsQuery({
    page,
    limit,
    search: searchQuery,
    sort_by: sortBy,
  });

  // 获取标签统计
  const { data: statsData } = useTagStatsQuery();

  // 删除标签
  const deleteTagMutation = useDeleteTag();

  const handleDelete = (tag: TagType) => {
    setTagToDelete(tag);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tagToDelete) {
      deleteTagMutation.mutate(
        { tagId: tagToDelete.id },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            setTagToDelete(null);
          },
        }
      );
    }
  };

  const tags = tagsData?.tags || [];
  const totalPages = tagsData?.pagination?.pages || 1;
  const stats = statsData || {
    total: 0,
    system: 0,
    ai_generated: 0,
    user_created: 0,
    total_usage: 0,
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* 页面头部 */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Tag className="w-7 h-7 text-blue-500" />
              标签管理
            </h1>
            <p className="text-gray-500 mt-1">
              管理您的书签标签，创建、编辑、合并标签
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新建标签
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="总标签数"
            value={stats.total}
            icon={Tag}
            color="blue"
          />
          <StatCard
            title="使用次数"
            value={stats.total_usage}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="AI 生成"
            value={stats.ai_generated}
            icon={Tag}
            color="purple"
          />
          <StatCard
            title="用户创建"
            value={stats.user_created}
            icon={Tag}
            color="orange"
          />
        </div>
      </div>

      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* 搜索 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索标签..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        {/* 排序 */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-3 py-2 border rounded-lg text-sm bg-white"
        >
          <option value="usage">按使用次数</option>
          <option value="name">按名称</option>
          <option value="created">按创建时间</option>
        </select>

        {/* 视图切换 */}
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 标签列表 */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : tags.length === 0 ? (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? '未找到匹配的标签' : '暂无标签'}
          </p>
          {!searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              创建第一个标签
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tags.map((tag) => (
            <TagCard
              key={tag.id}
              tag={tag}
              onEdit={() => setSelectedTag(tag)}
              onDelete={() => handleDelete(tag)}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  标签
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  描述
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  使用次数
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <TagBadge
                      name={tag.name}
                      color={tag.color}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {tag.description || '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {tag.usage_count}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedTag(tag)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <GitMerge className="w-4 h-4 mr-2" />
                          合并
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(tag)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                page === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border hover:bg-gray-50'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除标签?</AlertDialogTitle>
            <AlertDialogDescription>
              您即将删除标签 "{tagToDelete?.name}"。此操作不会删除书签，
              只会移除书签上的该标签。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTagToDelete(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// 统计卡片组件
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// 标签卡片组件
interface TagCardProps {
  tag: TagType;
  onEdit: () => void;
  onDelete: () => void;
}

function TagCard({ tag, onEdit, onDelete }: TagCardProps) {
  return (
    <div className="group bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <TagBadge
          name={tag.name}
          color={tag.color}
          count={tag.usage_count}
          size="sm"
          className="max-w-[80%]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <GitMerge className="w-4 h-4 mr-2" />
              合并
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {tag.description && (
        <p className="mt-2 text-xs text-gray-500 line-clamp-1">
          {tag.description}
        </p>
      )}
    </div>
  );
}

export default TagManagementPage;
