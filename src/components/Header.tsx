import { Link } from 'react-router-dom';
import { Bookmark, Settings } from 'lucide-react';

// 页头组件 - 显示应用标题
export default function Header() {
  return (
    // 粘性布局的页头容器，使用surface背景和阴影效果
    <header className="sticky top-0 z-10 bg-surface border-b border-border">
      <div className="flex justify-between items-center h-14 px-4 sm:px-6">
        {/* 应用标题，使用品牌主色和现代字体 */}
        <Link to="/" className="flex items-center">
          <Bookmark className="w-6 h-6 text-primary mr-2" />
          <h1 className="text-xl font-bold text-primary">书签管理器</h1>
        </Link>
        
        {/* 用户操作区域 */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-text-secondary hover:text-primary hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}