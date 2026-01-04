import { Link } from 'react-router-dom';
import { Bookmark, Upload, List, FileSearch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
              <Bookmark className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-lg font-bold text-primary">书签管理器</h2>
            </div>
            <p className="text-text-secondary text-sm mt-3">
              让书签管理变得更简单、更高效
            </p>
            <p className="text-text-secondary text-xs mt-2">
              © {new Date().getFullYear()} 书签管理器. 保留所有权利.
            </p>
          </div>
          
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">功能</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="flex items-center text-text-secondary hover:text-primary text-sm transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      上传
                    </Link>
                  </li>
                  <li>
                    <Link to="/bookmarks" className="flex items-center text-text-secondary hover:text-primary text-sm transition-colors">
                      <List className="w-4 h-4 mr-2" />
                      书签列表
                    </Link>
                  </li>
                  <li>
                    <Link to="/duplicates" className="flex items-center text-text-secondary hover:text-primary text-sm transition-colors">
                      <FileSearch className="w-4 h-4 mr-2" />
                      重复检查
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">支持</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      帮助中心
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      使用教程
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      反馈建议
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">公司</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      关于我们
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      联系我们
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      加入我们
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">法律</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      隐私政策
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      使用条款
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
                      Cookie政策
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border text-center text-text-secondary text-xs">
          <p>打造更好的书签管理体验</p>
        </div>
      </div>
    </footer>
  );
}