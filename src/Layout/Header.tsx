import { Search, Upload, RefreshCw, Sparkles, ListOrdered } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarkContext';

interface HeaderProps {
  onSync: () => void;
  onAIOptimize: () => void;
  onLogoClick?: () => void;
  onFileUpload?: () => void;
  onTaskManager?: () => void;
}

export default function Header({
  onSync,
  onAIOptimize,
  onLogoClick,
  onFileUpload,
  onTaskManager,
}: HeaderProps) {
  const { searchQuery, setSearchQuery } = useBookmarks();

  const handleFileUpload = () => {
    // 触发文件上传
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('导入文件:', file.name);
        // 这里处理 HTML 文件解析
        if (onFileUpload) {
          onFileUpload();
        }
      }
    };
    input.click();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4" role="banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onLogoClick}
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label="返回首页"
          >
            📚 智能书签管理
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <label htmlFor="search-input" className="sr-only">搜索书签</label>
            <input
              id="search-input"
              type="text"
              placeholder="搜索书签内容、标题、标签..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="搜索书签内容、标题、标签"
              role="searchbox"
            />
          </div>
        </div>

        <div className="flex items-center gap-3" role="toolbar" aria-label="操作工具栏">
          <button
            onClick={handleFileUpload}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="导入HTML书签文件"
            title="导入HTML书签文件"
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            <span>导入 HTML</span>
          </button>

          <button
            onClick={onSync}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="与Chrome同步书签"
            title="与Chrome同步书签"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Chrome 同步</span>
          </button>

          <button
            onClick={onAIOptimize}
            className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="使用AI优化书签"
            title="使用AI优化书签"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>AI 优化</span>
          </button>

          <button
            onClick={onTaskManager}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="任务管理面板"
            title="任务管理面板"
          >
            <ListOrdered className="w-4 h-4" aria-hidden="true" />
            <span>任务管理</span>
          </button>
        </div>
      </div>
    </header>
  );
}
