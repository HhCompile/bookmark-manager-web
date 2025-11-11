import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { Search, Folder, Tag } from 'lucide-react'

// 创建一个包含公共布局的根路由组件
export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        {/* 左侧导航和筛选面板 */}
        <nav className="w-64 bg-surface p-5 border-r border-border hidden lg:block shadow-sm">
          <div className="space-y-8">
            {/* 搜索框 */}
            <div>
              <label className="block text-xs font-medium text-text-gray mb-2">搜索书签</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-text-light" />
                </div>
                <input
                  type="text"
                  placeholder="搜索标题或URL..."
                  className="w-full pl-9 pr-3 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors bg-white focus:outline-none shadow-sm hover:shadow-sm"
                />
              </div>
            </div>
            
            {/* 分类筛选 */}
            <div>
              <h3 className="text-sm font-semibold text-text-dark mb-3 flex items-center">
                <Folder className="w-4 h-4 mr-2 text-primary" />
                分类
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <a href="#" className="block px-3.5 py-2.5 text-sm rounded-lg text-primary bg-blue-50 border-l-3 border-primary transition-colors hover:bg-blue-100 font-medium">全部分类</a>
                </li>
                <li>
                  <a href="#" className="block px-3.5 py-2.5 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors hover:text-primary">技术</a>
                </li>
                <li>
                  <a href="#" className="block px-3.5 py-2.5 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors hover:text-primary">新闻</a>
                </li>
                <li>
                  <a href="#" className="block px-3.5 py-2.5 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors hover:text-primary">娱乐</a>
                </li>
                <li>
                  <a href="#" className="block px-3.5 py-2.5 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors hover:text-primary">学习</a>
                </li>
                <li>
                  <a href="#" className="block px-3.5 py-2.5 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors hover:text-primary">生活</a>
                </li>
              </ul>
            </div>
            
            {/* 标签筛选 */}
            <div>
              <h3 className="text-sm font-semibold text-text-dark mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-primary" />
                常用标签
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer font-medium">编程</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer font-medium">教程</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer font-medium">文档</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer font-medium">工具</span>
              </div>
            </div>
          </div>
        </nav>
        
        {/* 主内容区 */}
        <main className="flex-1 p-4 sm:p-5 md:p-6">
          <Outlet />
        </main>
        
        {/* 右侧信息面板 */}
        <aside className="w-64 bg-surface p-5 border-l border-border hidden xl:block shadow-sm">
          <div className="space-y-7">
            <div className="card p-5 rounded-xl border border-border shadow-sm bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-h3 text-text-dark mb-4 font-semibold">统计信息</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-body text-text-gray">总书签数</span>
                  <span className="font-bold text-text-dark text-lg">128</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-body text-text-gray">分类数</span>
                  <span className="font-bold text-text-dark text-lg">12</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-body text-text-gray">标签数</span>
                  <span className="font-bold text-text-dark text-lg">24</span>
                </div>
              </div>
            </div>
            
            <div className="card p-5 rounded-xl border border-border shadow-sm bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-h3 text-text-dark mb-4 font-semibold">最近添加</h3>
              <ul className="space-y-4">
                <li className="text-body pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <a href="#" className="text-primary hover:underline truncate block transition-colors font-medium">React官方文档</a>
                  <span className="text-text-gray text-caption">2小时前</span>
                </li>
                <li className="text-body pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <a href="#" className="text-primary hover:underline truncate block transition-colors font-medium">JavaScript高级程序设计</a>
                  <span className="text-text-gray text-caption">5小时前</span>
                </li>
                <li className="text-body pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <a href="#" className="text-primary hover:underline truncate block transition-colors font-medium">Vue.js实战指南</a>
                  <span className="text-text-gray text-caption">1天前</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  )
}