import { Link } from 'react-router-dom';
import { Bookmark, Settings } from 'lucide-react';

// 页头组件 - 显示应用标题
export default function Header() {
  return (
    // 粘性布局的页头容器，使用surface背景和阴影效果
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">智能书签整理</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">使用说明</Link>
            <Link to="/bookmarks" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              查看示例
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}