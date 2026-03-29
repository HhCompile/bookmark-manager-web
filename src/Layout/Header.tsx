import { Search, Upload, RefreshCw, Sparkles, ListOrdered } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface HeaderProps {
  onSync?: () => void;
  onAIOptimize?: () => void;
  onFileUpload?: () => void;
  onTaskManager?: () => void;
}

export default function Header({
  onSync,
  onAIOptimize,
  onFileUpload,
  onTaskManager,
}: HeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const isHomePage = location.pathname === '/';

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('导入文件:', file.name);
        onFileUpload?.();
      }
    };
    input.click();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4" role="banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label={t('nav.backToHome')}
          >
            📚 {t('header.title')}
          </button>

          {!isHomePage && (
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <label htmlFor="search-input" className="sr-only">
                {t('header.searchPlaceholder')}
              </label>
              <input
                id="search-input"
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t('header.searchPlaceholder')}
                role="searchbox"
              />
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-3"
          role="toolbar"
          aria-label={t('header.title')}
        >
          <button
            onClick={handleFileUpload}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={t('header.importHtml')}
            title={t('header.importHtml')}
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            <span>{t('header.importHtml')}</span>
          </button>

          <button
            onClick={onSync}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={t('header.chromeSync')}
            title={t('header.chromeSync')}
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>{t('header.chromeSync')}</span>
          </button>

          <button
            onClick={onAIOptimize}
            className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label={t('header.aiOptimize')}
            title={t('header.aiOptimize')}
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{t('header.aiOptimize')}</span>
          </button>

          <button
            onClick={onTaskManager}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={t('header.taskManager')}
            title={t('header.taskManager')}
          >
            <ListOrdered className="w-4 h-4" aria-hidden="true" />
            <span>{t('header.taskManager')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
