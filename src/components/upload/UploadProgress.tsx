import { motion } from 'motion/react';
import { X, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  onCancel: () => void;
  fileName: string;
}

export default function UploadProgress({
  progress,
  status,
  onCancel,
  fileName
}: UploadProgressProps) {
  return (
    <div className="space-y-6">
      {/* 文件信息 */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">正在处理</h3>
              <p className="text-sm text-gray-600 truncate max-w-md">
                {fileName}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            title="取消上传"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">处理进度</span>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full"
          />
        </div>
      </div>

      {/* 处理步骤 */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-3 rounded-lg border transition-all duration-300 ${progress >= 20 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="text-xs font-medium text-gray-700 mb-1">文件读取</div>
          <div className="text-xs text-gray-500">正在读取文件内容</div>
        </div>
        <div className={`p-3 rounded-lg border transition-all duration-300 ${progress >= 60 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="text-xs font-medium text-gray-700 mb-1">格式验证</div>
          <div className="text-xs text-gray-500">验证书签文件格式</div>
        </div>
        <div className={`p-3 rounded-lg border transition-all duration-300 ${progress >= 90 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="text-xs font-medium text-gray-700 mb-1">内容解析</div>
          <div className="text-xs text-gray-500">解析书签数据结构</div>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </div>
          <div className="text-sm text-gray-700">
            <p>系统正在处理您的书签文件，请稍候...</p>
            <p className="mt-1 text-xs text-gray-600">
              处理时间取决于文件大小和书签数量，通常需要几秒钟。
            </p>
          </div>
        </div>
      </div>

      {/* 取消按钮 */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          取消上传
        </motion.button>
      </div>
    </div>
  );
}
