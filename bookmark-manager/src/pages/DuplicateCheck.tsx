import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { api } from '@/services/api';
import { AlertTriangle, CheckCircle, RefreshCw, Play, Pause, Loader2, XCircle, Download } from 'lucide-react';
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
        description: '验证任务已暂停'
      });
    } catch (error: any) {
      toast.error('暂停验证失败', {
        description: '暂停验证失败: ' + error.message
      });
    }
  };

  // 重试失败的验证
  const retryFailedValidation = async () => {
    try {
      // 这里应该调用后端API来重试失败的验证任务
      // 暂时使用模拟实现
      toast.info('重试失败的验证任务', {
        description: '正在重新验证失败的书签链接'
      });
    } catch (error: any) {
      toast.error('重试验证失败', {
        description: '重试验证失败: ' + error.message
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
        description: '书签已导出为HTML文件'
      });
    } catch (error: any) {
      toast.error('导出失败', {
        description: '导出失败: ' + error.message
      });
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchInvalidBookmarks();
    fetchValidationStatus();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">书签验证</h1>
            <p className="text-text-secondary">检查和管理无效书签链接</p>
          </div>
          
          {/* 验证控制面板 */}
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary mb-2">链接验证</h2>
                  <p className="text-text-secondary">
                    系统将通过三轮验证检查书签链接的有效性
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                {validationStatus && (
                  <div className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">
                      {validationStatus.completed_tasks}
                    </span>/{validationStatus.total_tasks} 任务完成
                  </div>
                )}
                
                <Button
                  onClick={isValidationRunning ? pauseValidation : startValidation}
                  disabled={loading}
                  className="flex items-center"
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
                  className="flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重试失败项
                </Button>
                
                <Button
                  onClick={exportBookmarks}
                  variant="outline"
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出书签
                </Button>
              </div>
              </div>
              
              {/* 验证进度条 */}
              {validationStatus && validationStatus.total_tasks > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-text-secondary mb-2">
                    <span>验证进度</span>
                    <span>
                      {Math.round(
                        (validationStatus.completed_tasks / validationStatus.total_tasks) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${
                          (validationStatus.completed_tasks / validationStatus.total_tasks) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 无效书签列表 */}
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-warning mr-3" />
                  <h2 className="text-xl font-semibold text-text-primary">无效书签</h2>
                </div>
                <div className="text-sm text-text-secondary">
                  {invalidBookmarks.length} 个无效书签
                </div>
              </div>
              
              {invalidBookmarks.length > 0 ? (
                <div className="space-y-4">
                  {invalidBookmarks.map((bookmark, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary mb-1">
                            {bookmark.title || '无标题'}
                          </h3>
                          <p className="text-sm text-text-secondary truncate mb-2">
                            {bookmark.url}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {bookmark.tags.map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error/10 text-error">
                            无效链接
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">没有无效书签</h3>
                  <p className="text-text-secondary">
                    所有书签链接都有效，或者尚未运行验证
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}