import {
  Sparkles,
  Upload,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Shield,
  Layout,
  Search,
  Zap,
  Target,
  Brain,
  BarChart,
} from 'lucide-react';
import AIDemoPanel from '../../common/AIDemoPanel';
import RegularDemoPanel from '../../common/RegularDemoPanel';
import { motion } from 'motion/react';
import { useState } from 'react';

// 导入拆分的组件
import HeroSection from '../../components/home/HeroSection';
import FeatureCard from '../../components/home/FeatureCard';
import AIDemoModule from '../../components/home/AIDemoModule';
import UsageTips from '../../components/home/UsageTips';
import FeaturesSection from '../../components/home/FeaturesSection';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onSync: () => void;
  onAIOptimize: () => void;
  onFileUpload: () => void;
}

export default function HomePage({
  onNavigate,
  onSync,
  onAIOptimize,
  onFileUpload,
}: HomePageProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [showRegularDemo, setShowRegularDemo] = useState(false);

  // 统计数据 - 使用演示数据
  const totalOrganizations = 1247; // 整理次数
  const weeklyUsers = 389; // 本周整理人数
  const aiClassifications = 5621; // AI智能分类次数
  const avgPerUser = Math.round(aiClassifications / weeklyUsers); // 人均分类次数

  // 功能数据
  const features = [
    {
      id: 'sync',
      icon: RefreshCw,
      title: 'Chrome 同步',
      description: '实时同步浏览器书签，支持双向数据同步',
      action: onSync,
    },
    {
      id: 'upload',
      icon: Upload,
      title: 'HTML 导入',
      description: '支持从浏览器导出的 HTML 文件快速导入',
      action: onFileUpload,
    },
    {
      id: 'ai',
      icon: Sparkles,
      title: 'AI 智能优化',
      description: '自动分类、生成别名、提取标签',
      action: onAIOptimize,
    },
    {
      id: 'bookmarks',
      icon: Layout,
      title: '书签管理',
      description: '三种视图模式、全文搜索、批注高亮',
      action: () => onNavigate('bookmarks'),
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      title: '数据分析',
      description: '可视化标签云、分类统计、使用洞察',
      action: () => onNavigate('analytics'),
    },
    {
      id: 'quality',
      icon: Target,
      title: '质量监控',
      description: '检测重复链接、失效书签、健康度评分',
      action: () => onNavigate('quality'),
    },
    {
      id: 'private',
      icon: Shield,
      title: '隐私空间',
      description: '加密保护敏感书签，安全存储学习笔记',
      action: () => onNavigate('private'),
    },
  ];

  // 详细功能数据
  const detailedFeatures = [
    {
      icon: RefreshCw,
      title: '双路同步机制',
      description:
        'Chrome API 直连同步与 HTML 文件导入双通道，灵活应对各种场景',
      items: [
        '实时浏览器同步',
        'HTML 批量导入',
        '增量更新支持',
        '冲突智能处理',
      ],
    },
    {
      icon: Brain,
      title: 'AI 智能分类',
      description: '基于内容理解的智能分类系统，自动为书签打标签和分组',
      items: ['内容智能分析', '自动标签提取', '别名生成', '红绿灯决策系统'],
    },
    {
      icon: Layout,
      title: '三种视觉视图',
      description: '列表、卡片、树状三种视图模式，适配不同使用场景',
      items: ['列表视图', '卡片视图', '树状层级视图', '自由切换'],
    },
    {
      icon: Search,
      title: '全文搜索',
      description: '强大的搜索引擎，支持标题、URL、标签、批注内容全文搜索',
      items: ['标题搜索', 'URL 检索', '标签筛选', '批注内容搜索'],
    },
    {
      icon: BookOpen,
      title: '阅读器与批注',
      description: '侧边栏阅读模式，支持文本高亮、批注、笔记功能',
      items: ['侧边栏阅读', '文本高亮', '添加批注', '导出笔记'],
    },
    {
      icon: Target,
      title: '质量监控',
      description: '自动化质量检测，保持书签库健康度',
      items: ['重复检测', '失效链接巡检', '健康度评分', '定期报告'],
    },
    {
      icon: Shield,
      title: '隐私加密',
      description: '独立加密空间，保护敏感信息和学习资料',
      items: ['端到端加密', '密码保护', '隐私标签', '安全备份'],
    },
    {
      icon: BarChart,
      title: '数据可视化',
      description: '标签云、使用统计、趋势分析，洞察你的知识结构',
      items: ['标签云可视化', '分类统计', '使用趋势', '热力图分析'],
    },
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* 英雄区域 */}
      <HeroSection
        totalOrganizations={totalOrganizations}
        weeklyUsers={weeklyUsers}
        aiClassifications={aiClassifications}
        avgPerUser={avgPerUser}
      />

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* 快速开始区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 mt-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            快速开始
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.slice(0, 4).map((feature, index) => (
              <FeatureCard
                key={feature.id}
                id={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                action={feature.action}
                hoveredCard={hoveredCard}
                onHoverStart={setHoveredCard}
                onHoverEnd={() => setHoveredCard(null)}
              />
            ))}
          </div>
        </motion.div>

        {/* AI 演示模块 */}
        <AIDemoModule
          onShowDemo={() => setShowAIDemo(true)}
          onShowRegularDemo={() => setShowRegularDemo(true)}
        />

        {/* 功能展示区域 */}
        <FeaturesSection
          features={features}
          detailedFeatures={detailedFeatures}
        />

        {/* 使用提示 */}
        <UsageTips />
      </div>

      {/* AI Demo Panel */}
      {showAIDemo && <AIDemoPanel onClose={() => setShowAIDemo(false)} />}

      {/* Regular Demo Panel */}
      {showRegularDemo && (
        <RegularDemoPanel onClose={() => setShowRegularDemo(false)} />
      )}
    </div>
  );
}
