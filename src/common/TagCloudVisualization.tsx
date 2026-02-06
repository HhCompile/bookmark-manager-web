import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { TrendingUp, Tag } from 'lucide-react';

interface TagCloudVisualizationProps {
  bookmarks: any[];
}

export default function TagCloudVisualization({
  bookmarks,
}: TagCloudVisualizationProps) {
  // 统计标签分布
  const tagStats = bookmarks.reduce((acc: any, bookmark) => {
    bookmark.tags.forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  // 转换为图表数据
  const chartData = Object.entries(tagStats).map(([name, value]) => ({
    name,
    value: value as number,
  }));

  // 统计分类分布
  const categoryStats = bookmarks.reduce((acc: any, bookmark) => {
    const category = bookmark.category || '未分类';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryStats).map(([name, value]) => ({
    name,
    value: value as number,
    percentage: (((value as number) / bookmarks.length) * 100).toFixed(1),
  }));

  const COLORS = [
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#10B981',
    '#EF4444',
  ];

  return (
    <div className="space-y-6">
      {/* 分类分布饼图 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">书签分类分布</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 饼图 */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 统计列表 */}
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.value}
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 标签词云 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">热门标签</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {chartData
            .sort((a, b) => b.value - a.value)
            .map((tag, index) => {
              const size = Math.max(12, Math.min(24, 12 + tag.value * 2));
              return (
                <button
                  key={tag.name}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all"
                  style={{
                    fontSize: `${size}px`,
                    opacity: 1 - index * 0.05,
                  }}
                >
                  {tag.name}
                  <span className="ml-1 text-xs">({tag.value})</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* 统计摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-1">总书签数</p>
          <p className="text-3xl font-bold">{bookmarks.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-1">总分类数</p>
          <p className="text-3xl font-bold">
            {Object.keys(categoryStats).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-1">总标签数</p>
          <p className="text-3xl font-bold">{Object.keys(tagStats).length}</p>
        </div>
      </div>
    </div>
  );
}
