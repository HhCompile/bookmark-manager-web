/**
 * 书签头部组件
 * 显示页面标题、统计信息和视图切换
 */

import { Grid, List, Table, BarChart3, BookOpen, Folder, Tag } from 'lucide-react';
import type { BookmarkStats } from '../../types';

interface BookmarkHeaderProps {
  stats: BookmarkStats;
  viewMode: 'grid' | 'list' | 'table';
  onViewModeChange: (mode: 'grid' | 'list' | 'table') => void;
  onExport?: () => void;
}

export function BookmarkHeader({
  stats,
  viewMode,
  onViewModeChange,
}: BookmarkHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">书签管理</h1>
          <p className="text-gray-600 mt-1">
            智能分类和整理您的书签，让您的收藏更加井井有条
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'grid'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>网格</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'list'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>列表</span>
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'table'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>表格</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="总书签"
          value={stats.total}
          icon={<BookOpen className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="有效链接"
          value={stats.valid}
          icon={<BarChart3 className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="分类数量"
          value={Object.keys(stats.byCategory).length}
          icon={<Folder className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="标签数量"
          value={Object.keys(stats.byTag).length}
          icon={<Tag className="w-6 h-6" />}
          color="orange"
        />
      </div>
    </div>
  );
}

/**
 * 统计卡片组件
 */
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className={`border rounded-xl p-6 ${colorClasses[color]}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 bg-white/50 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{formatNumber(value)}</p>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
