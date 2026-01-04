import { TrendingUp, Calendar } from 'lucide-react';

interface UploadStatsData {
  today: number;
  week: number;
  month: number;
}

/**
 * 上传统计组件
 * 展示上传文件的统计数据
 */
export default function UploadStats() {
  // 模拟数据，实际项目中应从后端获取
  const stats: UploadStatsData = {
    today: 3,
    week: 12,
    month: 45
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-5 flex items-center">
          <TrendingUp className="w-5 h-5 text-primary mr-3" />
          上传统计
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-text-secondary mr-2" />
              <span className="text-text-secondary">今日上传</span>
            </div>
            <span className="font-medium text-text-primary">{stats.today}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-text-secondary mr-2" />
              <span className="text-text-secondary">本周上传</span>
            </div>
            <span className="font-medium text-text-primary">{stats.week}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-text-secondary mr-2" />
              <span className="text-text-secondary">本月上传</span>
            </div>
            <span className="font-medium text-text-primary">{stats.month}</span>
          </div>
        </div>
      </div>
    </div>
  );
}