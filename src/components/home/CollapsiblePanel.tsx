import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CollapsiblePanelProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
  isActive: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  showViewModeSelector?: boolean;
  selectedViewMode?: 'list' | 'card' | 'tree';
  onViewModeChange?: (mode: 'list' | 'card' | 'tree') => void;
}

export default function CollapsiblePanel({
  id,
  title,
  description,
  icon: Icon,
  content,
  isActive,
  onHover,
  onLeave,
  showViewModeSelector = false,
  selectedViewMode = 'list',
  onViewModeChange
}: CollapsiblePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    onHover(id);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    // 延迟调用 onLeave，确保用户有足够的时间移动到其他面板
    setTimeout(() => {
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const { clientX, clientY } = event;
        if (
          clientX < rect.left ||
          clientX > rect.right ||
          clientY < rect.top ||
          clientY > rect.bottom
        ) {
          onLeave();
        }
      }
    }, 100);
  };

  return (
    <motion.div
      ref={panelRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        rounded-xl overflow-hidden border transition-all duration-300
        ${
          isActive
            ? 'border-blue-400 shadow-lg bg-white'
            : 'border-gray-200 hover:border-blue-200 bg-white'
        }
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* 面板标题栏 */}
      <div
        className={`
        p-4 flex items-center justify-between cursor-pointer
        ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}
      `}
      >
        <div className="flex items-center gap-3">
          <div
            className={`
            p-2 rounded-lg
            ${isActive ? 'bg-blue-100' : 'bg-gray-100'}
          `}
          >
            <Icon
              className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
            />
          </div>
          <div>
            <h3
              className={`font-semibold ${isActive ? 'text-blue-800' : 'text-gray-800'}`}
            >
              {title}
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`
            w-6 h-6 flex items-center justify-center
            ${isActive ? 'text-blue-600' : 'text-gray-400'}
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </div>

      {/* 面板内容 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="border-t border-gray-200"
          >
            <div className="p-4">
              {/* 视图模式选择器 */}
              {showViewModeSelector && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-lg p-4 shadow-md mb-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      onClick={() => onViewModeChange?.('list')}
                      className={`p-3 bg-white rounded-lg border-2 transition-all hover:shadow-sm text-center ${
                        selectedViewMode === 'list'
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="mb-2 flex justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={
                            selectedViewMode === 'list'
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                          ></rect>
                          <path d="M3 9h18"></path>
                          <path d="M9 21V9"></path>
                        </svg>
                      </div>
                      <h4
                        className={`font-medium text-xs ${
                          selectedViewMode === 'list'
                            ? 'text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
                        列表视图
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">详细信息展示</p>
                    </button>
                    <button
                      onClick={() => onViewModeChange?.('card')}
                      className={`p-3 bg-white rounded-lg border-2 transition-all hover:shadow-sm text-center ${
                        selectedViewMode === 'card'
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="mb-2 flex justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={
                            selectedViewMode === 'card'
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }
                        >
                          <path d="M12 7v14"></path>
                          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                        </svg>
                      </div>
                      <h4
                        className={`font-medium text-xs ${
                          selectedViewMode === 'card'
                            ? 'text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
                        卡片视图
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">视觉化浏览</p>
                    </button>
                    <button
                      onClick={() => onViewModeChange?.('tree')}
                      className={`p-3 bg-white rounded-lg border-2 transition-all hover:shadow-sm text-center ${
                        selectedViewMode === 'tree'
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="mb-2 flex justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={
                            selectedViewMode === 'tree'
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <circle cx="12" cy="12" r="6"></circle>
                          <circle cx="12" cy="12" r="2"></circle>
                        </svg>
                      </div>
                      <h4
                        className={`font-medium text-xs ${
                          selectedViewMode === 'tree'
                            ? 'text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
                        树状视图
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">层级结构展示</p>
                    </button>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-700 text-center">
                      点击上方按钮切换书签视图模式
                    </p>
                  </div>
                </div>
              )}
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
