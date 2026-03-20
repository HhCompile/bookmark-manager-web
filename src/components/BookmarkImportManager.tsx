import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Folder,
  Link,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Trash2,
  Download,
  Check,
} from 'lucide-react';
import { readFileAsText, isValidBookmarkFile } from '../utils/bookmarkParser';
import { useBookmarks } from '../contexts/BookmarkContext';
import type { ParsedBookmark, ParsedFolder } from '../workers/bookmarkParser.worker';

interface ImportStats {
  totalCount: number;
  folderCount: number;
  skippedCount: number;
  totalSize: number;
  parseTime: number;
}

interface BookmarkImportManagerProps {
  onImportComplete?: () => void;
}

export default function BookmarkImportManager({ onImportComplete }: BookmarkImportManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseStatus, setParseStatus] = useState('');
  const [bookmarks, setBookmarks] = useState<ParsedBookmark[]>([]);
  const [folders, setFolders] = useState<ParsedFolder[]>([]);
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<'select' | 'preview' | 'importing' | 'complete'>('select');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const { addBookmark, folders: existingFolders } = useBookmarks();

  // 初始化 Worker
  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/bookmarkParser.worker.ts', import.meta.url),
        { type: 'module' }
      );
    }
    return workerRef.current;
  }, []);

  // 处理文件选择
  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.html') && !selectedFile.name.endsWith('.htm')) {
      setError('请选择 HTML 格式的书签文件 (.html 或 .htm)');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('文件大小超过 50MB 限制，请分批导入');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setStep('preview');

    // 开始解析
    setIsParsing(true);
    setParseProgress(0);
    setParseStatus('正在读取文件...');

    try {
      const content = await readFileAsText(selectedFile);

      if (!isValidBookmarkFile(content)) {
        setError('无效的书签文件格式，请确保是从浏览器导出的标准书签文件');
        setIsParsing(false);
        return;
      }

      setParseStatus('正在解析书签...');

      const worker = getWorker();

      worker.onmessage = (event) => {
        const { type, progress, currentItem, processedCount, bookmarks: parsedBookmarks, folders: parsedFolders, stats: parsedStats, error: workerError } = event.data;

        if (type === 'progress') {
          setParseProgress(progress);
          setParseStatus(`${currentItem} (${processedCount} 个书签)`);
        } else if (type === 'complete') {
          setBookmarks(parsedBookmarks);
          setFolders(parsedFolders);
          setStats(parsedStats);
          setSelectedFolders(new Set(parsedFolders.map((f: ParsedFolder) => f.title)));
          setIsParsing(false);
          setParseProgress(100);
        } else if (type === 'error') {
          setError(workerError || '解析失败');
          setIsParsing(false);
        }
      };

      worker.postMessage({
        type: 'parse',
        data: { content },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '读取文件失败');
      setIsParsing(false);
    }
  };

  // 处理文件拖放
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  // 执行导入
  const handleImport = async () => {
    if (selectedFolders.size === 0) {
      setError('请至少选择一个文件夹');
      return;
    }

    setStep('importing');
    const filteredBookmarks = bookmarks.filter(b =>
      selectedFolders.has(b.folder || '未分类')
    );

    const total = filteredBookmarks.length;
    let imported = 0;
    let currentFolder = '';

    // 批量导入，显示真实进度
    for (let i = 0; i < filteredBookmarks.length; i++) {
      const b = filteredBookmarks[i];
      
      // 更新文件夹状态
      if (b.folder !== currentFolder) {
        currentFolder = b.folder || '未分类';
        setParseStatus(`正在导入 "${currentFolder}"... (${i + 1}/${total})`);
      }

      addBookmark({
        title: b.title,
        url: b.url,
        favicon: b.icon,
        category: b.folder,
        tags: b.tags,
        isLocked: false,
      });

      imported++;
      setParseProgress((imported / total) * 100);

      // 每 20 个暂停一下避免阻塞 UI
      if (i % 20 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    setParseProgress(100);
    setParseStatus(`成功导入 ${imported} 个书签`);
    
    // 延迟显示完成状态，然后跳转
    setTimeout(() => {
      setStep('complete');
      
      // 2秒后自动跳转
      setTimeout(() => {
        handleClose();
        onImportComplete?.();
      }, 1500);
    }, 500);
  };

  // 切换文件夹选择
  const toggleFolder = (folderTitle: string) => {
    setSelectedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderTitle)) {
        next.delete(folderTitle);
      } else {
        next.add(folderTitle);
      }
      return next;
    });
  };

  // 计算选中书签数
  const selectedCount = bookmarks.filter(b =>
    selectedFolders.has(b.folder || '未分类')
  ).length;

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 关闭并重置
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setFile(null);
      setBookmarks([]);
      setFolders([]);
      setStats(null);
      setError(null);
      setStep('select');
      setParseProgress(0);
    }, 300);
  };

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>导入 HTML</span>
      </button>

      {/* 导入对话框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">导入书签</h3>
                    <p className="text-sm text-gray-500">从 HTML 文件导入浏览器书签</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 内容区 */}
              <div className="flex-1 overflow-auto p-6">
                {step === 'select' && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      拖放书签文件到此处
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      支持 Chrome、Firefox、Edge 等浏览器导出的 HTML 书签文件
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      选择文件
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".html,.htm"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileSelect(f);
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-4">
                      最大支持 50MB，大文件将使用后台线程解析
                    </p>
                  </div>
                )}

                {step === 'preview' && (
                  <div className="space-y-6">
                    {/* 文件信息 */}
                    {file && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <FileText className="w-10 h-10 text-blue-600" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatSize(file.size)} · {stats && `${stats.totalCount} 个书签`}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setFile(null);
                            setStep('select');
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* 解析进度 */}
                    {isParsing && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{parseStatus}</span>
                          <span className="text-gray-500">{Math.round(parseProgress)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${parseProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 解析结果预览 */}
                    {!isParsing && stats && (
                      <>
                        {/* 统计卡片 */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.totalCount}</p>
                            <p className="text-xs text-blue-600">书签总数</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.folderCount}</p>
                            <p className="text-xs text-green-600">文件夹数</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-purple-600">{stats.parseTime}ms</p>
                            <p className="text-xs text-purple-600">解析耗时</p>
                          </div>
                        </div>

                        {/* 文件夹选择 */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900 flex items-center gap-2">
                              <Filter className="w-4 h-4" />
                              选择要导入的文件夹
                            </h5>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedFolders(new Set(folders.map(f => f.title)))}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                全选
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => setSelectedFolders(new Set())}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                全不选
                              </button>
                            </div>
                          </div>

                          <div className="border rounded-lg divide-y max-h-64 overflow-auto">
                            {folders.map(folder => (
                              <label
                                key={folder.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedFolders.has(folder.title)}
                                  onChange={() => toggleFolder(folder.title)}
                                  className="w-4 h-4 text-blue-600 rounded"
                                />
                                <Folder className="w-4 h-4 text-gray-400" />
                                <span className="flex-1 text-sm text-gray-700">{folder.title}</span>
                                <span className="text-xs text-gray-500">{folder.bookmarkCount} 个</span>
                              </label>
                            ))}
                          </div>

                          <p className="text-sm text-gray-500 mt-2">
                            已选择 {selectedFolders.size} 个文件夹，共 {selectedCount} 个书签
                          </p>
                        </div>
                      </>
                    )}

                    {error && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                )}

                {step === 'importing' && (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">{parseStatus}</p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                      <span>{Math.round(parseProgress)}%</span>
                      <span>·</span>
                      <span>{selectedCount} 个书签</span>
                    </div>
                    <div className="w-80 h-3 bg-gray-200 rounded-full mx-auto mt-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${parseProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    {/* 显示正在导入的书签预览 */}
                    <div className="mt-6 px-8">
                      <p className="text-xs text-gray-400 mb-2">正在导入的书签预览：</p>
                      <div className="bg-gray-50 rounded-lg p-3 text-left">
                        {bookmarks
                          .filter(b => selectedFolders.has(b.folder || '未分类'))
                          .slice(0, 3)
                          .map((b, i) => (
                            <div key={i} className="flex items-center gap-2 py-1 text-sm text-gray-600">
                              <span>{b.icon || '🔖'}</span>
                              <span className="truncate flex-1">{b.title}</span>
                            </div>
                          ))}
                        {selectedCount > 3 && (
                          <p className="text-xs text-gray-400 py-1">还有 {selectedCount - 3} 个书签...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 'complete' && (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">导入成功！</h4>
                    <p className="text-gray-600 mb-2">
                      成功导入 <span className="font-bold text-blue-600">{selectedCount}</span> 个书签
                    </p>
                    <p className="text-sm text-gray-400">
                      即将自动跳转到书签管理页面...
                    </p>
                    
                    {/* 导入的书签预览 */}
                    <div className="mt-6 mx-8 text-left">
                      <p className="text-xs text-gray-500 mb-2 px-1">导入的书签预览：</p>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-auto">
                        {bookmarks
                          .filter(b => selectedFolders.has(b.folder || '未分类'))
                          .slice(0, 5)
                          .map((b, i) => (
                            <div key={i} className="flex items-center gap-2 py-1.5 text-sm">
                              <span>{b.icon || '🔖'}</span>
                              <span className="truncate flex-1 text-gray-700">{b.title}</span>
                              <span className="text-xs text-gray-400">{b.folder}</span>
                            </div>
                          ))}
                        {selectedCount > 5 && (
                          <p className="text-xs text-gray-400 py-1 text-center">
                            还有 {selectedCount - 5} 个书签
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="flex items-center justify-between px-6 py-4 border-t">
                {step === 'preview' && !isParsing && (
                  <>
                    <button
                      onClick={() => setStep('select')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      上一步
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={selectedFolders.size === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      导入 {selectedCount > 0 && `(${selectedCount})`}
                    </button>
                  </>
                )}

                {step === 'complete' && (
                  <button
                    onClick={handleClose}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    完成
                  </button>
                )}

                {(step === 'select' || isParsing) && (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 ml-auto"
                  >
                    取消
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
