import { useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Copy, AlertCircle } from 'lucide-react';
import { validateBookmarkFile } from './BookmarkValidator';
import { Bookmark } from '../../types/bookmark';

interface UploadAreaProps {
  onUploadStart: (file: File) => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (result: {
    valid: boolean;
    message: string;
    bookmarks?: Bookmark[];
  }) => void;
}

export default function UploadArea({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [fileInputValue, setFileInputValue] = useState('');

  // 引用
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

  // 处理文件上传
  const handleFileUpload = useCallback(
    (file: File) => {
      onUploadStart(file);

      // 读取文件
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 70); // 70% 是文件读取进度
          onUploadProgress(progress);
        }
      };

      reader.onload = (e) => {
        onUploadProgress(80); // 80% 是文件读取完成

        const content = e.target?.result as string;
        if (content) {
          // 验证文件内容
          setTimeout(() => {
            try {
              const result = validateBookmarkFile(content, file.name);
              onUploadProgress(100); // 100% 是验证完成
              onUploadComplete(result);
            } catch (error) {
              onUploadComplete({
                valid: false,
                message: `验证过程中发生错误: ${error instanceof Error ? error.message : '未知错误'}`,
              });
            }
          }, 300);
        } else {
          onUploadComplete({ valid: false, message: '文件读取失败' });
        }
      };

      reader.onerror = () => {
        onUploadComplete({ valid: false, message: '文件读取错误' });
      };

      reader.readAsText(file);
    },
    [onUploadStart, onUploadProgress, onUploadComplete]
  );

  // 处理拖拽放下
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        // 检查文件类型
        const allowedTypes = ['.html', '.htm', '.json'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
          onUploadComplete({
            valid: false,
            message: '不支持的文件类型，请上传 HTML 或 JSON 格式的书签文件',
          });
          return;
        }
        handleFileUpload(file);
      }
    },
    [handleFileUpload, onUploadComplete]
  );

  // 处理文件选择
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        handleFileUpload(file);
        // 重置文件输入值，以便可以重新选择同一个文件
        setFileInputValue('');
      }
    },
    [handleFileUpload]
  );

  // 处理粘贴
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    const text = clipboardData.getData('text');
    if (text) {
      setPastedContent(text);
      setPasteMode(true);
    }
  }, []);

  // 处理粘贴内容上传
  const handlePasteUpload = useCallback(() => {
    if (pastedContent) {
      // 检查粘贴内容大小
      if (pastedContent.length > 10 * 1024 * 1024) {
        // 10MB
        onUploadComplete({
          valid: false,
          message: '粘贴内容超过限制（最大 10MB）',
        });
        return;
      }

      onUploadStart(
        new File([pastedContent], 'pasted-bookmarks.html', {
          type: 'text/html',
        })
      );
      onUploadProgress(80);

      setTimeout(() => {
        try {
          const result = validateBookmarkFile(
            pastedContent,
            'pasted-bookmarks.html'
          );
          onUploadProgress(100);
          onUploadComplete(result);
        } catch (error) {
          onUploadComplete({
            valid: false,
            message: `验证过程中发生错误: ${error instanceof Error ? error.message : '未知错误'}`,
          });
        }
      }, 300);
    }
  }, [pastedContent, onUploadStart, onUploadProgress, onUploadComplete]);

  // 处理取消粘贴模式
  const handleCancelPaste = useCallback(() => {
    setPasteMode(false);
    setPastedContent('');
  }, []);

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
          onPaste={handlePaste}
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
              value={fileInputValue}
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
            value={pastedContent}
            onChange={(e) => setPastedContent(e.target.value)}
            placeholder="粘贴书签内容到此处..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[200px] resize-y"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePasteUpload}
              disabled={!pastedContent}
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
