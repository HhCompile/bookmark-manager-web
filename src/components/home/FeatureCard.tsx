import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'

interface FeatureCardProps {
  id: string
  icon: React.ElementType
  title: string
  description: string
  action: () => void
  hoveredCard: string | null
  onHoverStart: (id: string) => void
  onHoverEnd: () => void
}

/**
 * 功能卡片组件
 * 用于快速开始区域，展示主要功能入口
 */
export default function FeatureCard({
  id,
  icon,
  title,
  description,
  action,
  hoveredCard,
  onHoverStart,
  onHoverEnd
}: FeatureCardProps) {
  const Icon = icon
  
  // 优化回调函数，避免不必要的重新渲染
  const handleHoverStart = useCallback(() => {
    onHoverStart(id)
  }, [id, onHoverStart])
  
  const handleClick = useCallback(() => {
    action()
  }, [action])
  
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={handleClick}
      className="relative group cursor-pointer"
    >
      <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 h-full flex flex-col">
        <motion.div 
          className="inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 mb-3"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>

        <motion.h3 
          className="text-lg font-bold text-gray-900 mb-1"
          whileHover={{ x: 5 }}
        >
          {title}
        </motion.h3>

        <p className="text-sm text-gray-600 mb-4 flex-1">{description}</p>

        <motion.div
          className={`flex items-center gap-2 text-sm font-medium transition-all ${
            hoveredCard === id ? 'text-blue-600' : 'text-gray-400'
          }`}
          whileHover={{ x: 3 }}
        >
          开始使用
          <motion.div
            animate={{ 
              x: hoveredCard === id ? 4 : 0 
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* 悬停时的光晕效果 */}
      {hoveredCard === id && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-xl bg-blue-500 filter blur-xl pointer-events-none"
        />
      )}
    </motion.div>
  )
}
