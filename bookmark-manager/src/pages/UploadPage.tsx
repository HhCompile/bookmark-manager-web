import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { api } from '@/services/api';
import { BookOpen, FileUp } from 'lucide-react';
import { toast } from 'sonner';

// 导入子组件
import FileUploadArea from '@/components/upload/FileUploadArea';
import UploadResult from '@/components/upload/UploadResult';
import UsageInstructions from '@/components/upload/UsageInstructions';
import UploadStats from '@/components/upload/UploadStats';
import RecentUploads from '@/components/upload/RecentUploads';

/**
 * 书签上传页面
 * 主要功能：
 * 1. 文件上传（支持拖拽和选择）
 * 2. 上传进度显示
 * 3. 上传结果展示
 * 4. 使用说明和统计信息展示
 */
export default function UploadPage() {
  // 获取状态和动作函数
  const { setLoading, setError, loading, error } = useBookmarkStore();
  const navigate = useNavigate();
  
  // 本地状态
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 处理文件变更
  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadProgress(0);
  };

  // 移除已选择的文件
  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  // 模拟上传进度（实际项目中应根据真实上传进度调整）
  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    return interval;
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (!file) {
      toast.warning('请选择文件', {
        description: '请先选择一个HTML格式的书签文件',
        duration: 3000,
      });
      return;
    }

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);

    let progressInterval: NodeJS.Timeout;
    try {
      // 设置加载状态
      setLoading(true);
      setError(null);
      
      // 模拟上传进度
      progressInterval = simulateUploadProgress();
      
      // 调用API上传文件
      console.log('开始上传文件:', file.name);
      const response = await api.uploadBookmarkFile(formData);
      console.log('上传响应:', response);
      
      // 完成上传进度
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // 保存上传结果
      setUploadResult(response.data);
      
      // 显示成功消息
      toast.success('上传成功', {
        description: `文件 "${response.data.filename}" 上传成功，共处理 ${response.data.processed_count} 个书签。`,
        duration: 5000,
      });
      
      // 重置文件选择
      setFile(null);
      
      // 自动跳转到书签列表页面
      setTimeout(() => {
        navigate('/bookmarks');
      }, 2000);
    } catch (error: any) {
      // 设置错误信息
      setError('文件上传失败: ' + error.message);
      toast.error('上传失败', {
        description: '文件上传失败: ' + error.message,
        duration: 5000,
      });
      console.error('Upload error:', error);
      clearInterval(progressInterval);
    } finally {
      // 取消加载状态
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">书签管理器</h1>
            <p className="text-text-secondary max-w-2xl mx-auto">上传并管理您的浏览器书签，智能分类和去重让您的书签井井有条</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 主内容区 - 上传区域 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 上传卡片 */}
              <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <FileUp className="w-5 h-5 text-primary mr-3" />
                      <h2 className="text-xl font-semibold text-text-primary">上传书签文件</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        HTML格式
                      </span>
                    </div>
                  </div>
                  
                  {/* 文件上传区域 */}
                  <FileUploadArea 
                    file={file}
                    onFileChange={handleFileChange}
                    loading={loading}
                    uploadProgress={uploadProgress}
                    onRemoveFile={handleRemoveFile}
                    onUpload={handleUpload}
                  />
                </div>
              </div>
              
              {/* 上传结果 */}
              <UploadResult 
                uploadResult={uploadResult} 
                error={error} 
              />
            </div>
            
            {/* 右侧信息面板 */}
            <div className="space-y-6">
              {/* 使用说明卡片 */}
              <UsageInstructions />
              
              {/* 上传统计卡片 */}
              <UploadStats />
              
              {/* 最近上传卡片 */}
              <RecentUploads />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}