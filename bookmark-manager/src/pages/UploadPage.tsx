import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { apiService as api } from '@/services/api';
import { BookOpen, FileUp } from 'lucide-react';
import { toast } from 'sonner';

// 导入子组件
import FileUploadArea from '@/components/upload/FileUploadArea';
import UploadResult from '@/components/upload/UploadResult';
import UsageInstructions from '@/components/upload/UsageInstructions';
import UploadStats from '@/components/upload/UploadStats';
import RecentUploads from '@/components/upload/RecentUploads';
import SmartTaggingResult from '@/components/upload/SmartTaggingResult';
import FolderStructureConfirmation from '@/components/upload/FolderStructureConfirmation';
import ValidationTaskManager from '@/components/upload/ValidationTaskManager';

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
  const [taggingResult, setTaggingResult] = useState<any>(null);
  const [folderStructure, setFolderStructure] = useState<any>(null);
  const [showFolderConfirmation, setShowFolderConfirmation] = useState(false);
  const [validationTasks, setValidationTasks] = useState<any[]>([]);
  const [showValidationTasks, setShowValidationTasks] = useState(false);
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

  // 处理文件夹确认
  const handleFolderConfirm = (folders: any[]) => {
    // 在实际项目中，这里应该将确认的文件夹结构发送到后端
    console.log('确认的文件夹结构:', folders);

    // 隐藏文件夹确认界面
    setShowFolderConfirmation(false);

    // 模拟验证任务（实际项目中应从后端获取）
    const mockValidationTasks = [
      {
        id: '1',
        bookmarkUrl: 'https://reactjs.org',
        title: 'React - A JavaScript library for building user interfaces',
        round: 1,
        method: 'HTTP HEAD request',
        status: 'completed',
        result: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date(Date.now() - 10000).toISOString(),
      },
      {
        id: '2',
        bookmarkUrl: 'https://github.com',
        title: 'GitHub: Where the world builds software',
        round: 1,
        method: 'HTTP HEAD request',
        status: 'completed',
        result: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date(Date.now() - 8000).toISOString(),
      },
      {
        id: '3',
        bookmarkUrl: 'https://stackoverflow.com',
        title:
          'Stack Overflow - Where Developers Learn, Share, & Build Careers',
        round: 1,
        method: 'HTTP HEAD request',
        status: 'running',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        bookmarkUrl: 'https://invalid-url-example.com',
        title: '无效链接示例',
        round: 1,
        method: 'HTTP HEAD request',
        status: 'failed',
        details: 'ENOTFOUND - 无法解析域名',
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        bookmarkUrl: 'https://developer.mozilla.org',
        title: 'MDN Web Docs',
        round: 1,
        method: 'HTTP HEAD request',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];

    // 保存验证任务
    setValidationTasks(mockValidationTasks);

    // 显示验证任务管理界面
    setShowValidationTasks(true);

    // 显示成功消息
    toast.success('文件夹结构确认成功', {
      description: '文件夹结构已保存，现在可以开始验证书签链接的有效性。',
      duration: 3000,
    });
  };

  // 处理取消文件夹确认
  const handleFolderCancel = () => {
    // 隐藏文件夹确认界面
    setShowFolderConfirmation(false);

    // 显示提示消息
    toast.info('已取消文件夹确认', {
      description: '您可以稍后在书签管理页面调整文件夹结构。',
      duration: 3000,
    });

    // 自动跳转到书签列表页面
    setTimeout(() => {
      navigate('/bookmarks');
    }, 2000);
  };

  // 开始验证任务
  const handleStartValidation = () => {
    // 在实际项目中，这里应该调用后端API开始验证任务
    console.log('开始验证任务');

    // 更新验证任务状态
    setValidationTasks(prev =>
      prev.map(task =>
        task.status === 'pending' ? { ...task, status: 'running' } : task
      )
    );

    // 显示提示消息
    toast.info('开始验证任务', {
      description: '正在验证书签链接的有效性，请稍候。',
      duration: 3000,
    });
  };

  // 暂停验证任务
  const handlePauseValidation = () => {
    // 在实际项目中，这里应该调用后端API暂停验证任务
    console.log('暂停验证任务');

    // 更新验证任务状态
    setValidationTasks(prev =>
      prev.map(task =>
        task.status === 'running' ? { ...task, status: 'pending' } : task
      )
    );

    // 显示提示消息
    toast.info('已暂停验证任务', {
      description: '验证任务已暂停，您可以稍后继续。',
      duration: 3000,
    });
  };

  // 重试失败的验证任务
  const handleRetryFailed = () => {
    // 在实际项目中，这里应该调用后端API重试失败的验证任务
    console.log('重试失败的验证任务');

    // 更新验证任务状态
    setValidationTasks(prev =>
      prev.map(task =>
        task.status === 'failed' ? { ...task, status: 'pending' } : task
      )
    );

    // 显示提示消息
    toast.info('重试失败的验证任务', {
      description: '正在重新验证失败的书签链接。',
      duration: 3000,
    });
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

      // 模拟智能标记结果（实际项目中应从后端获取）
      const mockTaggingResult = {
        totalBookmarks: response.data.processed_count,
        taggedBookmarks: Math.floor(response.data.processed_count * 0.95),
        categories: [
          {
            name: '技术',
            count: Math.floor(response.data.processed_count * 0.4),
          },
          {
            name: '新闻',
            count: Math.floor(response.data.processed_count * 0.2),
          },
          {
            name: '娱乐',
            count: Math.floor(response.data.processed_count * 0.15),
          },
          {
            name: '学习',
            count: Math.floor(response.data.processed_count * 0.15),
          },
          {
            name: '购物',
            count: Math.floor(response.data.processed_count * 0.1),
          },
        ],
        tags: [
          {
            name: '编程',
            count: Math.floor(response.data.processed_count * 0.2),
          },
          {
            name: '开发',
            count: Math.floor(response.data.processed_count * 0.15),
          },
          {
            name: 'React',
            count: Math.floor(response.data.processed_count * 0.1),
          },
          {
            name: '前端',
            count: Math.floor(response.data.processed_count * 0.15),
          },
          {
            name: '后端',
            count: Math.floor(response.data.processed_count * 0.1),
          },
          {
            name: '数据库',
            count: Math.floor(response.data.processed_count * 0.05),
          },
          {
            name: 'AI',
            count: Math.floor(response.data.processed_count * 0.05),
          },
          {
            name: '机器学习',
            count: Math.floor(response.data.processed_count * 0.05),
          },
          {
            name: '科技',
            count: Math.floor(response.data.processed_count * 0.1),
          },
          {
            name: '设计',
            count: Math.floor(response.data.processed_count * 0.05),
          },
        ],
      };

      // 保存智能标记结果
      setTaggingResult(mockTaggingResult);

      // 模拟文件夹结构（实际项目中应从后端获取）
      const mockFolderStructure = [
        {
          id: '1',
          name: '技术文档',
          path: '/技术文档',
          bookmarkCount: Math.floor(response.data.processed_count * 0.3),
          children: [
            {
              id: '1-1',
              name: '前端开发',
              path: '/技术文档/前端开发',
              bookmarkCount: Math.floor(response.data.processed_count * 0.15),
              children: [
                {
                  id: '1-1-1',
                  name: 'React',
                  path: '/技术文档/前端开发/React',
                  bookmarkCount: Math.floor(
                    response.data.processed_count * 0.1
                  ),
                },
              ],
            },
            {
              id: '1-2',
              name: '后端开发',
              path: '/技术文档/后端开发',
              bookmarkCount: Math.floor(response.data.processed_count * 0.15),
            },
          ],
        },
        {
          id: '2',
          name: '学习资料',
          path: '/学习资料',
          bookmarkCount: Math.floor(response.data.processed_count * 0.25),
          children: [
            {
              id: '2-1',
              name: '在线课程',
              path: '/学习资料/在线课程',
              bookmarkCount: Math.floor(response.data.processed_count * 0.15),
            },
            {
              id: '2-2',
              name: '电子书',
              path: '/学习资料/电子书',
              bookmarkCount: Math.floor(response.data.processed_count * 0.1),
            },
          ],
        },
        {
          id: '3',
          name: '娱乐收藏',
          path: '/娱乐收藏',
          bookmarkCount: Math.floor(response.data.processed_count * 0.15),
        },
      ];

      // 保存文件夹结构
      setFolderStructure(mockFolderStructure);

      // 显示文件夹确认界面
      setShowFolderConfirmation(true);

      // 显示成功消息
      toast.success('上传成功', {
        description: `文件 "${response.data.filename}" 上传成功，共处理 ${response.data.processed_count} 个书签。`,
        duration: 5000,
      });

      // 重置文件选择
      setFile(null);
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
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              书签管理器
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              上传并管理您的浏览器书签，智能分类和去重让您的书签井井有条
            </p>
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
                      <h2 className="text-xl font-semibold text-text-primary">
                        上传书签文件
                      </h2>
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
              <UploadResult uploadResult={uploadResult} error={error} />

              {/* 智能标记结果 */}
              <SmartTaggingResult taggingResult={taggingResult} />

              {/* 文件夹结构确认 */}
              {showFolderConfirmation && folderStructure && (
                <FolderStructureConfirmation
                  folders={folderStructure}
                  onConfirm={handleFolderConfirm}
                  onCancel={handleFolderCancel}
                />
              )}

              {/* 验证任务管理 */}
              {showValidationTasks && (
                <ValidationTaskManager
                  tasks={validationTasks}
                  onStartValidation={handleStartValidation}
                  onPauseValidation={handlePauseValidation}
                  onRetryFailed={handleRetryFailed}
                />
              )}
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
