import { motion, MotionProps } from 'motion/react'
import { useMemo } from 'react'


interface StatsCardProps extends Omit<MotionProps, 'children'> {
  value: number | string
  label: string
  subtitle?: React.ReactNode
  className?: string
  valueClassName?: string
  labelClassName?: string
  subtitleClassName?: string
  testId?: string
}

/**
 * 统计数据卡片组件
 * 用于显示各种统计数据，如总整理次数、本周整理人数等
 * 支持自定义样式、动画效果和可访问性配置
 */
export default function StatsCard({
  value,
  label,
  subtitle,
  className = '',
  valueClassName = '',
  labelClassName = '',
  subtitleClassName = '',
  testId = 'stats-card',
  whileHover = { scale: 1.05 },
  ...motionProps
}: StatsCardProps) {
  // 优化动画配置，确保流畅的过渡效果
  const animationConfig = useMemo(() => ({
    whileHover: {
      scale: 1.05,
      y: -5,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    whileTap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    },
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }), [])
  
  return (
    <motion.div
      {...animationConfig}
      {...motionProps}
      className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 ${className}`}
      data-testid={testId}
      role="group"
      aria-label={`${label}: ${value}`}
    >
      <motion.div 
        className={`text-4xl font-bold mb-2 ${valueClassName}`}
        whileHover={{ scale: 1.1 }}
      >
        {value}
      </motion.div>
      <motion.div 
        className={`text-sm text-gray-600 ${labelClassName}`}
        whileHover={{ x: 2 }}
      >
        {label}
      </motion.div>
      {subtitle && (
        <motion.div 
          className={`flex items-center justify-center gap-1 text-sm mt-1 ${subtitleClassName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.div>
      )}
    </motion.div>
  )
}
