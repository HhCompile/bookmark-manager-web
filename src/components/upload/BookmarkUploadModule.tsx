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
    [onUploadComplete]
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

  // 重置状态
  const resetState = useCallback(() => {
    setUploading(false);
    setUploadStatus('idle');
    setUploadProgress(0);
    setSelectedFile(null);
    setErrorMessage('');
    setValidationResult({ valid: false, message: '' });
  }, []);

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
          onClick={() => setIsExpanded(true)}
          className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 h-full flex flex-col cursor-pointer group"
        >
          <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 mb-3 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">HTML 导入</h3>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            支持从浏览器导出的 HTML 文件快速导入
          </p>
          <div className="flex items-center gap-2 text-sm font-medium transition-all text-gray-400 group-hover:text-blue-600">
            开始使用
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-xl border border-blue-100 w-full max-w-2xl mx-auto"
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">书签导入</h2>
                <p className="text-sm text-gray-600">
                  上传浏览器书签文件或粘贴书签内容
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 主要内容 */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {uploadStatus === 'idle' ? (
                <motion.div
                  key="upload-area"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UploadArea
                    onUploadStart={handleUploadStart}
                    onUploadProgress={handleUploadProgress}
                    onUploadComplete={handleUploadComplete}
                  />
                </motion.div>
              ) : uploadStatus === 'uploading' ? (
                <motion.div
                  key="upload-progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UploadProgress
                    progress={uploadProgress}
                    status={uploadStatus}
                    onCancel={handleUploadCancel}
                    fileName={selectedFile?.name || ''}
                  />
                </motion.div>
              ) : uploadStatus === 'success' ? (
                <motion.div
                  key="upload-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    上传成功
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    书签文件已成功上传并验证通过
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    {validationResult.bookmarks?.length
                      ? `共导入 ${validationResult.bookmarks.length} 个书签`
                      : ''}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                  >
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      完成
                    </button>
                  </motion.div>
                </motion.div>
              ) : uploadStatus === 'error' ? (
                <motion.div
                  key="upload-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    上传失败
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {errorMessage || '书签文件验证失败'}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                  >
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      重试
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      取消
                    </button>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.json,.htm"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </motion.div>
      )}
    </div>
  );
}
