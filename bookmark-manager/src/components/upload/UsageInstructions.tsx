import { FileText } from 'lucide-react';

/**
 * 使用说明组件
 * 展示如何导出浏览器书签的步骤说明
 */
export default function UsageInstructions() {
  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-5 flex items-center">
          <FileText className="w-5 h-5 text-primary mr-3" />
          如何导出书签
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-medium text-primary">1</span>
            </div>
            <p className="text-text-secondary">
              在浏览器中打开书签管理器
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-medium text-primary">2</span>
            </div>
            <p className="text-text-secondary">
              选择"导出书签"或"备份书签"
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-medium text-primary">3</span>
            </div>
            <p className="text-text-secondary">
              保存为HTML格式文件
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-medium text-primary">4</span>
            </div>
            <p className="text-text-secondary">
              上传到此页面进行管理
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}