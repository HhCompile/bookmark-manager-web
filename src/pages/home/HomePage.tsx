import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

// 导入拆分的组件
import HeroSection from '../../components/home/HeroSection';
import FeatureCard from '../../components/home/FeatureCard';
import AIDemoModule from '../../components/home/AIDemoModule';
import UsageTips from '../../components/home/UsageTips';
import FeaturesSection from '../../components/home/FeaturesSection';
import { mockStats } from '../../mocks/data';
import type { DetailedFeature } from '../../components/home/FeaturesSection';

interface HomePageProps {
  onNavigate?: (tab: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [showRegularDemo, setShowRegularDemo] = useState(false);

  // 统计数据从 mock 数据获取
  const { totalBookmarks: totalOrganizations, weeklyUsers, aiClassifications } = mockStats;
  const avgPerUser = Math.round(aiClassifications / weeklyUsers);

  // 功能数据
  const features = [
    {
      id: 'sync',
      icon: RefreshCw,
      title: t('home.quickStart.features.sync.title'),
      description: t('home.quickStart.features.sync.desc'),
      action: () => onNavigate?.('sync'),
    },
    {
      id: 'upload',
      icon: Upload,
      title: t('home.quickStart.features.upload.title'),
      description: t('home.quickStart.features.upload.desc'),
      action: () => onNavigate?.('upload'),
    },
    {
      id: 'ai',
      icon: Sparkles,
      title: t('home.quickStart.features.ai.title'),
      description: t('home.quickStart.features.ai.desc'),
      action: () => setShowAIDemo(true),
    },
    {
      id: 'bookmarks',
      icon: Layout,
      title: t('home.quickStart.features.bookmarks.title'),
      description: t('home.quickStart.features.bookmarks.desc'),
      action: () => window.location.href = '/app/bookmarks',
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      title: t('home.quickStart.features.analytics.title'),
      description: t('home.quickStart.features.analytics.desc'),
      action: () => window.location.href = '/app/analytics',
    },
    {
      id: 'quality',
      icon: Target,
      title: t('home.quickStart.features.quality.title'),
      description: t('home.quickStart.features.quality.desc'),
      action: () => window.location.href = '/app/quality',
    },
    {
      id: 'private',
      icon: Shield,
      title: t('home.quickStart.features.private.title'),
      description: t('home.quickStart.features.private.desc'),
      action: () => window.location.href = '/app/private',
    },
  ];

  // 详细功能数据
  const detailedFeatures: DetailedFeature[] = [
    {
      icon: RefreshCw,
      title: t('home.detailedFeatures.items.sync.title'),
      description: t('home.detailedFeatures.items.sync.desc'),
      items: t('home.detailedFeatures.items.sync.features', { returnObjects: true }) as string[],
    },
    {
      icon: Brain,
      title: t('home.detailedFeatures.items.ai.title'),
      description: t('home.detailedFeatures.items.ai.desc'),
      items: t('home.detailedFeatures.items.ai.features', { returnObjects: true }) as string[],
    },
    {
      icon: Layout,
      title: t('home.detailedFeatures.items.views.title'),
      description: t('home.detailedFeatures.items.views.desc'),
      items: t('home.detailedFeatures.items.views.features', { returnObjects: true }) as string[],
    },
    {
      icon: Search,
      title: t('home.detailedFeatures.items.search.title'),
      description: t('home.detailedFeatures.items.search.desc'),
      items: t('home.detailedFeatures.items.search.features', { returnObjects: true }) as string[],
    },
    {
      icon: BookOpen,
      title: t('home.detailedFeatures.items.reader.title'),
      description: t('home.detailedFeatures.items.reader.desc'),
      items: t('home.detailedFeatures.items.reader.features', { returnObjects: true }) as string[],
    },
    {
      icon: Target,
      title: t('home.detailedFeatures.items.quality.title'),
      description: t('home.detailedFeatures.items.quality.desc'),
      items: t('home.detailedFeatures.items.quality.features', { returnObjects: true }) as string[],
    },
    {
      icon: Shield,
      title: t('home.detailedFeatures.items.privacy.title'),
      description: t('home.detailedFeatures.items.privacy.desc'),
      items: t('home.detailedFeatures.items.privacy.features', { returnObjects: true }) as string[],
    },
    {
      icon: BarChart,
      title: t('home.detailedFeatures.items.analytics.title'),
      description: t('home.detailedFeatures.items.analytics.desc'),
      items: t('home.detailedFeatures.items.analytics.features', { returnObjects: true }) as string[],
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
            {t('home.quickStart.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.slice(0, 4).map((feature) => (
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
