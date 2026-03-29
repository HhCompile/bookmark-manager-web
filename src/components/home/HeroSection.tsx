import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BackgroundAnimation from '../../common/BackgroundAnimation';
import StatsCard from './StatsCard';

interface HeroSectionProps {
  totalOrganizations: number;
  weeklyUsers: number;
  aiClassifications: number;
  avgPerUser: number;
}

/**
 * 首页英雄区域组件
 * 包含背景动画、标题、描述和统计数据
 */
export default function HeroSection({
  totalOrganizations,
  weeklyUsers,
  aiClassifications,
  avgPerUser,
}: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden">
      {/* 背景动画 */}
      <BackgroundAnimation />

      <div className="relative px-6 py-12 sm:py-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {t('home.hero.badge')}
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t('home.hero.title')}
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              {t('home.hero.subtitle')}
              <br />
              {t('home.hero.subtitle2')}
            </p>

            {/* 统计数据 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <StatsCard
                value={totalOrganizations}
                label={t('home.stats.totalOrganizations')}
                valueClassName="text-blue-600"
              />
              <StatsCard
                value={weeklyUsers}
                label={t('home.stats.weeklyUsers')}
                valueClassName="text-cyan-600"
              />
              <StatsCard
                value={aiClassifications}
                label={t('home.stats.aiClassifications')}
                valueClassName="text-sky-600"
                subtitle={
                  <>
                    <span className="text-gray-500">{t('home.stats.avgPerUser')}</span>
                    <span className="font-bold text-sky-700">{avgPerUser}</span>
                    <span className="text-gray-500">{t('common.times')}</span>
                  </>
                }
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
