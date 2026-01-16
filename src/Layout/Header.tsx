import {
  Bookmark,
  Settings,
  Search,
  RefreshCw,
  BrainCircuit,
  Upload,
  Menu,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

// 页头组件 - 实现响应式导航菜单和搜索功能
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // 导航菜单项
  const navItems = [
    { label: '首页', path: '/' },
    { label: '书签管理', path: '/bookmarks' },
    { label: '数据分析', path: '/analytics' },
    { label: '质量监控', path: '/quality' },
    { label: '隐私空间', path: '/private' },
  ];

  // 操作按钮项
  const actionItems = [
    { icon: <RefreshCw className="w-5 h-5" />, label: '同步' },
    { icon: <BrainCircuit className="w-5 h-5" />, label: 'AI优化' },
    { icon: <Upload className="w-5 h-5" />, label: '上传' },
    { icon: <Settings className="w-5 h-5" />, label: '设置' },
  ];

  return (
    // 粘性布局的页头容器，使用白色背景和阴影效果
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* 左侧：Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Bookmark className="w-7 h-7 text-blue-500 mr-2" />
              <h1 className="text-xl font-bold text-primary">书签管理器</h1>
            </Link>
          </div>

          {/* 中间：导航菜单（大屏幕可见） */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`h-10 px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 右侧：搜索框和操作按钮 */}
          <div className="flex items-center space-x-3">
            {/* 搜索框 */}
            <div className="hidden md:flex items-center bg-gray-100 hover:bg-white rounded-md px-4 py-2 transition-colors shadow-sm">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="搜索书签..."
                className="bg-transparent border-none outline-none text-sm text-gray-900"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-2">
              {actionItems.map((item, index) => (
                <button
                  key={index}
                  className="h-10 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>

            {/* 小屏幕菜单按钮 */}
            <button
              className="md:hidden h-10 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 小屏幕导航菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 小屏幕搜索框 */}
          <div className="px-4 pb-4">
            <div className="flex items-center bg-gray-100 rounded-md px-4 py-2">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="搜索书签..."
                className="bg-transparent border-none outline-none text-sm text-gray-900 w-full"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
