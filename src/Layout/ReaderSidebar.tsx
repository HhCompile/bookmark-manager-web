import {
  X,
  Highlighter,
  MessageSquare,
  BookmarkPlus,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface ReaderSidebarProps {
  url: string;
  title: string;
  onClose: () => void;
}

interface Annotation {
  id: string;
  text: string;
  note: string;
  timestamp: Date;
}

export default function ReaderSidebar({
  url,
  title,
  onClose,
}: ReaderSidebarProps) {
  const [highlights, setHighlights] = useState<string[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      text: 'React 的核心概念是组件化',
      note: '这是理解 React 的关键点',
      timestamp: new Date(),
    },
  ]);
  const [selectedText, setSelectedText] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleAddHighlight = () => {
    if (selectedText) {
      setHighlights([...highlights, selectedText]);
      setSelectedText('');
    }
  };

  const handleAddAnnotation = () => {
    if (selectedText && noteInput) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        text: selectedText,
        note: noteInput,
        timestamp: new Date(),
      };
      setAnnotations([...annotations, newAnnotation]);
      setSelectedText('');
      setNoteInput('');
      setShowNoteInput(false);
    }
  };

  // 模拟文章内容
  const articleContent = `
    # React 性能优化指南
    
    React 是一个用于构建用户界面的 JavaScript 库。它的核心概念是组件化，允许开发者将复杂的 UI 拆分成独立、可复用的组件。
    
    ## 为什么需要性能优化？
    
    随着应用规模的增长，性能问题会逐渐显现。常见的性能问题包括：
    - 不必要的重新渲染
    - 大型列表渲染缓慢
    - 状态更新导致的卡顿
    
    ## 优化技巧
    
    ### 1. 使用 React.memo
    React.memo 是一个高阶组件，可以防止不必要的重新渲染。当组件的 props 没有变化时，它会跳过渲染。
    
    ### 2. 使用 useMemo 和 useCallback
    这两个 Hook 可以帮助你缓存昂贵的计算结果和函数引用。
    
    ### 3. 虚拟化长列表
    对于包含大量数据的列表，使用虚拟化技术可以显著提升性能。
    
    ## 总结
    
    性能优化是一个持续的过程，需要根据实际情况选择合适的优化策略。
  `;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-end z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={e => e.stopPropagation()}
          className="bg-white h-full w-full max-w-4xl shadow-2xl flex"
        >
          {/* 主阅读区域 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {title}
                </h2>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  {url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 工具栏 */}
            <div className="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
              <button
                onClick={handleAddHighlight}
                disabled={!selectedText}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Highlighter className="w-4 h-4" />
                高亮选中文本
              </button>
              <button
                onClick={() => setShowNoteInput(true)}
                disabled={!selectedText}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-4 h-4" />
                添加批注
              </button>
              {selectedText && (
                <span className="ml-auto text-sm text-gray-600">
                  已选中文本：{selectedText.substring(0, 30)}...
                </span>
              )}
            </div>

            {/* 文章内容 */}
            <div
              className="flex-1 overflow-y-auto p-8 prose prose-gray max-w-none"
              onMouseUp={() => {
                const selection = window.getSelection();
                const text = selection?.toString().trim();
                if (text) {
                  setSelectedText(text);
                }
              }}
            >
              <div className="whitespace-pre-wrap leading-relaxed">
                {articleContent}
              </div>
            </div>
          </div>

          {/* 侧边栏：批注和高亮 */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">笔记与批注</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 高亮列表 */}
              {highlights.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Highlighter className="w-4 h-4" />
                    高亮 ({highlights.length})
                  </h4>
                  <div className="space-y-2">
                    {highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 批注列表 */}
              {annotations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    批注 ({annotations.length})
                  </h4>
                  <div className="space-y-3">
                    {annotations.map(annotation => (
                      <div
                        key={annotation.id}
                        className="p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <p className="text-xs text-gray-500 mb-2">
                          {annotation.timestamp.toLocaleString('zh-CN')}
                        </p>
                        <p className="text-sm text-gray-600 italic mb-2">
                          "{annotation.text}"
                        </p>
                        <p className="text-sm text-gray-900">
                          {annotation.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 添加批注输入框 */}
              {showNoteInput && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <p className="text-xs text-gray-500 mb-2">选中的文本：</p>
                  <p className="text-sm text-gray-600 italic mb-3">
                    "{selectedText}"
                  </p>
                  <textarea
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    placeholder="输入你的批注..."
                    className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleAddAnnotation}
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setShowNoteInput(false);
                        setNoteInput('');
                      }}
                      className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
