import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

interface MoreFeatureCardProps {
  id: string
  icon: React.ElementType
  title: string
  description: string
  action: () => void
  index: number
}

/**
 * 更多功能卡片组件
 * 用于更多功能区域，展示额外的功能选项
 */
export default function MoreFeatureCard({
  id,
  icon,
  title,
  description,
  action,
  index
}: MoreFeatureCardProps) {
  const Icon = icon
  
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      onClick={action}
      className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all cursor-pointer border border-blue-100"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </motion.div>
  )
}
