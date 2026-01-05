import { formatDate } from '@/lib/utils';
import { FileIcon } from 'lucide-react';

interface RecentFile {
  name: string;
  time: string;
  count: number;
}

/**
 * 最近上传组件
 * 展示最近上传的文件记录
 */
export default function RecentUploads() {
  // 模拟数据，实际项目中应从后端获取
  const recentFiles: RecentFile[] = [
    {
      name: '书签备份_2024.html',
      time: '2024-10-04T14:30:00',
      count: 24,
    },
    {
      name: '技术文档收藏.html',
      time: '2024-10-03T10:15:00',
      count: 18,
    },
    {
      name: '学习资源集.html',
      time: '2024-10-01T16:45:00',
      count: 32,
    },
  ];

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-5 flex items-center">
          <FileIcon className="w-5 h-5 text-primary mr-3" />
          最近上传
        </h3>
        <ul className="space-y-4">
          {recentFiles.map((file, index) => (
            <li
              key={index}
              className="border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <p className="text-sm font-medium text-text-primary truncate">
                {file.name}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {formatDate(file.time, 'MM-dd HH:mm')} • {file.count}个书签
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
