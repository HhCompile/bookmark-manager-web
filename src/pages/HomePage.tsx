/**
 * 首页组件
 * 展示书签管理系统的欢迎界面、数据概览和快捷入口
 * 采用玻璃拟态风格设计，现代简约UI
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, TrendingUp, Zap, Folder, Tag, Plus, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* 动态背景效果 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1) 0 0%, transparent 50%),
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.05) 0 0%, transparent 70%)
          `
        }}
        onMouseMove={handleMouseMove}
      />

      {/* 主内容区域 */}
      <div className="relative z-10">
        {/* Hero区域 */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                智能书签
                <span className="inline-block text-transparent bg-clip-text text-gradient-to-r from-yellow-200 to-orange-400">
                  管理
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                让您的Chrome书签变得井井有条，一键导入、智能分类、自动打标
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-start sm:items-center">
                <Link
                  to="/upload"
                  className="group/btn relative"
                >
                  <button
                    className="px-8 py-4 bg-white/20 backdrop-blur-xl rounded-2xl text-gray-800 shadow-2xl hover:bg-white/30 hover:shadow-3xl transition-all duration-300"
                  >
                    <Plus className="w-6 h-6 text-blue-600 mb-3" />
                    <span className="text-lg font-semibold">开始整理</span>
                    <span className="block text-sm text-gray-600 mt-1">导入书签文件</span>
                    <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </div>
                  </button>
                </Link>

                <Link
                  to="/bookmarks"
                  className="group/btn relative"
                >
                  <button
                    className="px-8 py-4 bg-white/20 backdrop-blur-xl rounded-2xl text-gray-800 shadow-2xl hover:bg-white/30 hover:shadow-3xl transition-all duration-300"
                  >
                    <Folder className="w-6 h-6 text-purple-600 mb-3" />
                    <span className="text-lg font-semibold">浏览书签</span>
                    <span className="block text-sm text-gray-600 mt-1">查看所有收藏</span>
                    <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-purple-600" />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 数据统计区域 */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">数据概览</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* 总书签卡片 */}
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl hover:shadow-3xl hover:border-blue-300/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-gray-900">1,234</p>
                      <p className="text-sm text-gray-600">总书签</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">+156</p>
                      <p className="text-sm text-gray-600">本周新增</p>
                    </div>
                  </div>
                </div>

                {/* 分类数量卡片 */}
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl hover:shadow-3xl hover:border-purple-300/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                      <Folder className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-gray-900">12</p>
                      <p className="text-sm text-gray-600">分类数量</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">3</p>
                      <p className="text-sm text-gray-600">本周新增</p>
                    </div>
                  </div>
                </div>

                {/* 标签数量卡片 */}
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl hover:shadow-3xl hover:border-orange-300/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                      <Tag className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-gray-900">247</p>
                      <p className="text-sm text-gray-600">标签总数</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">+89</p>
                      <p className="text-sm text-gray-600">本周新增</p>
                    </div>
                  </div>
                </div>

                {/* 有效链接卡片 */}
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl hover:shadow-3xl hover:border-green-300/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-gray-900">1,189</p>
                      <p className="text-sm text-gray-600">有效链接</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-green-700">96.3%</span>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">健康度</p>
                      <p className="text-sm text-gray-600">链接有效性</p>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </section>

        {/* 快捷入口区域 */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              快捷操作
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 验证链接 */}
              <Link
                to="/duplicates"
                className="group/btn"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group/btn hover:scale-[1.02]">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">验证链接</h3>
                    <p className="text-white/90">验证书签的有效性，自动清理失效链接</p>
                  </div>
                  <div className="absolute -right-4 top-4 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>

              {/* 导出书签 */}
              <Link
                to="/settings"
                className="group/btn"
              >
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group/btn hover:scale-[1.02]">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">导出书签</h3>
                    <p className="text-white/90">导出为HTML、JSON或CSV格式</p>
                  </div>
                  <div className="absolute -right-4 top-4 w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>

              {/* 设置 */}
              <Link
                to="/settings"
                className="group/btn"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group/btn hover:scale-[1.02]">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">个性化设置</h3>
                    <p className="text-white/90">主题、通知、导出等偏好设置</p>
                  </div>
                  <div className="absolute -right-4 top-4 w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA区域 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div>
              <p className="text-xl text-white mb-4">准备好开始了吗？              </p>
              <Link
                to="/upload"
                className="inline-block px-10 py-4 bg-white text-gray-800 rounded-xl text-lg font-semibold shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300"
              >
                立即上传书签
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
