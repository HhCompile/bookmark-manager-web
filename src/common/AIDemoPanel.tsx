import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useCallback } from 'react';
import CustomButton from '../components/ui/custom-button';

interface AIDemoPanelProps {
  onClose: () => void;
}

// 浏览器导入步骤的视觉组件
const ImportStepVisual = () => (
  <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-8 border-2 border-dashed border-blue-300 shadow-md">
    {/* 浏览器图标 */}
    <div className="flex justify-center gap-6 mb-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.1,
        }}
        className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer relative"
        whileHover={{ scale: 1.2 }}
        title="Chrome浏览器"
      >
        <span>Ch</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.2,
        }}
        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer relative"
        whileHover={{ scale: 1.2 }}
        title="Edge浏览器"
      >
        <span>Ed</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3,
        }}
        className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer relative"
        whileHover={{ scale: 1.2 }}
        title="Firefox浏览器"
      >
        <span>Fx</span>
      </motion.div>
    </div>

    {/* 导入流程 */}
    <div className="flex items-center justify-center gap-6 mb-6">
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.4,
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">📥</span>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.7,
        }}
      >
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-8 h-8 text-blue-500" />
        </motion.div>
      </motion.div>
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 1.0 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
      >
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">📚</span>
        </motion.div>
      </motion.div>
    </div>

    {/* 进度指示 */}
    <motion.div
      className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.3 }}
    >
      <motion.div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-700">导入进度</span>
        <span className="text-sm font-medium text-blue-700">100%</span>
      </motion.div>
      <motion.div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeOut', delay: 1.5 }}
        />
      </motion.div>
    </motion.div>

    <motion.p
      className="text-center text-sm font-medium text-gray-700 mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.8 }}
    >
      <motion.span
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        导入 120 个书签 → 等待 AI 分析
      </motion.span>
    </motion.p>
  </div>
);

// AI 分析步骤的视觉组件
const AnalysisStepVisual = () => (
  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8">
    <div className="flex items-center justify-center mb-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
      </motion.div>
    </div>
    <div className="space-y-4">
      <motion.div
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
        </motion.div>
        <span className="text-sm font-medium">分析标题关键词...</span>
      </motion.div>
      <motion.div
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 4 }}
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
        </motion.div>
        <span className="text-sm font-medium">提取 URL 特征...</span>
      </motion.div>
      <motion.div
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
        </motion.div>
        <span className="text-sm font-medium">生成智能分类...</span>
      </motion.div>
    </div>
  </div>
);

// 优化建议步骤的视觉组件
const SuggestionsStepVisual = () => (
  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 space-y-6">
    <motion.div
      className="bg-white border-2 border-green-300 rounded-lg p-6 shadow-sm"
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{
        scale: 1.02,
        boxShadow:
          '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
          高置信度
        </div>
        <span className="font-medium text-sm">GitHub - React</span>
      </div>
      <div className="text-sm text-gray-600 space-y-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          分类：未分类 →{' '}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <strong>开发工具</strong>
          </motion.span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          别名：
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <strong>gh-react</strong>
          </motion.span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          标签：前端、React、开源
        </motion.div>
      </div>
    </motion.div>
    <motion.div
      className="bg-white border-2 border-yellow-300 rounded-lg p-6 shadow-sm"
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
      whileHover={{
        scale: 1.02,
        boxShadow:
          '0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full">
          需确认
        </div>
        <span className="font-medium text-sm">Notion 学习笔记</span>
      </div>
      <div className="text-sm text-gray-600 space-y-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          分类：未分类 →{' '}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <strong>工作</strong>
          </motion.span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          标签：笔记、生产力
        </motion.div>
      </div>
    </motion.div>
  </div>
);

// 用户确认步骤的视觉组件
const ConfirmationStepVisual = () => (
  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
    <div className="text-center mb-6">
      <motion.div
        className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg mb-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{
          scale: 1.05,
          boxShadow:
            '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 3,
          }}
        >
          <CheckCircle className="w-6 h-6" />
        </motion.div>
        <span className="font-medium">一键采用全部高置信度建议</span>
      </motion.div>
    </div>
    <div className="grid grid-cols-3 gap-6 text-center">
      <motion.div
        className="bg-white rounded-lg p-6 border-2 border-green-200 shadow-sm"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3,
        }}
        whileHover={{
          scale: 1.1,
          boxShadow:
            '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
        }}
      >
        <motion.div
          className="text-3xl font-bold text-green-600 mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          85
        </motion.div>
        <div className="text-sm text-gray-600">已接受</div>
      </motion.div>
      <motion.div
        className="bg-white rounded-lg p-6 border-2 border-yellow-200 shadow-sm"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.6,
        }}
        whileHover={{
          scale: 1.1,
          boxShadow:
            '0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
        }}
      >
        <motion.div
          className="text-3xl font-bold text-yellow-600 mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          20
        </motion.div>
        <div className="text-sm text-gray-600">待确认</div>
      </motion.div>
      <motion.div
        className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.9,
        }}
        whileHover={{
          scale: 1.1,
          boxShadow:
            '0 10px 15px -3px rgba(107, 114, 128, 0.1), 0 4px 6px -2px rgba(107, 114, 128, 0.05)',
        }}
      >
        <motion.div
          className="text-3xl font-bold text-gray-600 mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          15
        </motion.div>
        <div className="text-sm text-gray-600">已忽略</div>
      </motion.div>
    </div>
  </div>
);

// 步骤数据 - 直接定义为常量，不需要 useMemo
const demoSteps = [
  {
    title: '步骤 1：导入书签',
    description:
      '通过 Chrome、Edge、Firefox 等浏览器同步或导入 HTML 文件获取书签数据',
    visual: <ImportStepVisual />,
  },
  {
    title: '步骤 2：AI 智能分析',
    description: 'AI 读取书签标题、URL、内容，理解其主题和分类',
    visual: <AnalysisStepVisual />,
  },
  {
    title: '步骤 3：生成优化建议',
    description: 'AI 为每个书签生成分类、别名、标签建议，并标注置信度',
    visual: <SuggestionsStepVisual />,
  },
  {
    title: '步骤 4：用户确认与应用',
    description: '您可以逐个确认或一键接受高置信度建议，完成书签优化',
    visual: <ConfirmationStepVisual />,
  },
];

const AIDemoPanel = React.memo(({ onClose }: AIDemoPanelProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  // 使用 useCallback 优化回调函数
  const handlePreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  AI 优化演示
                </h2>
                <p className="text-sm text-gray-600">
                  了解 AI 如何帮您智能整理书签
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: index <= currentStep ? 1 : 1,
                      opacity: 1,
                      boxShadow:
                        index === currentStep
                          ? '0 0 0 4px rgba(59, 130, 246, 0.2), 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)'
                          : index < currentStep
                            ? '0 0 0 2px rgba(59, 130, 246, 0.2)'
                            : 'none',
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: index * 0.2,
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {index < currentStep ? (
                      <motion.div
                        key={`check-${index}`}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  {index < demoSteps.length - 1 && (
                    <motion.div
                      className={`flex-1 h-1 mx-2 rounded ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{
                        scaleX: index < currentStep ? 1 : 0,
                        opacity: 1,
                        backgroundColor:
                          index < currentStep ? '#3b82f6' : '#e5e7eb',
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

          {/* Content - 使用 flex 布局自动调整高度，避免固定高度影响父组件 */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                layoutId="demoStepContent"
                className="flex-1 min-h-0"
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
                  transition={{
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="w-full"
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
                onClick={handlePreviousStep}
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
                  onClick={handleNextStep}
                  variant="primary"
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
});

AIDemoPanel.displayName = 'AIDemoPanel';

export default AIDemoPanel;
