import { Search, Upload, RefreshCw, Brain } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from './Footer';

/**
 * 仪表盘布局组件
 * 包含左侧导航、主内容区和右侧信息面板
 */
export default function DashboardLayout() {
  // navigate 暂不使用，先移除以避免 lint 警告
  // const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 从localStorage加载主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // 主题变化时保存到localStorage并应用到文档
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-surface border-b border-border sticky top-0 z-30 shadow-sm transition-all">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-lg font-semibold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent"
            >
              智能书签管理
            </Link>
          </div>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-text-tertiary" />
            </div>
            <input
              type="text"
              placeholder="搜索书签内容、标题、标签..."
              className="w-full pl-9 pr-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all bg-surface hover:border-border-hover"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-medium shadow-sm hover:shadow-md">
              <Upload className="w-4 h-4" />
              导入HTML
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all text-sm font-medium shadow-sm hover:shadow-md">
              <RefreshCw className="w-4 h-4" />
              Chrome同步
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium shadow-sm hover:shadow-md">
              <Brain className="w-4 h-4" />
              AI优化
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* 公共底部 */}
      <Footer />
    </div>
  );
}
