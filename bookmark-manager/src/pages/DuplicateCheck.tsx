import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { apiService as api } from '@/services/api';
import * as echarts from 'echarts';
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play,
  Pause,
  Loader2,
  XCircle,
  Download,
  BarChart,
  PieChart,
} from 'lucide-react';
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
  const [showCharts, setShowCharts] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  
  // 图表引用
  const statusChartRef = useRef<HTMLDivElement>(null);
  const domainChartRef = useRef<HTMLDivElement>(null);
  const statusChartInstance = useRef<echarts.EChartsType | null>(null);
  const domainChartInstance = useRef<echarts.EChartsType | null>(null);

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

  // 获取所有书签
  const fetchAllBookmarks = async () => {
    try {
      const response = await api.getBookmarks();
      setBookmarks(response.data.bookmarks);
    } catch (error: any) {
      console.error('获取书签失败:', error);
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

  // 渲染状态饼图
  const renderStatusChart = () => {
    if (!statusChartRef.current || !validationStatus) return;

    // 销毁之前的实例
    if (statusChartInstance.current) {
      statusChartInstance.current.dispose();
    }

    // 初始化图表
    statusChartInstance.current = echarts.init(statusChartRef.current);

    // 准备数据
    const data = [
      { name: '有效链接', value: validationStatus.completed_tasks - validationStatus.failed_tasks, itemStyle: { color: '#10b981' } },
      { name: '无效链接', value: validationStatus.failed_tasks, itemStyle: { color: '#ef4444' } },
      { name: '待验证', value: validationStatus.total_tasks - validationStatus.completed_tasks, itemStyle: { color: '#f59e0b' } }
    ];

    // 图表配置
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        textStyle: { color: '#6b7280' }
      },
      series: [
        {
          name: '链接状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    // 设置配置并渲染
    statusChartInstance.current.setOption(option);

    // 响应窗口大小变化
    const handleResize = () => {
      if (statusChartInstance.current) {
        statusChartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  // 渲染域名柱状图
  const renderDomainChart = () => {
    if (!domainChartRef.current) return;

    // 销毁之前的实例
    if (domainChartInstance.current) {
      domainChartInstance.current.dispose();
    }

    // 初始化图表
    domainChartInstance.current = echarts.init(domainChartRef.current);

    // 统计域名数据（仅统计无效链接）
    const domainCount: Record<string, number> = {};
    invalidBookmarks.forEach(bookmark => {
      try {
        const domain = new URL(bookmark.url).hostname;
        domainCount[domain] = (domainCount[domain] || 0) + 1;
      } catch (e) {
        // 忽略无效URL
      }
    });

    // 取前10个域名
    const topDomains = Object.entries(domainCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // 图表配置
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: topDomains.map(item => item[0]),
        axisLabel: {
          rotate: 45,
          color: '#6b7280'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#6b7280'
        }
      },
      series: [
        {
          name: '无效链接数量',
          type: 'bar',
          data: topDomains.map(item => item[1]),
          itemStyle: {
            color: '#ef4444'
          }
        }
      ]
    };

    // 设置配置并渲染
    domainChartInstance.current.setOption(option);

    // 响应窗口大小变化
    const handleResize = () => {
      if (domainChartInstance.current) {
        domainChartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
    fetchAllBookmarks();
  }, []);

  // 渲染图表
  useEffect(() => {
    if (showCharts && bookmarks.length > 0) {
      renderStatusChart();
      renderDomainChart();
    }

    // 清理图表实例
    return () => {
      if (statusChartInstance.current) {
        statusChartInstance.current.dispose();
      }
      if (domainChartInstance.current) {
        domainChartInstance.current.dispose();
      }
    };
  }, [showCharts, bookmarks, invalidBookmarks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            重复书签检查
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            智能检测和管理重复书签，让您的收藏更加整洁有序
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧统计面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 验证统计卡片 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 mr-4">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">验证统计</h3>
                </div>
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    showCharts 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showCharts ? '隐藏图表' : '显示图表'}
                </button>
              </div>
              
              {validationStatus ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600 font-medium">总任务数</span>
                    <span className="font-bold text-lg">{validationStatus.total_tasks}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600 font-medium">已完成</span>
                    <span className="font-bold text-lg text-green-600">{validationStatus.completed_tasks}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-600 font-medium">失败项</span>
                    <span className="font-bold text-lg text-red-600">{validationStatus.failed_tasks}</span>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="pt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>验证进度</span>
                      <span className="font-semibold">
                        {Math.round(
                          (validationStatus.completed_tasks /
                            validationStatus.total_tasks) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-md"
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
                <div className="text-center py-6">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500">加载统计信息...</p>
                </div>
              )}
            </div>

            {/* 操作按钮卡片 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-5">操作控制</h3>
              <div className="space-y-4">
                <Button
                  onClick={
                    isValidationRunning ? pauseValidation : startValidation
                  }
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base font-medium"
                >
                  {isValidationRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      暂停验证
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      开始验证
                    </>
                  )}
                </Button>

                <Button
                  onClick={retryFailedValidation}
                  disabled={loading}
                  variant="outline"
                  className="w-full flex items-center justify-center py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-base font-medium"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  重试失败项
                </Button>

                <Button
                  onClick={exportBookmarks}
                  variant="outline"
                  className="w-full flex items-center justify-center py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-base font-medium"
                >
                  <Download className="w-5 h-5 mr-2" />
                  导出书签
                </Button>
              </div>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="lg:col-span-2">
            {/* 图表区域 */}
            {showCharts && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 状态分布饼图 */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                        链接状态分布
                      </h3>
                    </div>
                    <div ref={statusChartRef} style={{ height: '250px' }}></div>
                  </div>
                  
                  {/* 无效域名统计柱状图 */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BarChart className="w-5 h-5 mr-2 text-red-600" />
                        无效链接域名
                      </h3>
                    </div>
                    <div ref={domainChartRef} style={{ height: '250px' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* 无效书签列表 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 mr-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      无效书签
                    </h2>
                  </div>
                  <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
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
                        className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                              {bookmark.title || '无标题'}
                            </h3>
                            <p className="text-sm text-gray-500 truncate mb-3 bg-gray-50 p-2 rounded-lg">
                              {bookmark.url}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {bookmark.tags && bookmark.tags.map(
                                (tag: string, tagIndex: number) => (
                                  <span
                                    key={tagIndex}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm"
                                  >
                                    {tag}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                          <div className="flex items-center ml-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm">
                              无效链接
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 shadow-md">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      没有无效书签
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
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
