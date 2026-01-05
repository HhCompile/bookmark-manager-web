import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play,
  Pause,
  Loader2,
  XCircle,
  Download,
} from 'lucide-react';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { apiService as api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// 导入子组件
import DuplicateGroup from '@/components/duplicate/DuplicateGroup';
import { Button } from '@/components/ui/button';

/**
 * 重复书签检查页面
 * 主要功能：
 * 1. 显示无效链接
 * 2. 管理验证任务
 * 3. 提供验证控制
 */
export default function DuplicateCheck() {
  const { setLoading, setError, loading, error } = useBookmarkStore();
  const navigate = useNavigate();

  // 本地状态
  const [invalidBookmarks, setInvalidBookmarks] = useState<any[]>([]);
  const [validationStatus, setValidationStatus] = useState<any>(null);
  const [isValidationRunning, setIsValidationRunning] = useState(false);

  // 获取无效书签
  const fetchInvalidBookmarks = async () => {
    try {
      setLoading(true);
      const response = await api.getInvalidBookmarks();
      setInvalidBookmarks(response.data.bookmarks);
    } catch (error: any) {
      setError('获取无效书签失败: ' + error.message);
      toast.error('获取失败', {
        description: '获取无效书签失败: ' + error.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取验证状态
  const fetchValidationStatus = async () => {
    try {
      const response = await api.getValidationStatus();
      setValidationStatus(response.data);
    } catch (error: any) {
      console.error('获取验证状态失败:', error);
    }
  };

  // 开始验证
  const startValidation = async () => {
    try {
      setIsValidationRunning(true);
      setLoading(true);
      const response = await api.startValidation();

      toast.success('验证已启动', {
        description: response.data.message,
        duration: 3000,
      });

      // 获取更新后的状态
      await fetchValidationStatus();
      await fetchInvalidBookmarks();
    } catch (error: any) {
      setError('启动验证失败: ' + error.message);
      toast.error('启动验证失败', {
        description: '启动验证失败: ' + error.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
      setIsValidationRunning(false);
    }
  };

  // 暂停验证
  const pauseValidation = async () => {
    try {
      // 这里应该调用后端API来暂停验证任务
      // 暂时使用模拟实现
      toast.info('暂停验证', {
        description: '验证任务已暂停',
      });
    } catch (error: any) {
      toast.error('暂停验证失败', {
        description: '暂停验证失败: ' + error.message,
      });
    }
  };

  // 重试失败的验证
  const retryFailedValidation = async () => {
    try {
      // 这里应该调用后端API来重试失败的验证任务
      // 暂时使用模拟实现
      toast.info('重试失败的验证任务', {
        description: '正在重新验证失败的书签链接',
      });
    } catch (error: any) {
      toast.error('重试验证失败', {
        description: '重试验证失败: ' + error.message,
      });
    }
  };

  // 导出书签
  const exportBookmarks = async () => {
    try {
      const response = await api.exportBookmarks();

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookmarks.html');
      document.body.appendChild(link);
      link.click();

      // 清理
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('导出成功', {
        description: '书签已导出为HTML文件',
      });
    } catch (error: any) {
      toast.error('导出失败', {
        description: '导出失败: ' + error.message,
      });
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchInvalidBookmarks();
    fetchValidationStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            重复书签检查
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            智能检测和管理重复书签，让您的收藏更加整洁有序
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧统计面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 验证统计卡片 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-blue-100 mr-3">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  验证统计
                </h3>
              </div>

              {validationStatus ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">总任务数</span>
                    <span className="font-medium">
                      {validationStatus.total_tasks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">已完成</span>
                    <span className="font-medium text-green-600">
                      {validationStatus.completed_tasks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">失败项</span>
                    <span className="font-medium text-red-600">
                      {validationStatus.failed_tasks}
                    </span>
                  </div>

                  {/* 进度条 */}
                  <div className="pt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>验证进度</span>
                      <span>
                        {Math.round(
                          (validationStatus.completed_tasks /
                            validationStatus.total_tasks) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${
                            (validationStatus.completed_tasks /
                              validationStatus.total_tasks) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">加载统计信息...</p>
                </div>
              )}
            </div>

            {/* 操作按钮卡片 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                操作控制
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={
                    isValidationRunning ? pauseValidation : startValidation
                  }
                  disabled={loading}
                  className="w-full flex items-center justify-center"
                >
                  {isValidationRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      暂停验证
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      开始验证
                    </>
                  )}
                </Button>

                <Button
                  onClick={retryFailedValidation}
                  disabled={loading}
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重试失败项
                </Button>

                <Button
                  onClick={exportBookmarks}
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出书签
                </Button>
              </div>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="lg:col-span-2">
            {/* 无效书签列表 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      无效书签
                    </h2>
                  </div>
                  <div className="text-sm text-gray-500">
                    {invalidBookmarks.length} 个无效书签
                  </div>
                </div>
              </div>

              <div className="p-6">
                {invalidBookmarks.length > 0 ? (
                  <div className="space-y-4">
                    {invalidBookmarks.map((bookmark, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {bookmark.title || '无标题'}
                            </h3>
                            <p className="text-sm text-gray-500 truncate mb-2">
                              {bookmark.url}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {bookmark.tags &&
                                bookmark.tags.map(
                                  (tag: string, tagIndex: number) => (
                                    <span
                                      key={tagIndex}
                                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                      {tag}
                                    </span>
                                  )
                                )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              无效链接
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      没有无效书签
                    </h3>
                    <p className="text-gray-500">
                      所有书签链接都有效，或者尚未运行验证
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
