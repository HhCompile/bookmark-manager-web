import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import UploadArea from './UploadArea';
import UploadProgress from './UploadProgress';
import { Bookmark } from '../../types/bookmark';

interface BookmarkUploadModuleProps {
  onUploadComplete: (bookmarks: Bookmark[]) => void;
  onCancel: () => void;
}

export default function BookmarkUploadModule({
  onUploadComplete,
  onCancel,
}: BookmarkUploadModuleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
    bookmarks?: Bookmark[];
  }>({ valid: false, message: '' });

  // 引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 重置状态 - 放在前面避免循环依赖
  const resetState = useCallback(() => {
    setUploading(false);
    setUploadStatus('idle');
    setUploadProgress(0);
    setSelectedFile(null);
    setErrorMessage('');
    setValidationResult({ valid: false, message: '' });
  }, []);

  // 处理上传开始
  const handleUploadStart = useCallback((file: File) => {
    // 检查文件大小
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      setUploadStatus('error');
      setErrorMessage('文件大小超过限制（最大 10MB）');
      return;
    }

    setSelectedFile(file);
    setUploadStatus('uploading');
    setUploading(true);
    setUploadProgress(0);
    setErrorMessage('');
  }, []);

  // 处理上传进度
  const handleUploadProgress = useCallback((progress: number) => {
    setUploadProgress(progress);
  }, []);

  // 处理上传完成
  const handleUploadComplete = useCallback(
    (result: { valid: boolean; message: string; bookmarks?: Bookmark[] }) => {
      setValidationResult(result);
      setUploadProgress(100);

      if (result.valid && result.bookmarks) {
        setUploadStatus('success');
        setTimeout(() => {
          onUploadComplete(result.bookmarks || []);
          setIsExpanded(false);
          resetState();
        }, 1500);
      } else {
        setUploadStatus('error');
        setErrorMessage(result.message);
        setUploading(false);
      }
    },
    [onUploadComplete, resetState]
  );

  // 处理上传取消
  const handleUploadCancel = useCallback(() => {
    setUploading(false);
    setUploadStatus('idle');
    setUploadProgress(0);
    setSelectedFile(null);
    setErrorMessage('');
  }, []);

  // 处理文件输入变化
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUploadStart(file);
      }
    },
    [handleUploadStart]
  );

  // 处理关闭
  const handleClose = useCallback(() => {
    if (!uploading) {
      setIsExpanded(false);
      resetState();
      onCancel();
    }
  }, [uploading, resetState, onCancel]);

  // 处理重试
  const handleRetry = useCallback(() => {
    resetState();
  }, [resetState]);

  return (
    <div className="relative">
      {/* 上传入口 */}
      {!isExpanded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">导入书签</h3>
              <p className="text-blue-100 text-sm">支持 HTML/JSON 格式文件</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">导入书签</h3>
              <button
                onClick={handleClose}
                disabled={uploading}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-4">
              {uploadStatus === 'idle' && (
                <>
                  <UploadArea
                    onUploadStart={handleUploadStart}
                    onUploadProgress={handleUploadProgress}
                    onUploadComplete={handleUploadComplete}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm,.json"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </>
              )}

              {uploadStatus === 'uploading' && selectedFile && (
                <UploadProgress
                  progress={uploadProgress}
                  status={uploadStatus}
                  onCancel={handleUploadCancel}
                  fileName={selectedFile.name}
                />
              )}

              {uploadStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    上传成功
                  </h4>
                  <p className="text-gray-600">
                    成功导入 {validationResult.bookmarks?.length || 0} 个书签
                  </p>
                </motion.div>
              )}

              {uploadStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    上传失败
                  </h4>
                  <p className="text-gray-600 mb-4">{errorMessage}</p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    重试
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
