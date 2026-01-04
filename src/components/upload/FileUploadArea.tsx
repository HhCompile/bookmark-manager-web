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
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 border-2 border-dashed rounded-xl' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          {/* 上传图标 */}
          <div className="mb-4 p-3 rounded-full bg-blue-100">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {file ? '文件已选择' : '拖拽文件到此处'}
          </h3>
          
          <p className="text-gray-600 mb-5 max-w-md">
            {file 
              ? file.name 
              : '支持HTML格式的书签文件，或点击下方按钮选择文件'
            }
          </p>
          
          {/* 文件选择按钮 */}
          <button 
            onClick={triggerFileSelect}
            className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
            disabled={loading}
          >
            {file ? '重新选择文件' : '选择文件'}
          </button>
          
          {/* 隐藏的文件输入框 */}
          <input 
            id="file-input"
            type="file" 
            accept=".html" 
            onChange={handleFileChange} 
            className="hidden" 
            disabled={loading}
          />
        </div>
      </div>
      
      {/* 文件信息和操作按钮 */}
      {file && (
        <div className="mt-6 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onRemoveFile}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* 上传进度条 */}
          {loading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>上传进度</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="mt-5 flex justify-end">
            <button 
              onClick={onUpload}
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
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