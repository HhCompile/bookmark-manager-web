import { useState } from 'react'
import { motion } from 'motion/react'
import { Target, FileText, CheckCircle } from 'lucide-react'
import CollapsiblePanel from './CollapsiblePanel'
import MoreFeatureCard from './MoreFeatureCard'
import ViewModeDemo from '../views/ViewModeDemo'

interface Feature {
  id: string
  icon: React.ElementType
  title: string
  description: string
  action: () => void
}

interface DetailedFeature {
  icon: React.ElementType
  title: string
  description: string
  items: string[]
}

interface FeaturesSectionProps {
  features: Feature[]
  detailedFeatures: DetailedFeature[]
}

/**
 * 功能展示区域组件
 * 包含功能详细介绍和更多功能两个模块
 */
export default function FeaturesSection({ features, detailedFeatures }: FeaturesSectionProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handlePanelHover = (panelId: string) => {
    setActivePanel(panelId);
  };

  const handlePanelLeave = () => {
    // 不立即关闭面板，保持展开状态
  };

  // 为每个面板创建对应的示例内容
  const getPanelContent = (title: string) => {
    switch (title) {
      case '双路同步机制':
        return (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">同步方式</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Chrome 浏览器同步</p>
                    <p className="text-xs text-gray-600">实时同步浏览器书签，支持双向数据同步</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">HTML 文件导入</p>
                    <p className="text-xs text-gray-600">支持从浏览器导出的 HTML 文件快速导入</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                双路同步机制确保您的书签数据在不同设备间保持一致，同时提供了灵活的数据迁移方案。
              </p>
            </div>
          </div>
        );
      case 'AI 智能分类':
        return (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">AI 功能演示</h4>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700">原始书签：</p>
                    <p className="text-sm bg-white p-2 rounded border border-gray-200">
                      GitHub - facebook/react: A declarative, efficient, and flexible JavaScript library for building user interfaces
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">AI 处理后：</p>
                    <p className="text-sm bg-white p-2 rounded border border-green-200">
                      <span className="text-green-600 font-medium">React</span> - JavaScript 前端库
                      <div className="mt-1 flex gap-1">
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">前端</span>
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">React</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">开源</span>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                AI 智能分类系统能够自动分析书签内容，提取关键词，生成别名，并为书签添加相关标签，大大提高书签管理的效率。
              </p>
            </div>
          </div>
        );
      case '三种视觉视图':
        return (
          <div>
            <ViewModeDemo showTitle={false} />
          </div>
        );
      case '全文搜索':
        return (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">搜索演示</h4>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索书签..."
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute left-2.5 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="font-medium text-sm">GitHub - React</p>
                    <p className="text-xs text-gray-600">https://github.com/facebook/react</p>
                    <div className="mt-1 flex gap-1">
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">前端</span>
                      <span className="px-1 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">React</span>
                    </div>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="font-medium text-sm">MDN Web Docs</p>
                    <p className="text-xs text-gray-600">https://developer.mozilla.org</p>
                    <div className="mt-1 flex gap-1">
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">文档</span>
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">前端</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                全文搜索功能支持搜索书签的标题、URL、标签和批注内容，帮助您快速找到所需的书签。
              </p>
            </div>
          </div>
        );
      case '阅读器与批注':
        return (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">阅读器演示</h4>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h5 className="font-medium text-sm">React 性能优化指南</h5>
                  <p className="text-xs text-gray-600">https://example.com/react-performance</p>
                </div>
                <div className="p-4">
                  <p className="text-sm mb-3">
                    React 是一个用于构建用户界面的 JavaScript 库。它由 Facebook 开发，现已成为前端开发中最流行的库之一。
                  </p>
                  <p className="text-sm mb-3 bg-yellow-50 p-2 border-l-4 border-yellow-400">
                    性能优化是 React 应用开发中的重要环节，合理的优化策略可以显著提升应用的用户体验。
                  </p>
                  <p className="text-sm">
                    常见的 React 性能优化技巧包括：使用 memo、useCallback、useMemo 等钩子，合理设计组件结构，避免不必要的渲染等。
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                阅读器与批注功能允许您在侧边栏中阅读网页内容，添加高亮和批注，方便您记录重要信息。
              </p>
            </div>
          </div>
        );
      case '质量监控':
        return (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">质量监控演示</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">GitHub - React</p>
                      <p className="text-xs text-gray-600">状态: 正常</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    健康
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Old Blog Site</p>
                      <p className="text-xs text-gray-600">状态: 失效</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                    失效
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                质量监控功能会定期检查书签的有效性，检测重复链接，并为您的书签库提供健康度评分，帮助您保持书签库的整洁和有效。
              </p>
            </div>
          </div>
        );
      case '隐私加密':
        return (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">隐私空间演示</h4>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm">私密学习库</p>
                      <p className="text-xs text-gray-600">已加密 • 需要密码访问</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <h5 className="font-medium text-sm mb-2">加密内容</h5>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>React 高级开发笔记</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>前端架构设计文档</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>面试准备资料</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                隐私加密功能为您的敏感书签提供端到端加密保护，确保只有您能够访问这些内容，为您的学习资料和私密信息提供安全的存储空间。
              </p>
            </div>
          </div>
        );
      case '数据可视化':
        return (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">数据可视化演示</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm text-center mb-2">书签分类统计</h5>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>前端开发</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>设计资源</span>
                          <span>28%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>学习资料</span>
                          <span>20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>其他</span>
                          <span>10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-gray-600 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm text-center mb-2">标签云</h5>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">React</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">前端</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">设计</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">JavaScript</span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">CSS</span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">API</span>
                      <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">UX</span>
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">Node.js</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">TypeScript</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                数据可视化功能通过标签云、分类统计和趋势分析等方式，帮助您洞察书签库的结构和使用情况，更好地管理您的知识体系。
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            暂无示例内容
          </div>
        );
    }
  };

  return (
    <>
      {/* 功能详细介绍模块 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          功能详解
        </h2>
        <p className="text-gray-600 mb-8">
          全面的书签管理解决方案，从导入到优化，从搜索到分析，一站式解决你的知识管理需求
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {detailedFeatures.map((feature, index) => (
            <CollapsiblePanel
              key={index}
              id={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              items={feature.items}
              content={getPanelContent(feature.title)}
              isActive={activePanel === feature.title}
              onHover={handlePanelHover}
              onLeave={handlePanelLeave}
            />
          ))}
        </div>

        {/* 视图模式演示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <ViewModeDemo />
        </motion.div>
      </motion.div>

      {/* 更多功能 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Target className="w-8 h-8 text-blue-600" />
          更多功能
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.slice(4).map((feature, index) => (
            <MoreFeatureCard
              key={feature.id}
              id={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              action={feature.action}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </>
  )
}
