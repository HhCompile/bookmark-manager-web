import { motion } from 'motion/react'
import { CheckCircle } from 'lucide-react'

interface DetailedFeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  items: string[]
  index: number
}

/**
 * 详细功能卡片组件
 * 用于功能详解区域，展示功能的详细信息和具体特性
 */
export default function DetailedFeatureCard({
  icon,
  title,
  description,
  items,
  index
}: DetailedFeatureCardProps) {
  const Icon = icon
  
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.05 }}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-blue-100"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg shrink-0">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="grid grid-cols-2 gap-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
