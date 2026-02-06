import { motion } from 'motion/react'
import { Heart } from 'lucide-react'

/**
 * 使用提示组件
 * 用于展示系统使用的小贴士和建议
 */
export default function UsageTips() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl"
    >
      <div className="flex items-start gap-6">
        <div className="p-4 bg-white/20 rounded-xl shrink-0">
          <Heart className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-3">💡 使用小贴士</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-95">
            <div className="space-y-2">
              <p>✨ 导入书签后，使用 "AI 优化" 自动整理分类</p>
              <p>🔍 使用全文搜索功能，快速找到任何内容</p>
              <p>📊 查看数据分析，了解你的收藏习惯</p>
            </div>
            <div className="space-y-2">
              <p>🔒 使用隐私空间保护重要的学习资料</p>
              <p>🎯 定期运行质量监控，保持书签库健康</p>
              <p>📝 利用阅读器功能添加批注和笔记</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
