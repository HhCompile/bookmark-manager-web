import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useBookmarkStore } from '@/store/bookmarkStore';
import { api } from '@/services/api';

export default function UploadPage() {
  // 获取状态和动作函数
  const { setLoading, setError } = useBookmarkStore();
  
  // 本地状态
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  // 处理文件选择
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (!file) {
      alert('请选择一个文件');
      return;
    }

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 设置加载状态
      setLoading(true);
      setError(null);
      
      // 调用API上传文件
      const response = await api.uploadBookmarkFile(formData);
      
      // 保存上传结果
      setUploadResult(response.data);
      
      // 重置文件选择
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      // 设置错误信息
      setError('文件上传失败: ' + error.message);
      console.error('Upload error:', error);
    } finally {
      // 取消加载状态
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">上传书签文件</h2>
      
      {/* 上传区域 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <p className="mb-4">点击或拖拽文件到此区域上传</p>
        
        {/* 隐藏的文件输入框 */}
        <input 
          type="file" 
          accept=".html" 
          onChange={handleFileChange} 
          className="hidden" 
          id="file-upload" 
        />
        
        {/* 文件选择按钮 */}
        <label htmlFor="file-upload">
          <Button as="span" className="mr-2">
            选择文件
          </Button>
        </label>
        
        {/* 文件上传按钮 */}
        <Button onClick={handleUpload} disabled={!file}>
          上传文件
        </Button>
        
        {/* 文件信息显示 */}
        {file && (
          <p className="mt-2 text-sm text-gray-500">
            已选择: {file.name}
          </p>
        )}
        
        {/* 支持的文件格式说明 */}
        <p className="mt-4 text-sm text-gray-500">
          支持HTML格式的书签文件
        </p>
      </div>
      
      {/* 上传结果显示 */}
      {uploadResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-green-800 mb-2">上传成功</h3>
          <p className="text-green-700">
            文件 "{uploadResult.filename}" 上传成功，共处理 {uploadResult.processed_count} 个书签。
          </p>
        </div>
      )}
    </div>
  );
}