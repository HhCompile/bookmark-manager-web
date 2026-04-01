/**
 * HTML 导入弹窗组件
 * 支持拖拽上传书签文件
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  FolderOpen,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bookmark } from '@/types/bookmark';
import { validateBookmarkFile } from './BookmarkValidator';
import { useBookmarkContext } from '@/contexts/BookmarkContext';

interface HtmlImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (bookmarks: Bookmark[]) => void;
}

export default function HtmlImportDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: HtmlImportDialogProps) {
  const navigate = useNavigate();
  const { setImportedBookmarks } = useBookmarkContext();
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [importedBookmarks, setImportedBookmarksLocal] = useState<Bookmark[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 重置状态
  const resetState = useCallback(() => {
    setIsDragging(false);
    setUploadStatus('idle');
    setUploadProgress(0);
    setSelectedFile(null);
    setErrorMessage('');
    setImportedBookmarksLocal([]);
  }, []);

  // 处理关闭
  const handleClose = useCallback(() => {
    if (uploadStatus !== 'uploading') {
      resetState();
      onOpenChange(false);
    }
  }, [uploadStatus, resetState, onOpenChange]);

  // 处理文件上传
  const handleFileUpload = useCallback((file: File) => {
    // 检查文件大小
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('error');
      setErrorMessage('文件大小超过限制（最大 10MB）');
      return;
    }

    // 检查文件类型
    const allowedTypes = ['.html', '.htm', '.json'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setUploadStatus('error');
      setErrorMessage('不支持的文件类型，请上传 HTML 或 JSON 格式的书签文件');
      return;
    }

    setSelectedFile(file);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    // 读取文件
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 70);
        setUploadProgress(progress);
      }
    };

    reader.onload = (e) => {
      setUploadProgress(80);
      const content = e.target?.result as string;
      
      if (content) {
        setTimeout(() => {
          try {
            const result = validateBookmarkFile(content, file.name);
            setUploadProgress(100);
            
            if (result.valid && 'bookmarks' in result && result.bookmarks) {
              setUploadStatus('success');
              setImportedBookmarksLocal(result.bookmarks);
              // 设置到 Context 中
              setImportedBookmarks(result.bookmarks);
              onUploadComplete?.(result.bookmarks);
            } else {
              setUploadStatus('error');
              setErrorMessage(result.message);
            }
          } catch (error) {
            setUploadStatus('error');
            setErrorMessage(`验证过程中发生错误: ${error instanceof Error ? error.message : '未知错误'}`);
          }
        }, 300);
      } else {
        setUploadStatus('error');
        setErrorMessage('文件读取失败');
      }
    };

    reader.onerror = () => {
      setUploadStatus('error');
      setErrorMessage('文件读取错误');
    };

    reader.readAsText(file);
  }, [onUploadComplete, setImportedBookmarks]);

  // 处理拖拽进入
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // 处理拖拽离开
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // 处理拖拽悬停
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 处理文件放下
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // 处理重试
  const handleRetry = useCallback(() => {
    resetState();
  }, [resetState]);

  // 处理完成 - 跳转到书签管理页面
  const handleDone = useCallback(() => {
    resetState();
    onOpenChange(false);
    navigate('/app/bookmarks');
  }, [resetState, onOpenChange, navigate]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            导入书签文件
          </DialogTitle>
          <DialogDescription>
            从浏览器导出的 HTML 或 JSON 文件中导入书签
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* 初始状态 - 拖拽上传区域 */}
          {uploadStatus === 'idle' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* 拖拽区域 */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-300
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }
                `}
              >
                <motion.div
                  animate={isDragging ? { y: [0, -5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <div className={`
                    w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4
                    transition-colors duration-300
                    ${isDragging ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-100 to-cyan-100'}
                  `}>
                    <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-blue-600' : 'text-blue-500'}`} />
                  </div>
                </motion.div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isDragging ? '释放以上传文件' : '拖拽文件到此处'}
                </h3>
                <p className="text-gray-500 mb-4">
                  或 <span className="text-blue-600 font-medium">点击选择文件</span>
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <FileText className="w-4 h-4" />
                  <span>支持 .html, .htm, .json 格式</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* 说明信息 */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium text-amber-800 mb-1">如何导出书签文件？</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• <b>Chrome:</b> 书签管理器 → 导出书签</li>
                      <li>• <b>Edge:</b> 收藏夹 → 导出收藏夹</li>
                      <li>• <b>Firefox:</b> 书签 → 管理书签 → 导出</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 上传中状态 */}
          {uploadStatus === 'uploading' && selectedFile && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 py-4"
            >
              {/* 文件信息 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{selectedFile.name}</h4>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              </div>

              {/* 进度条 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">处理进度</span>
                  <span className="font-medium text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* 处理步骤 */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '文件读取', desc: '读取文件内容', threshold: 20 },
                  { label: '格式验证', desc: '验证文件格式', threshold: 60 },
                  { label: '内容解析', desc: '解析书签数据', threshold: 90 },
                ].map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                      uploadProgress >= step.threshold
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`text-xs font-medium mb-1 ${
                      uploadProgress >= step.threshold ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {step.label}
                    </div>
                    <div className="text-xs text-gray-500">{step.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 成功状态 */}
          {uploadStatus === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                导入成功
              </h4>
              <p className="text-gray-600 mb-6">
                成功导入 <span className="font-semibold text-green-600">{importedBookmarks.length}</span> 个书签
              </p>
              
              {/* 书签预览 */}
              {importedBookmarks.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-h-40 overflow-y-auto">
                  <p className="text-xs text-gray-500 mb-2">预览前 5 个书签：</p>
                  <ul className="space-y-2">
                    {importedBookmarks.slice(0, 5).map((bookmark, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="truncate text-gray-700" title={bookmark.title}>
                          {bookmark.title}
                        </span>
                      </li>
                    ))}
                    {importedBookmarks.length > 5 && (
                      <li className="text-xs text-gray-500 text-center">
                        还有 {importedBookmarks.length - 5} 个书签...
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              <Button onClick={handleDone} className="w-full bg-green-600 hover:bg-green-700">
                查看书签
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* 错误状态 */}
          {uploadStatus === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                导入失败
              </h4>
              <p className="text-gray-600 mb-6 text-sm">{errorMessage}</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  取消
                </Button>
                <Button onClick={handleRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  重试
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
