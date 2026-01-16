import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/services/apiClient';
import { extractKeywords } from '@/lib/tagging/keywordExtractor';
import { classifyBookmark } from '@/lib/classification/bookmarkClassifier';
import type { Bookmark } from '@/types/entities/bookmark';

interface FileUploadResult {
  file: File;
  bookmarks: Bookmark[];
  success: boolean;
  error?: string;
}

export default function UploadPage() {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<FileUploadResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  
  // 上传文件Mutation
  const uploadMutation = useMutation({
    mutationFn: async (uploadedFile: File) => {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      const response = await apiClient.post('/bookmarks/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success(`成功导入 ${data.count} 个书签`);
    },
    onError: (error: any, uploadedFile) => {
      toast.error(`上传文件 "${uploadedFile.name}" 失败: ${error.message}`);
    },
  });
  
  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);
  
  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };
  
  // 处理文件
  const handleFiles = async (fileList: File[]) => {
    const results: FileUploadResult[] = [];
    
    for (const fileItem of fileList) {
      try {
        const bookmarks = await parseBookmarkFile(fileItem);
        
        // 自动为书签打标签和分类
        bookmarks.forEach(bookmark => {
          const { keywords: newTags } = extractKeywords(bookmark.title, { maxTags: 3 });
          const { category } = classifyBookmark(bookmark.title, bookmark.url);
          bookmark.tags = newTags;
          bookmark.category = category;
        });
        
        results.push({
          file: fileItem,
          bookmarks,
          success: true,
        });
      } catch (error: any) {
        results.push({
          file: fileItem,
          bookmarks: [],
          success: false,
          error: error.message,
        });
      }
    }
    
    setFiles(prev => [...prev, ...results]);
    setCurrentStep('preview');
  };
  
  // 解析书签文件
  const parseBookmarkFile = async (file: File): Promise<Bookmark[]> => {
    const text = await file.text();
    
    if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      return parseHTMLBookmarks(text);
    } else if (file.name.endsWith('.json')) {
      return parseJSONBookmarks(text);
    } else if (file.name.endsWith('.csv')) {
      return parseCSVBookmarks(text);
    } else {
      throw new Error('不支持的文件格式');
    }
  };
  
  // 解析HTML书签
  const parseHTMLBookmarks = (html: string): Bookmark[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a');
    
    return Array.from(links).map((link, index) => ({
      id: `imported-${Date.now()}-${index}`,
      url: link.href,
      title: link.textContent || link.href,
      category: '',
      tags: [],
      isValid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  };
  
  // 解析JSON书签
  const parseJSONBookmarks = (json: string): Bookmark[] => {
    const data = JSON.parse(json);
    const bookmarks = Array.isArray(data) ? data : data.bookmarks || [];
    
    return bookmarks.map((item: any, index: number) => ({
      id: item.id || `imported-${Date.now()}-${index}`,
      url: item.url || item.link,
      title: item.title || '无标题',
      category: item.category || '',
      tags: item.tags || [],
      isValid: true,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    }));
  };
  
  // 解析CSV书签
  const parseCSVBookmarks = (csv: string): Bookmark[] => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',');
      const item: Record<string, string> = {};
      headers.forEach((header, i) => {
        item[header.trim()] = values[i]?.trim() || '';
      });
      
      return {
        id: `imported-${Date.now()}-${index}`,
        url: item.url || item.link || '',
        title: item.title || '无标题',
        category: item.category || '',
        tags: item.tags ? item.tags.split('|') : [],
        isValid: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  };
  
  // 确认导入
  const handleConfirmImport = async () => {
    try {
      for (const result of files) {
        if (result.success) {
          await uploadMutation.mutateAsync(result.file);
        }
      }
      setCurrentStep('complete');
    } catch (error: any) {
      toast.error('导入失败: ' + error.message);
    }
  };
  
  // 重新开始
  const handleReset = () => {
    setFiles([]);
    setCurrentStep('upload');
  };
  
  // 总书签数
  const totalBookmarks = files.reduce((sum, file) => sum + file.bookmarks.length, 0);
  
  // 上传步骤
  if (currentStep === 'upload') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">导入书签</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            支持从浏览器导出的HTML文件、JSON或CSV格式导入您的书签
          </p>
        </div>

        {/* 拖拽上传区域 */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            拖拽文件到这里
          </h3>
          <p className="text-text-secondary mb-6">
            或者点击按钮选择文件
          </p>
          <input
            type="file"
            multiple
            accept=".html,.htm,.json,.csv"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer font-medium"
          >
            <Upload className="w-5 h-5 mr-2" />
            选择文件
          </label>
          <p className="text-sm text-text-tertiary mt-4">
            支持 HTML、JSON、CSV 格式
          </p>
        </div>

        {/* 支持的格式说明 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-medium text-text-primary mb-2">HTML格式</h4>
            <p className="text-sm text-text-secondary">
              支持Chrome、Firefox等浏览器导出的书签HTML文件
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border">
            <FileText className="w-8 h-8 text-purple-500 mb-3" />
            <h4 className="font-medium text-text-primary mb-2">JSON格式</h4>
            <p className="text-sm text-text-secondary">
              标准JSON格式的书签数据，包含url、title等字段
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border">
            <FileText className="w-8 h-8 text-pink-500 mb-3" />
            <h4 className="font-medium text-text-primary mb-2">CSV格式</h4>
            <p className="text-sm text-text-secondary">
              逗号分隔的CSV文件，第一行为字段名
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 预览步骤
  if (currentStep === 'preview') {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">导入预览</h1>
            <p className="text-text-secondary">
              共找到 {totalBookmarks} 个书签，请确认后导入
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            取消
          </button>
        </div>

        {/* 文件列表 */}
        <div className="space-y-4">
          {files.map((result, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-border overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-text-primary">{result.file.name}</p>
                    <p className="text-sm text-text-secondary">
                      {result.success ? `${result.bookmarks.length} 个书签` : result.error}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-text-tertiary">
                  {(result.file.size / 1024).toFixed(2)} KB
                </span>
              </div>

              {result.success && result.bookmarks.length > 0 && (
                <div className="p-4 bg-gray-50/50">
                  <h4 className="text-sm font-medium text-text-primary mb-3">
                    预览（显示前5个书签）
                  </h4>
                  <div className="space-y-2">
                    {result.bookmarks.slice(0, 5).map((bookmark, bookmarkIndex) => (
                      <div
                        key={bookmarkIndex}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {bookmark.title}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {bookmark.url}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {bookmark.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {bookmark.category}
                            </span>
                          )}
                          {bookmark.tags && bookmark.tags.length > 0 && (
                            <span className="text-xs text-text-secondary">
                              {bookmark.tags.length} 个标签
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {result.bookmarks.length > 5 && (
                    <p className="text-sm text-text-secondary mt-2">
                      ...还有 {result.bookmarks.length - 5} 个书签
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 text-text-secondary hover:text-text-primary transition-colors font-medium"
          >
            重新选择
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={uploadMutation.isPending}
            className="flex items-center px-6 py-2.5 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                导入中...
              </>
            ) : (
              <>
                确认导入
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 完成步骤
  if (currentStep === 'complete') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">导入成功！</h2>
          <p className="text-text-secondary mb-6">
            成功导入 {totalBookmarks} 个书签到您的收藏夹
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="flex items-center px-6 py-2.5 text-text-secondary hover:text-text-primary transition-colors font-medium"
            >
              继续导入
            </button>
            <button
              onClick={() => window.location.href = '/bookmarks'}
              className="flex items-center px-6 py-2.5 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
            >
              查看书签
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
