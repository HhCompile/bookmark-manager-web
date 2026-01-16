import {
  Bookmark,
  BarChart3,
  ShieldAlert,
  Lock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

// 侧边栏组件 - 实现可折叠菜单和文件夹列表
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    'personal',
    'work',
  ]);
  const location = useLocation();

  // 菜单项
  const menuItems = [
    {
      icon: <Bookmark className="w-5 h-5" />,
      label: '书签管理',
      path: '/bookmarks',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: '数据分析',
      path: '/analytics',
    },
    {
      icon: <ShieldAlert className="w-5 h-5" />,
      label: '质量监控',
      path: '/quality',
    },
    { icon: <Lock className="w-5 h-5" />, label: '隐私空间', path: '/private' },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: '阅读器',
      path: '/reader',
    },
  ];

  // 文件夹列表
  const folders = [
    {
      id: 'personal',
      name: '个人收藏',
      icon: <Folder className="w-4 h-4" />,
      count: 24,
    },
    {
      id: 'work',
      name: '工作资源',
      icon: <Folder className="w-4 h-4" />,
      count: 18,
    },
    {
      id: 'research',
      name: '研究资料',
      icon: <Folder className="w-4 h-4" />,
      count: 12,
    },
    {
      id: 'learning',
      name: '学习笔记',
      icon: <Folder className="w-4 h-4" />,
      count: 8,
    },
  ];

  // 切换文件夹展开状态
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-md border-r border-border transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-70'}`}
    >
      <div className="flex flex-col h-full p-4">
        {/* 折叠按钮 */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            aria-label={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 菜单列表 */}
        <nav className="flex-1 overflow-y-auto mt-4">
          {/* 主要菜单 */}
          <div className="space-y-2 mb-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center h-10 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 mr-2">
                  {item.icon}
                </div>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>

          {/* 文件夹列表 */}
          <div>
            {!isCollapsed && (
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">
                  文件夹
                </h3>
                <button className="p-1 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-2">
              {folders.map(folder => (
                <div key={folder.id}>
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className={`flex items-center justify-between w-full h-9 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors`}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-6 h-6 mr-2">
                        {expandedFolders.includes(folder.id) ? (
                          <FolderOpen className="w-4 h-4" />
                        ) : (
                          folder.icon
                        )}
                      </div>
                      {!isCollapsed && <span>{folder.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-2">
                          {folder.count}
                        </span>
                        {expandedFolders.includes(folder.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* 子文件夹/书签列表（简化版） */}
                  {expandedFolders.includes(folder.id) && !isCollapsed && (
                    <div className="ml-8 mt-1 space-y-2">
                      <div className="flex items-center h-9 px-3 py-1.5 rounded-md text-xs text-gray-500 hover:bg-gray-50 transition-colors">
                        <span>重要链接</span>
                        <span className="ml-auto text-gray-400">5</span>
                      </div>
                      <div className="flex items-center h-9 px-3 py-1.5 rounded-md text-xs text-gray-500 hover:bg-gray-50 transition-colors">
                        <span>最近添加</span>
                        <span className="ml-auto text-gray-400">8</span>
                      </div>
                      <div className="flex items-center h-9 px-3 py-1.5 rounded-md text-xs text-gray-500 hover:bg-gray-50 transition-colors">
                        <span>未分类</span>
                        <span className="ml-auto text-gray-400">11</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* 底部信息 */}
        {!isCollapsed && (
          <div className="p-3 border-t border-border mt-4">
            <div className="text-xs text-gray-500">
              <p>
                共 {folders.reduce((sum, folder) => sum + folder.count, 0)}{' '}
                个书签
              </p>
              <p className="mt-1">最后更新: 今天 14:32</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
