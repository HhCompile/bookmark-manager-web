import {
  X,
  Upload,
  Layout,
  Search,
  RefreshCw,
  CheckCircle,
  Target,
  Shield,
  BookOpen,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import CustomButton from '../components/ui/custom-button';

interface RegularDemoPanelProps {
  onClose: () => void;
}

export default function RegularDemoPanel({ onClose }: RegularDemoPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: '步骤 1：导入书签',
      description: '通过浏览器同步或导入 HTML 文件获取书签数据',
      visual: (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-8 border-2 border-dashed border-blue-300 shadow-md">
          {/* 导入方式 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">HTML 文件导入</h4>
                <p className="text-sm text-gray-600">
                  从任何浏览器导出的 HTML 文件快速导入
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring', delay: 0.3 }}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm"
            >
              <div className="p-3 bg-green-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">浏览器同步</h4>
                <p className="text-sm text-gray-600">
                  支持 Chrome、Edge、Firefox 等浏览器同步
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: '步骤 2：多视图管理',
      description: '三种视图模式，灵活管理不同类型的书签',
      visual: (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="p-4 bg-white rounded-lg border-2 border-blue-300 text-center"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)',
              }}
            >
              <div className="mb-2">
                <Layout className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium text-sm">列表视图</h4>
              <p className="text-xs text-gray-600 mt-1">详细信息展示</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', delay: 0.2 }}
              className="p-4 bg-white rounded-lg border-2 border-purple-300 text-center"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 15px -3px rgba(147, 51, 234, 0.1)',
              }}
            >
              <div className="mb-2">
                <BookOpen className="w-8 h-8 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium text-sm">卡片视图</h4>
              <p className="text-xs text-gray-600 mt-1">视觉化浏览</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', delay: 0.4 }}
              className="p-4 bg-white rounded-lg border-2 border-green-300 text-center"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)',
              }}
            >
              <div className="mb-2">
                <Target className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium text-sm">树状视图</h4>
              <p className="text-xs text-gray-600 mt-1">层级结构展示</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', delay: 0.6 }}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <p className="text-sm text-gray-700 text-center">
              自由切换三种视图模式，适配不同使用场景
            </p>
          </motion.div>
        </div>
      ),
    },
    {
      title: '步骤 3：智能搜索',
      description: '强大的搜索引擎，快速定位所需书签',
      visual: (
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-lg p-6 shadow-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Search className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索书签..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="text-sm">
                  支持标题、URL、标签、批注内容搜索
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="text-sm">实时搜索结果，边输入边匹配</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="text-sm">搜索历史记录，快速重复搜索</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: '步骤 4：质量监控',
      description: '自动化质量检测，保持书签库健康度',
      visual: (
        <div className="bg-gradient-to-br from-white to-green-50 rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="p-4 bg-white rounded-lg border border-green-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900">重复检测</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                自动识别并标记重复的书签
              </p>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  已启用
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', delay: 0.2 }}
              className="p-4 bg-white rounded-lg border border-green-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900">失效链接检测</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                定期检查并标记失效的链接
              </p>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  已启用
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', delay: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">书签库健康度</h4>
              <span className="text-sm font-medium text-green-600">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '95%' }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
              />
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: '步骤 5：隐私保护',
      description: '独立加密空间，保护敏感信息和学习资料',
      visual: (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-lg p-6 shadow-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-white rounded-lg border border-purple-200 shadow-sm p-4 mb-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">隐私空间</h4>
                <p className="text-sm text-gray-600">独立加密的书签存储空间</p>
              </div>
            </div>

            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">端到端加密保护</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">密码保护访问</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">隐私标签标记</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', delay: 0.9 }}
            className="p-4 bg-purple-50 rounded-lg border border-purple-200"
          >
            <p className="text-sm text-center text-purple-800">
              为敏感书签添加隐私标签，自动移至加密空间保护
            </p>
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  常规功能演示
                </h2>
                <p className="text-sm text-gray-600">
                  了解书签管理器的核心功能
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-2">
              {demoSteps.map((_, index) => (
                <div key={index} className="flex items-center flex-1">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                      index <= currentStep
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: index <= currentStep ? 1 : 1,
                      opacity: 1,
                      boxShadow:
                        index === currentStep
                          ? '0 0 0 4px rgba(55, 65, 81, 0.2), 0 10px 15px -3px rgba(55, 65, 81, 0.3), 0 4px 6px -2px rgba(55, 65, 81, 0.1)'
                          : index < currentStep
                            ? '0 0 0 2px rgba(55, 65, 81, 0.2)'
                            : 'none',
                    }}
                    transition={{
                      duration: 0.5,
                      type: 'spring',
                      delay: index * 0.2,
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {index < currentStep ? (
                      <motion.div
                        key={`check-${index}`}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3, type: 'spring' }}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  {index < demoSteps.length - 1 && (
                    <motion.div
                      className={`flex-1 h-1 mx-2 rounded transition-all ${
                        index < currentStep ? 'bg-gray-700' : 'bg-gray-200'
                      }`}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{
                        scaleX: index < currentStep ? 1 : 0,
                        opacity: 1,
                        backgroundColor:
                          index < currentStep ? '#374151' : '#e5e7eb',
                      }}
                      transition={{
                        duration: 0.5,
                        ease: 'easeOut',
                        delay: index * 0.2 + 0.3,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto p-6"
            style={{ height: '350px' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                layoutId="regularDemoStepContent"
              >
                <motion.h3
                  className="text-xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {demoSteps[currentStep].title}
                </motion.h3>
                <motion.p
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {demoSteps[currentStep].description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
                >
                  {demoSteps[currentStep].visual}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <CustomButton
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                icon={<ArrowLeft className="w-4 h-4" />}
                className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一步
              </CustomButton>

              <motion.div
                className="text-sm text-gray-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  repeatDelay: 2,
                }}
              >
                {currentStep + 1} / {demoSteps.length}
              </motion.div>

              {currentStep < demoSteps.length - 1 ? (
                <CustomButton
                  onClick={() => setCurrentStep(currentStep + 1)}
                  variant="secondary"
                  size="sm"
                  endIcon={<ArrowRight className="w-4 h-4" />}
                >
                  下一步
                </CustomButton>
              ) : (
                <CustomButton
                  onClick={onClose}
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  开始使用
                </CustomButton>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
