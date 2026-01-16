import {
  Chromium,
  Upload,
  Brain,
  Bookmark,
  Sparkles,
  Zap,
  Target,
  Shield,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * 应用主页
 * 展示核心功能和统计信息
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // 模拟统计数据
  const stats = {
    totalBookmarks: 3,
    thisWeekAdded: 0,
    smartCategories: 4,
  };

  // 快速开始功能卡片数据
  const quickStartCards = [
    {
      id: 'sync',
      title: 'Chrome同步',
      description: '实时同步浏览器书签，支持双向数据同步',
      icon: Chromium,
      action: () => navigate('/sync'),
      color: 'blue',
    },
    {
      id: 'upload',
      title: 'HTML导入',
      description: '支持从浏览器导出的HTML文件快速导入',
      icon: Upload,
      action: () => navigate('/upload'),
      color: 'green',
    },
    {
      id: 'ai',
      title: 'AI智能优化',
      description: '自动分类、生成别名、提取标签',
      icon: Brain,
      action: () => navigate('/ai-optimize'),
      color: 'purple',
    },
    {
      id: 'bookmarks',
      title: '书签管理',
      description: '三种视图模式、全文搜索、批注高亮',
      icon: Bookmark,
      action: () => navigate('/bookmarks'),
      color: 'orange',
    },
  ];

  // 更多功能数据
  const moreFeatures = [
    {
      id: 'analytics',
      title: '数据分析',
      description: '可视化标签云、分类统计、使用洞察',
      icon: TrendingUp,
      action: () => navigate('/analytics'),
    },
    {
      id: 'quality',
      title: '质量监控',
      description: '检测重复链接、失效书签、健康度评分',
      icon: Target,
      action: () => navigate('/quality'),
    },
    {
      id: 'private',
      title: '隐私空间',
      description: '加密保护敏感书签，安全存储学习笔记',
      icon: Shield,
      action: () => navigate('/private'),
    },
  ];

  // 获取颜色类
  const getColorClass = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      purple: 'from-purple-500 to-pink-500',
      orange: 'from-orange-500 to-amber-500',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10" />

        <div className="relative px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-6"
              >
                <Sparkles className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  AI 驱动的智能书签管理
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                智能书签管理系统
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                让 AI 帮你整理、分类、优化每一个收藏
                <br />
                打造属于你的知识图谱，让信息触手可及
              </p>

              {/* 统计数据 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stats.totalBookmarks}
                  </div>
                  <div className="text-sm text-gray-600">总书签数</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
                >
                  <div className="text-4xl font-bold text-cyan-600 mb-2">
                    {stats.thisWeekAdded}
                  </div>
                  <div className="text-sm text-gray-600">本周新增</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
                >
                  <div className="text-4xl font-bold text-sky-600 mb-2">
                    {stats.smartCategories}
                  </div>
                  <div className="text-sm text-gray-600">智能分类</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* 快速开始区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            快速开始
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStartCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  onHoverStart={() => setHoveredCard(card.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  onClick={card.action}
                  className="relative group cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100">
                    <div
                      className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${getColorClass(card.color)} mb-3`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {card.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3">
                      {card.description}
                    </p>

                    <div
                      className={`flex items-center gap-2 text-sm font-medium transition-all ${hoveredCard === card.id ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      开始使用
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${hoveredCard === card.id ? 'translate-x-1' : ''}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 更多功能 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            更多功能
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={feature.action}
                  className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all cursor-pointer border border-blue-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
