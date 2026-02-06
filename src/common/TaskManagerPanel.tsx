import {
  X,
  Play,
  Pause,
  SkipForward,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  ListOrdered,
  BarChart2,
  FileText,
  Code,
  GitBranch
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress: number
  priority: 'high' | 'medium' | 'low'
  source: 'user' | 'system' | 'trae'
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  errorMessage?: string
}

interface TaskManagerPanelProps {
  onClose: () => void
}

// Mock 任务数据
const mockTasks: Task[] = [
  {
    id: '1',
    title: '构建项目',
    description: '运行 pnpm run build 构建生产版本',
    status: 'completed',
    progress: 100,
    priority: 'high',
    source: 'user',
    createdAt: new Date('2026-02-04T10:00:00'),
    startedAt: new Date('2026-02-04T10:00:10'),
    completedAt: new Date('2026-02-04T10:01:30')
  },
  {
    id: '2',
    title: '修复 TypeScript 类型错误',
    description: '修复 AIConfirmationPanel.tsx 中的类型声明问题',
    status: 'completed',
    progress: 100,
    priority: 'high',
    source: 'system',
    createdAt: new Date('2026-02-04T10:02:00'),
    startedAt: new Date('2026-02-04T10:02:15'),
    completedAt: new Date('2026-02-04T10:03:45')
  },
  {
    id: '3',
    title: '安装依赖',
    description: '安装 React 类型声明文件',
    status: 'completed',
    progress: 100,
    priority: 'medium',
    source: 'trae',
    createdAt: new Date('2026-02-04T10:04:00'),
    startedAt: new Date('2026-02-04T10:04:20'),
    completedAt: new Date('2026-02-04T10:05:10')
  },
  {
    id: '4',
    title: '分析项目质量',
    description: '检查项目中的代码质量问题',
    status: 'in_progress',
    progress: 65,
    priority: 'high',
    source: 'trae',
    createdAt: new Date('2026-02-04T10:06:00'),
    startedAt: new Date('2026-02-04T10:06:30')
  },
  {
    id: '5',
    title: '优化构建体积',
    description: '分析并优化构建输出的体积',
    status: 'pending',
    progress: 0,
    priority: 'medium',
    source: 'system',
    createdAt: new Date('2026-02-04T10:07:00')
  }
]

export default function TaskManagerPanel({ onClose }: TaskManagerPanelProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  // 模拟任务进度更新
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.status === 'in_progress' && task.progress < 100) {
            const newProgress = Math.min(task.progress + 5, 100)
            const newStatus = newProgress === 100 ? ('completed' as const) : task.status
            const completedAt = newProgress === 100 ? new Date() : task.completedAt

            return {
              ...task,
              progress: newProgress,
              status: newStatus,
              completedAt
            }
          }
          return task
        })
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isAutoRefresh])

  const handleStartTask = (taskId: string) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === taskId && task.status === 'pending') {
          return {
            ...task,
            status: 'in_progress',
            startedAt: new Date()
          }
        }
        return task
      })
    })
  }

  const handlePauseTask = (taskId: string) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === taskId && task.status === 'in_progress') {
          return {
            ...task,
            status: 'pending'
          }
        }
        return task
      })
    })
  }

  const handleSkipTask = (taskId: string) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: 'completed',
            progress: 100,
            completedAt: new Date()
          }
        }
        return task
      })
    })
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const handleRetryTask = (taskId: string) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: 'pending',
            progress: 0,
            errorMessage: undefined,
            startedAt: undefined,
            completedAt: undefined
          }
        }
        return task
      })
    })
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-50'
      case 'in_progress':
        return 'text-blue-500 bg-blue-50'
      case 'completed':
        return 'text-green-500 bg-green-50'
      case 'failed':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return Clock
      case 'in_progress':
        return BarChart2
      case 'completed':
        return CheckCircle
      case 'failed':
        return AlertCircle
      default:
        return ListOrdered
    }
  }

  const getSourceIcon = (source: Task['source']) => {
    switch (source) {
      case 'user':
        return FileText
      case 'system':
        return Code
      case 'trae':
        return GitBranch
      default:
        return FileText
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-end z-50"
        onClick={onClose}>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white h-full w-full max-w-3xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <ListOrdered className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">任务管理面板</h2>
                <p className="text-sm text-gray-500">管理当前项目的所有任务，查看执行进度和状态</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={isAutoRefresh ? '暂停自动更新' : '启用自动更新'}>
                <RefreshCw className={`w-5 h-5 ${isAutoRefresh ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">总任务数</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">进行中</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.filter((t) => t.status === 'in_progress').length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">已完成</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter((t) => t.status === 'completed').length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">待处理</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tasks.filter((t) => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ListOrdered className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-lg font-medium">无任务</p>
                <p className="text-sm">当前项目没有任务需要执行</p>
              </div>
            ) : (
              tasks.map((task, index) => {
                const StatusIcon = getStatusIcon(task.status)
                const SourceIcon = getSourceIcon(task.source)

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, margin: 0 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {/* Task Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              <StatusIcon className="w-3 h-3 inline mr-1" />
                              {task.status === 'pending' && '待处理'}
                              {task.status === 'in_progress' && '进行中'}
                              {task.status === 'completed' && '已完成'}
                              {task.status === 'failed' && '失败'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority === 'high' && '高优先级'}
                              {task.priority === 'medium' && '中优先级'}
                              {task.priority === 'low' && '低优先级'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <SourceIcon className="w-3 h-3 mr-1" />
                              来源: {task.source === 'user' && '用户'}
                              {task.source === 'system' && '系统'}
                              {task.source === 'trae' && 'Trae'}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              创建: {task.createdAt.toLocaleTimeString()}
                            </div>
                            {task.startedAt && (
                              <div className="flex items-center text-xs text-gray-500">
                                开始: {task.startedAt.toLocaleTimeString()}
                              </div>
                            )}
                            {task.completedAt && (
                              <div className="flex items-center text-xs text-gray-500">
                                完成: {task.completedAt.toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="删除任务">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Task Description */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>

                    {/* Task Progress */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">执行进度</span>
                        <span className="text-sm font-medium text-gray-700">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-2.5 rounded-full ${task.status === 'in_progress' ? 'bg-blue-600' : task.status === 'completed' ? 'bg-green-600' : task.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'}`}
                        />
                      </div>

                      {/* Task Actions */}
                      <div className="flex items-center gap-2 mt-4">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleStartTask(task.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1">
                            <Play className="w-3.5 h-3.5" />
                            开始
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => handlePauseTask(task.id)}
                            className="px-3 py-1.5 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium flex items-center gap-1">
                            <Pause className="w-3.5 h-3.5" />
                            暂停
                          </button>
                        )}
                        {(task.status === 'pending' || task.status === 'in_progress') && (
                          <button
                            onClick={() => handleSkipTask(task.id)}
                            className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-1">
                            <SkipForward className="w-3.5 h-3.5" />
                            跳过
                          </button>
                        )}
                        {task.status === 'failed' && (
                          <button
                            onClick={() => handleRetryTask(task.id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5" />
                            重试
                          </button>
                        )}
                      </div>

                      {/* Error Message */}
                      {task.status === 'failed' && task.errorMessage && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-700">{task.errorMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>最后更新: {new Date().toLocaleString()}</span>
              <span>仅显示当前项目的任务</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
