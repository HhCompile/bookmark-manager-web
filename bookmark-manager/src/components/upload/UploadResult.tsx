import { CheckCircle, AlertCircle } from 'lucide-react';

interface UploadResultProps {
  uploadResult: {
    filename: string;
    processed_count: number;
  } | null;
  error: string | null;
}

/**
 * 上传结果展示组件
 * 显示文件上传成功或失败的结果
 * 
 * @param props - 组件属性
 */
export default function UploadResult({ uploadResult, error }: UploadResultProps) {
  // 如果没有结果和错误，不渲染任何内容
  if (!uploadResult && !error) {
    return null;
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">上传结果</h3>
        
        {uploadResult && (
          <div className="rounded-lg border border-success/20 bg-success/5 p-5">
            <div className="flex">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-success mt-0.5" />
              <div className="ml-4">
                <h4 className="text-base font-medium text-success">上传成功</h4>
                <div className="mt-3 text-sm text-text-secondary space-y-2">
                  <p className="font-medium text-text-primary">文件 "{uploadResult.filename}" 上传成功</p>
                  <p>共处理 <span className="font-medium text-text-primary">{uploadResult.processed_count}</span> 个书签</p>
                  <p className="text-xs text-text-tertiary mt-2">您可以前往书签列表页面查看和管理您的书签</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="rounded-lg border border-error/20 bg-error/5 p-5">
            <div className="flex">
              <AlertCircle className="flex-shrink-0 w-5 h-5 text-error mt-0.5" />
              <div className="ml-4">
                <h4 className="text-base font-medium text-error">上传失败</h4>
                <div className="mt-3 text-sm text-text-secondary">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}