import { motion } from 'motion/react'

interface BackgroundAnimationProps {
  particleCount?: number
  particleColor?: string
  gradientColors?: string
}

export default function BackgroundAnimation({
  particleCount = 30,
  particleColor = 'bg-blue-400/20',
  gradientColors = 'from-blue-400/10 via-cyan-300/5 to-blue-500/10'
}: BackgroundAnimationProps) {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* 渐变流动背景 */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${gradientColors}`}
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* 背景粒子效果 */}
      {Array.from({ length: particleCount }).map((_, index) => {
        // 预计算随机值，确保每次渲染都有确定的值
        const size = Math.random() * 10 + 2
        const initialX = Math.random() * 100
        const initialY = Math.random() * 100
        const targetX1 = Math.random() * 100
        const targetY1 = Math.random() * 100
        const targetX2 = Math.random() * 100
        const targetY2 = Math.random() * 100
        const initialOpacity = Math.random() * 0.5 + 0.2
        const targetOpacity1 = Math.random() * 0.3 + 0.1
        const targetOpacity2 = Math.random() * 0.5 + 0.2
        const duration = Math.random() * 20 + 10

        return (
          <motion.div
            key={index}
            className={`absolute rounded-full ${particleColor}`}
            style={{
              width: size,
              height: size,
              left: initialX + '%',
              top: initialY + '%'
            }}
            initial={{ opacity: initialOpacity }}
            animate={{
              left: [initialX + '%', targetX1 + '%', targetX2 + '%'],
              top: [initialY + '%', targetY1 + '%', targetY2 + '%'],
              opacity: [initialOpacity, targetOpacity1, targetOpacity2]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          />
        )
      })}
    </div>
  )
}
