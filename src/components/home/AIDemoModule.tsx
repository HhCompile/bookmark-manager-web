import { motion } from 'motion/react'
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react'
import CustomButton from '../ui/custom-button'
import { useState } from 'react'

interface AIDemoModuleProps {
  onShowDemo: () => void
  onShowRegularDemo?: () => void
}

/**
 * AI 演示模块组件
 * 用于展示 AI 智能优化功能的演示入口
 */
export default function AIDemoModule({ onShowDemo, onShowRegularDemo }: AIDemoModuleProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-16"
    >
      <motion.div 
        className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 shadow-md border-2 border-blue-200"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "spring", delay: 0.2 }}
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)" }}
        onHoverStart={() => setIsVisible(true)}
      >
        <div className="flex items-start gap-6">
          {/* 图标区域 */}
          <motion.div 
            className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shrink-0"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "spring", delay: 0.4 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse"
              }}
            >
              <Lightbulb className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            {/* 标题 */}
            <motion.h3 
              className="text-2xl font-bold text-gray-900 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              🎯 AI 智能辅助修整书签内容
            </motion.h3>
            
            {/* 描述 */}
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              通过 AI 技术，自动识别书签内容，智能提取关键信息，生成精准标签和分类，帮您快速整理和查找书签，让知识管理更加高效。
            </motion.p>
            
            {/* 功能特点 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>智能内容识别与摘要</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>自动标签提取与分类</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>智能别名生成</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>重复内容检测</span>
              </div>
            </div>
            
            {/* 按钮 - 初始隐藏，hover时显示 */}
            {isVisible && (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CustomButton
                    onClick={onShowDemo}
                    variant="primary"
                    size="md"
                    icon={<Sparkles className="w-5 h-5" />}
                    endIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    查看 AI 优化演示
                  </CustomButton>
                </motion.div>
                
                {onShowRegularDemo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <CustomButton
                      onClick={onShowRegularDemo}
                      variant="secondary"
                      size="md"
                      icon={<Lightbulb className="w-5 h-5" />}
                      endIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      查看常规功能演示
                    </CustomButton>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
