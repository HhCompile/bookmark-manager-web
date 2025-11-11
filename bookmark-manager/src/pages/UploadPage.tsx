import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { apiService as api } from '@/services/api';
import { BookOpen, FileUp, Upload } from 'lucide-react';
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
    <div className="min-h-screen hero-bg">
      {/* Hero区域 */}
      <section className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            智能整理
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Chrome书签</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            一键导入、智能分类、可视化管理的全新书签体验。让混乱的书签变得井井有条，提升您的浏览效率。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({behavior: 'smooth'})}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-lg hover:shadow-xl text-base"
            >
              开始整理
            </button>
            <button 
              onClick={() => {
                // 模拟加载示例数据
                toast.success('体验演示', {
                  description: '示例数据加载完成！即将展示智能分类效果...',
                  duration: 3000,
                  position: 'top-center',
                });
                
                // 模拟一些演示效果
                setTimeout(() => {
                  toast.info('智能分类完成', {
                    description: '已识别技术、新闻、娱乐等5个分类',
                    duration: 4000,
                    position: 'bottom-right',
                  });
                }, 1000);
              }}
              className="glass-effect text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:bg-opacity-20 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-lg hover:shadow-xl text-base"
            >
              体验演示
            </button>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="glass-effect rounded-2xl p-8 text-center text-white fade-in floating-element border border-white border-opacity-20 shadow-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">智能分类</h3>
            <p className="text-blue-100 text-base">基于AI算法自动识别书签类别，准确率高达90%以上</p>
          </div>
          <div className="glass-effect rounded-2xl p-8 text-center text-white fade-in floating-element border border-white border-opacity-20 shadow-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3" style={{animationDelay: '0.5s'}}>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">一键整理</h3>
            <p className="text-blue-100 text-base">拖拽上传，秒级处理，让混乱的书签瞬间变得井井有条</p>
          </div>
          <div className="glass-effect rounded-2xl p-8 text-center text-white fade-in floating-element border border-white border-opacity-20 shadow-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3" style={{animationDelay: '1s'}}>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 16v1a3 3 0 003 3h6a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">多格式导出</h3>
            <p className="text-blue-100 text-base">支持HTML、JSON、CSV等多种格式，方便导入其他浏览器</p>
          </div>
        </div>
      </section>

      {/* 上传区域 */}
      <section id="upload-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">上传Chrome书签文件</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">从Chrome浏览器导出书签HTML文件，拖拽到下方区域或点击上传</p>
          </div>

          {/* 上传卡片 */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-blue-100 mr-4">
                    <FileUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    上传书签文件
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200 shadow-sm">
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
      </section>

      {/* 使用说明 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">使用说明</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">简单三步，轻松整理您的Chrome书签</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">导出书签</h3>
              <p className="text-gray-600">在Chrome浏览器中打开书签管理器，选择"导出书签"，保存为HTML文件</p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">上传文件</h3>
              <p className="text-gray-600">将导出的HTML文件拖拽到上传区域，或点击选择文件</p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">获取结果</h3>
              <p className="text-gray-600">系统自动分类整理，查看结果并可按需要导出为各种格式</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center text-lg">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Chrome书签导出步骤：
            </h4>
            <ol className="list-decimal list-inside text-blue-800 space-y-2 ml-2">
              <li className="pl-2">打开Chrome浏览器，点击右上角的三个点菜单</li>
              <li className="pl-2">选择"书签" → "书签管理器"</li>
              <li className="pl-2">在书签管理器页面，点击右上角的三个点</li>
              <li className="pl-2">选择"导出书签"，选择保存位置并确认</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
