/**
 * 上传区域组件
 * 使用 ahooks 的 useSetState 和 useToggle 优化
 */

import { useRef, useCallback, useState } from 'react';
import { useSetState } from 'ahooks';
import { motion } from 'motion/react';
import { Upload, FileText, Copy, AlertCircle } from 'lucide-react';
import { validateBookmarkFile } from './BookmarkValidator';
import { Bookmark } from '@/types/bookmark';
import { UPLOAD_CONFIG, ERROR_MESSAGES } from '@/utils';

interface UploadAreaProps {
  onUploadStart: (file: File) => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (result: {
    valid: boolean;
    message: string;
    bookmarks?: Bookmark[];
  }) => void;
}

interface UploadState {
  pastedContent: string;
  fileInputValue: string;
}

export default function UploadArea({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
}: UploadAreaProps) {
  // 使用 ahooks 管理状态
  const [pasteMode, setPasteMode] = useState(false);
  const [state, setState] = useSetState<UploadState>({
    pastedContent: '',
    fileInputValue: '',
  });
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

  // 处理拖拽放下
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    []
  );

  // 验证和上传文件
  const handleFileUpload = useCallback(
    (file: File) => {
      // 检查文件类型
      const fileExtension = ('.' + file.name.split('.').pop()?.toLowerCase()) as '.html' | '.htm' | '.json';
      if (!UPLOAD_CONFIG.allowedTypes.includes(fileExtension)) {
        onUploadComplete({
          valid: false,
          message: ERROR_MESSAGES.invalidFileType,
        });
        return;
      }

      // 检查文件大小
      if (file.size > UPLOAD_CONFIG.maxSize) {
        onUploadComplete({
          valid: false,
          message: ERROR_MESSAGES.fileTooLarge,
        });
        return;
      }

      onUploadStart(file);

      // 读取文件
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 30);
          onUploadProgress(progress);
        }
      };

      reader.onload = (e) => {
        onUploadProgress(30);

        const content = e.target?.result as string;
        if (content) {
          setTimeout(() => {
            try {
              onUploadProgress(40);
              const result = validateBookmarkFile(content, file.name);
              onUploadProgress(50);
              onUploadComplete(result);
            } catch (error) {
              onUploadComplete({
                valid: false,
                message: `${ERROR_MESSAGES.validationError}: ${error instanceof Error ? error.message : '未知错误'}`,
              });
            }
          }, 100);
        } else {
          onUploadComplete({ valid: false, message: ERROR_MESSAGES.fileReadError });
        }
      };

      reader.onerror = () => {
        onUploadComplete({ valid: false, message: ERROR_MESSAGES.fileReadError });
      };

      reader.readAsText(file);
    },
    [onUploadStart, onUploadProgress, onUploadComplete]
  );

  // 处理文件选择
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
        setState({ fileInputValue: '' });
      }
    },
    [handleFileUpload, setState]
  );

  // 处理粘贴上传
  const handlePasteUpload = useCallback(() => {
    if (!state.pastedContent) return;

    // 检查粘贴内容大小
    if (state.pastedContent.length > UPLOAD_CONFIG.maxSize) {
      onUploadComplete({
        valid: false,
        message: ERROR_MESSAGES.fileTooLarge,
      });
      return;
    }

    onUploadStart(
      new File([state.pastedContent], 'pasted-bookmarks.html', {
        type: 'text/html',
      })
    );
    onUploadProgress(80);

    setTimeout(() => {
      try {
        const result = validateBookmarkFile(
          state.pastedContent,
          'pasted-bookmarks.html'
        );
        onUploadProgress(100);
        onUploadComplete(result);
      } catch (error) {
        onUploadComplete({
          valid: false,
          message: `${ERROR_MESSAGES.validationError}: ${error instanceof Error ? error.message : '未知错误'}`,
        });
      }
    }, 300);
  }, [state.pastedContent, onUploadStart, onUploadProgress, onUploadComplete]);

  // 取消粘贴模式
  const handleCancelPaste = useCallback(() => {
    setPasteMode(false);
    setState({ pastedContent: '' });
  }, [setState]);



  return (
    <div className="space-y-6">
      {/* 拖拽上传区域 */}
      {!pasteMode ? (
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
            }
          `}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="mb-4"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            拖拽文件到此处上传
          </h3>
          <p className="text-gray-600 mb-6">
            或{' '}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => setPasteMode(true)}
            >
              粘贴书签内容
            </span>
          </p>

          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="file-upload"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>选择书签文件</span>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".html,.json,.htm"
              className="hidden"
              value={state.fileInputValue}
              onChange={handleFileSelect}
            />
            <p className="text-xs text-gray-500">
              支持 HTML 书签文件 (.html) 和 JSON 书签文件 (.json)
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-blue-300 rounded-xl p-6 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                粘贴书签内容
              </h3>
            </div>
            <button
              onClick={handleCancelPaste}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span className="text-sm">取消</span>
            </button>
          </div>

          <textarea
            ref={textAreaRef}
            value={state.pastedContent}
            onChange={(e) => setState({ pastedContent: e.target.value })}
            placeholder="粘贴书签内容到此处..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[200px] resize-y"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePasteUpload}
              disabled={!state.pastedContent}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上传粘贴内容
            </button>
            <button
              onClick={handleCancelPaste}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 上传说明 */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          上传说明
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 支持从 Chrome、Firefox、Edge 等浏览器导出的 HTML 书签文件</li>
          <li>• 支持 JSON 格式的书签文件</li>
          <li>• 文件大小限制：10MB</li>
          <li>• 上传前会自动验证文件格式是否正确</li>
          <li>• 验证失败会显示具体的格式问题</li>
        </ul>
      </div>
    </div>
  );
}
