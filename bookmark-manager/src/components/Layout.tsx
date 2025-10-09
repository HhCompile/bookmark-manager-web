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
        <nav className="w-60 bg-surface p-5 border-r border-border hidden lg:block shadow-sm">
          <div className="space-y-7">
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
                  className="w-full pl-9 pr-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors bg-white"
                />
              </div>
            </div>
            
            {/* 分类筛选 */}
            <div>
              <h3 className="text-xs font-semibold text-text-dark mb-3 flex items-center">
                <Folder className="w-4 h-4 mr-2" />
                分类
              </h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="block px-3 py-2 text-sm rounded-lg text-primary bg-blue-50 border-l-3 border-primary transition-colors">全部分类</a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors">技术</a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors">新闻</a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors">娱乐</a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors">学习</a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 text-sm rounded-lg text-text-gray hover:bg-blue-50 transition-colors">生活</a>
                </li>
              </ul>
            </div>
            
            {/* 标签筛选 */}
            <div>
              <h3 className="text-xs font-semibold text-text-dark mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                常用标签
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer">编程</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer">教程</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer">文档</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer">工具</span>
              </div>
            </div>
          </div>
        </nav>
        
        {/* 主内容区 */}
        <main className="flex-1 p-5 sm:p-6">
          <Outlet />
        </main>
        
        {/* 右侧信息面板 */}
        <aside className="w-64 bg-surface p-5 border-l border-border hidden xl:block shadow-sm">
          <div className="space-y-7">
            <div className="card p-4">
              <h3 className="text-h3 text-text-dark mb-4">统计信息</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-body text-text-gray">总书签数</span>
                  <span className="font-medium text-text-dark">128</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body text-text-gray">分类数</span>
                  <span className="font-medium text-text-dark">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body text-text-gray">标签数</span>
                  <span className="font-medium text-text-dark">24</span>
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <h3 className="text-h3 text-text-dark mb-4">最近添加</h3>
              <ul className="space-y-3">
                <li className="text-body">
                  <a href="#" className="text-primary hover:underline truncate block transition-colors">React官方文档</a>
                  <span className="text-text-gray text-caption">2小时前</span>
                </li>
                <li className="text-body">
                  <a href="#" className="text-primary hover:underline truncate block transition-colors">JavaScript高级程序设计</a>
                  <span className="text-text-gray text-caption">5小时前</span>
                </li>
                <li className="text-body">
                  <a href="#" className="text-primary hover:underline truncate block transition-colors">Vue.js实战指南</a>
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