import { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';

interface ValidationTask {
  id: string;
  bookmarkUrl: string;
  title: string;
  round: number;
  method: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: boolean;
  details?: string;
  createdAt: string;
  completedAt?: string;
}

interface ValidationTaskManagerProps {
  tasks: ValidationTask[];
  onStartValidation: () => void;
  onPauseValidation: () => void;
  onRetryFailed: () => void;
}

/**
 * 验证任务管理组件
 * 展示和管理书签链接有效性验证任务
 * 
 * @param props - 组件属性
 */
export default function ValidationTaskManager({ 
  tasks, 
  onStartValidation, 
  onPauseValidation, 
  onRetryFailed 
}: ValidationTaskManagerProps) {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  
  // 切换任务详情展开/收起状态
  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  
  // 获取任务状态图标
  const getStatusIcon = (status: ValidationTask['status'], result?: boolean) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-text-secondary" />;
      case 'running':
        return <Activity className="w-4 h-4 text-primary animate-pulse" />;
      case 'completed':
        return result ? 
          <CheckCircle className="w-4 h-4 text-success" /> : 
          <XCircle className="w-4 h-4 text-error" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <Clock className="w-4 h-4 text-text-secondary" />;
    }
  };
  
  // 获取任务状态文本
  const getStatusText = (status: ValidationTask['status'], result?: boolean) => {
    switch (status) {
      case 'pending':
        return '待验证';
      case 'running':
        return '验证中';
      case 'completed':
        return result ? '有效' : '无效';
      case 'failed':
        return '验证失败';
      default:
        return '未知';
    }
  };
  
  // 获取任务状态样式
  const getStatusStyle = (status: ValidationTask['status'], result?: boolean) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 统计任务状态
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };
  
  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-text-primary">验证任务管理</h3>
          <div className="flex space-x-2">
            <button
              onClick={onStartValidation}
              className="flex items-center px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Play className="w-4 h-4 mr-1" />
              开始验证
            </button>
            <button
              onClick={onPauseValidation}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Pause className="w-4 h-4 mr-1" />
              暂停
            </button>
            <button
              onClick={onRetryFailed}
              className="flex items-center px-3 py-1.5 text-sm bg-warning text-white rounded-lg hover:bg-warning/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重试失败项
            </button>
          </div>
        </div>
        
        {/* 任务统计 */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="bg-gray-50/50 rounded-lg p-3 border border-border text-center">
            <p className="text-lg font-medium text-text-primary">{taskStats.total}</p>
            <p className="text-xs text-text-secondary">总计</p>
          </div>
          <div className="bg-gray-50/50 rounded-lg p-3 border border-border text-center">
            <p className="text-lg font-medium text-text-primary">{taskStats.pending}</p>
            <p className="text-xs text-text-secondary">待验证</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
            <p className="text-lg font-medium text-blue-800">{taskStats.running}</p>
            <p className="text-xs text-blue-600">验证中</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
            <p className="text-lg font-medium text-green-800">{taskStats.completed}</p>
            <p className="text-xs text-green-600">已完成</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 border border-red-200 text-center">
            <p className="text-lg font-medium text-red-800">{taskStats.failed}</p>
            <p className="text-xs text-red-600">失败</p>
          </div>
        </div>
        
        {/* 任务列表 */}
        <div className="border border-border rounded-lg overflow-hidden">
          {tasks.length > 0 ? (
            <ul className="divide-y divide-border">
              {tasks.map(task => (
                <li key={task.id} className="hover:bg-gray-50/50 transition-colors">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className="mr-2 p-1 rounded hover:bg-gray-100"
                        >
                          {expandedTasks[task.id] ? (
                            <ChevronDown className="w-4 h-4 text-text-secondary" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-text-secondary" />
                          )}
                        </button>
                        {getStatusIcon(task.status, task.result)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-text-primary truncate max-w-xs">
                            {task.title}
                          </p>
                          <p className="text-xs text-text-secondary truncate max-w-xs">
                            {task.bookmarkUrl}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(task.status, task.result)}`}>
                          {getStatusText(task.status, task.result)}
                        </span>
                        <span className="ml-2 text-xs text-text-secondary">
                          第{task.round}轮
                        </span>
                      </div>
                    </div>
                    
                    {/* 任务详情 */}
                    {expandedTasks[task.id] && (
                      <div className="mt-3 pl-10 pr-4 py-3 bg-gray-50/50 rounded-lg border border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-text-secondary">验证方法</p>
                            <p className="text-text-primary">{task.method}</p>
                          </div>
                          <div>
                            <p className="text-text-secondary">创建时间</p>
                            <p className="text-text-primary">{new Date(task.createdAt).toLocaleString()}</p>
                          </div>
                          {task.completedAt && (
                            <div>
                              <p className="text-text-secondary">完成时间</p>
                              <p className="text-text-primary">{new Date(task.completedAt).toLocaleString()}</p>
                            </div>
                          )}
                          {task.details && (
                            <div className="col-span-2">
                              <p className="text-text-secondary">详细信息</p>
                              <p className="text-text-primary">{task.details}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">暂无验证任务</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}