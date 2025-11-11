import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadAreaProps {
  file: File | null;
  onFileChange: (file: File) => void;
  loading: boolean;
  uploadProgress: number;
  onRemoveFile: () => void;
  onUpload: () => void;
}

/**
 * 文件上传区域组件
 * 提供拖拽上传和文件选择功能
 * 
 * @param props - 组件属性
 */
export default function FileUploadArea({ 
  file, 
  onFileChange, 
  loading, 
  uploadProgress, 
  onRemoveFile, 
  onUpload 
}: FileUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  // 拖拽事件处理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  // 触发文件选择
  const triggerFileSelect = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <div className="mt-6">
      {/* 拖拽区域 */}
      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <div className="flex flex-col items-center">
          {/* 上传图标 */}
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {file ? '文件已选择' : '拖拽文件到此处'}
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md text-base">
            {file 
              ? file.name 
              : '或点击选择文件'
            }
          </p>
          
          {/* 文件选择按钮 */}
          <button 
            onClick={triggerFileSelect}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg text-base font-semibold"
            disabled={loading}
          >
            {file ? '重新选择文件' : '选择文件'}
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            支持 .html 和 .htm 格式的Chrome书签文件
          </p>
          
          {/* 隐藏的文件输入框 */}
          <input 
            id="file-input"
            type="file" 
            accept=".html,.htm" 
            onChange={handleFileChange} 
            className="hidden" 
            disabled={loading}
          />
        </div>
      </div>
      
      {/* 文件信息和操作按钮 */}
      {file && (
        <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900 truncate max-w-xs md:max-w-md">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onRemoveFile}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                disabled={loading}
                aria-label="移除文件"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* 上传进度条 */}
          {loading && (
            <div className="mt-5">
              <div className="bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-center">
                <p className="text-gray-600">正在解析书签文件...</p>
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="mt-6 flex justify-end">
            <button 
              onClick={onUpload}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg text-base font-semibold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  上传中...
                </span>
              ) : '开始上传'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}