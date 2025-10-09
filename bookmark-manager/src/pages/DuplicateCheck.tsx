import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { 
  CheckCircle, 
  ExternalLink, 
  Trash2, 
  Check, 
  X, 
  FileText, 
  Hash,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DuplicateGroup from '@/components/duplicate/DuplicateGroup';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
}

export default function DuplicateCheck() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [duplicateGroups, setDuplicateGroups] = useState<Bookmark[][]>([]);
  const [invalidBookmarks, setInvalidBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());
  const [selectedInvalid, setSelectedInvalid] = useState<Set<number>>(new Set());

  // 获取书签数据并检测重复项
  useEffect(() => {
    const fetchAndAnalyzeBookmarks = async () => {
      try {
        setLoading(true);
        const response = await api.getAllBookmarks();
        const bookmarksData = response.data.bookmarks;
        setBookmarks(bookmarksData);
        
        // 检测重复书签（基于URL）
        const urlMap: Record<string, Bookmark[]> = {};
        bookmarksData.forEach(bookmark => {
          if (!urlMap[bookmark.url]) {
            urlMap[bookmark.url] = [];
          }
          urlMap[bookmark.url].push(bookmark);
        });
        
        // 只保留有重复的组
        const duplicates = Object.values(urlMap).filter(group => group.length > 1);
        setDuplicateGroups(duplicates);
        
        // 检测无效书签（URL格式不正确的书签）
        const invalid = bookmarksData.filter(bookmark => {
          if (!bookmark.url) return true;
          
          try {
            // 使用URL构造函数验证URL格式
            const url = new URL(bookmark.url);
            // 检查协议是否为http或https
            return url.protocol !== 'http:' && url.protocol !== 'https:';
          } catch (e) {
            // URL构造函数抛出异常说明URL格式无效
            return true;
          }
        });
        setInvalidBookmarks(invalid);
      } catch (err: any) {
        setError('获取书签失败: ' + err.message);
        console.error('Fetch bookmarks error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyzeBookmarks();
  }, []);

  // 切换组展开状态
  const toggleGroup = (index: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGroups(newExpanded);
  };

  // 切换组选择状态
  const toggleGroupSelection = (index: number) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedGroups(newSelected);
  };

  // 切换无效书签选择状态
  const toggleInvalidSelection = (index: number) => {
    const newSelected = new Set(selectedInvalid);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedInvalid(newSelected);
  };

  // 删除单个书签
  const handleDelete = async (url: string) => {
    if (window.confirm('确定要删除这个书签吗？')) {
      try {
        await api.deleteBookmark(url);
        // 重新加载数据
        const response = await api.getAllBookmarks();
        const bookmarksData = response.data.bookmarks;
        setBookmarks(bookmarksData);
        
        // 重新检测重复项
        const urlMap: Record<string, Bookmark[]> = {};
        bookmarksData.forEach(bookmark => {
          if (!urlMap[bookmark.url]) {
            urlMap[bookmark.url] = [];
          }
          urlMap[bookmark.url].push(bookmark);
        });
        
        const duplicates = Object.values(urlMap).filter(group => group.length > 1);
        setDuplicateGroups(duplicates);
        
        // 重新检测无效书签
        const invalid = bookmarksData.filter(bookmark => {
          if (!bookmark.url) return true;
          
          try {
            // 使用URL构造函数验证URL格式
            const url = new URL(bookmark.url);
            // 检查协议是否为http或https
            return url.protocol !== 'http:' && url.protocol !== 'https:';
          } catch (e) {
            // URL构造函数抛出异常说明URL格式无效
            return true;
          }
        });
        setInvalidBookmarks(invalid);
        
        toast.success('删除成功');
      } catch (err: any) {
        toast.error('删除失败: ' + err.message);
      }
    }
  };

  // 保留选中项并删除其他
  const handleKeepSelected = async (group: Bookmark[], selectedIndex: number) => {
    const bookmarksToDelete = group.filter((_, index) => index !== selectedIndex);
    
    try {
      // 删除其他书签
      for (const bookmark of bookmarksToDelete) {
        await api.deleteBookmark(bookmark.url);
      }
      
      // 重新加载数据
      const response = await api.getAllBookmarks();
      const bookmarksData = response.data.bookmarks;
      setBookmarks(bookmarksData);
      
      // 重新检测重复项
      const urlMap: Record<string, Bookmark[]> = {};
      bookmarksData.forEach(bookmark => {
        if (!urlMap[bookmark.url]) {
          urlMap[bookmark.url] = [];
        }
        urlMap[bookmark.url].push(bookmark);
      });
      
      const duplicates = Object.values(urlMap).filter(group => group.length > 1);
      setDuplicateGroups(duplicates);
      
      // 重新检测无效书签
      const invalid = bookmarksData.filter(bookmark => {
        if (!bookmark.url) return true;
        
        try {
          // 使用URL构造函数验证URL格式
          const url = new URL(bookmark.url);
          // 检查协议是否为http或https
          return url.protocol !== 'http:' && url.protocol !== 'https:';
        } catch (e) {
          // URL构造函数抛出异常说明URL格式无效
          return true;
        }
      });
      setInvalidBookmarks(invalid);
      
      toast.success('删除成功');
    } catch (err: any) {
      toast.error('删除失败: ' + err.message);
    }
  };

  // 批量处理选中的组
  const handleBatchProcess = async (action: 'keepFirst' | 'deleteAllButFirst') => {
    if (selectedGroups.size === 0) return;
    
    if (action === 'keepFirst') {
      if (!window.confirm(`确定要为选中的 ${selectedGroups.size} 组保留第一个书签并删除其他重复项吗？`)) {
        return;
      }
    } else if (action === 'deleteAllButFirst') {
      if (!window.confirm(`确定要删除选中的 ${selectedGroups.size} 组中的重复项吗？`)) {
        return;
      }
    }
    
    try {
      for (const groupIndex of selectedGroups) {
        const group = duplicateGroups[groupIndex];
        if (action === 'keepFirst') {
          // 保留第一个，删除其他
          const bookmarksToDelete = group.slice(1);
          for (const bookmark of bookmarksToDelete) {
            await api.deleteBookmark(bookmark.url);
          }
        } else if (action === 'deleteAllButFirst') {
          // 删除除第一个外的所有重复项
          const bookmarksToDelete = group.slice(1);
          for (const bookmark of bookmarksToDelete) {
            await api.deleteBookmark(bookmark.url);
          }
        }
      }
      
      // 重新加载数据
      const response = await api.getAllBookmarks();
      const bookmarksData = response.data.bookmarks;
      setBookmarks(bookmarksData);
      
      // 重新检测重复项
      const urlMap: Record<string, Bookmark[]> = {};
      bookmarksData.forEach(bookmark => {
        if (!urlMap[bookmark.url]) {
          urlMap[bookmark.url] = [];
        }
        urlMap[bookmark.url].push(bookmark);
      });
      
      const duplicates = Object.values(urlMap).filter(group => group.length > 1);
      setDuplicateGroups(duplicates);
      
      // 重新检测无效书签
      const invalid = bookmarksData.filter(bookmark => {
        if (!bookmark.url) return true;
        
        try {
          // 使用URL构造函数验证URL格式
          const url = new URL(bookmark.url);
          // 检查协议是否为http或https
          return url.protocol !== 'http:' && url.protocol !== 'https:';
        } catch (e) {
          // URL构造函数抛出异常说明URL格式无效
          return true;
        }
      });
      setInvalidBookmarks(invalid);
      
      // 清除选择
      setSelectedGroups(new Set());
      
      toast.success('批量处理完成');
    } catch (err: any) {
      toast.error('批量处理失败: ' + err.message);
    }
  };

  // 批量删除无效书签
  const handleBatchDeleteInvalid = async () => {
    if (selectedInvalid.size === 0) return;
    
    if (!window.confirm(`确定要删除选中的 ${selectedInvalid.size} 个无效书签吗？`)) {
      return;
    }
    
    try {
      for (const index of selectedInvalid) {
        const bookmark = invalidBookmarks[index];
        await api.deleteBookmark(bookmark.url);
      }
      
      // 重新加载数据
      const response = await api.getAllBookmarks();
      const bookmarksData = response.data.bookmarks;
      setBookmarks(bookmarksData);
      
      // 重新检测重复项
      const urlMap: Record<string, Bookmark[]> = {};
      bookmarksData.forEach(bookmark => {
        if (!urlMap[bookmark.url]) {
          urlMap[bookmark.url] = [];
        }
        urlMap[bookmark.url].push(bookmark);
      });
      
      const duplicates = Object.values(urlMap).filter(group => group.length > 1);
      setDuplicateGroups(duplicates);
      
      // 重新检测无效书签
      const invalid = bookmarksData.filter(bookmark => {
        if (!bookmark.url) return true;
        
        try {
          // 使用URL构造函数验证URL格式
          const url = new URL(bookmark.url);
          // 检查协议是否为http或https
          return url.protocol !== 'http:' && url.protocol !== 'https:';
        } catch (e) {
          // URL构造函数抛出异常说明URL格式无效
          return true;
        }
      });
      setInvalidBookmarks(invalid);
      
      // 清除选择
      setSelectedInvalid(new Set());
      
      toast.success('批量删除无效书签完成');
    } catch (err: any) {
      toast.error('批量删除无效书签失败: ' + err.message);
    }
  };

  // 访问书签
  const handleVisitBookmark = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">重复书签检查</h2>
          <div className="flex space-x-2">
            <Button variant="default" disabled>
              批量保留首个
            </Button>
            <Button variant="secondary" disabled>
              批量删除重复项
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">重复书签检查</h2>
          <div className="flex space-x-2">
            <Button variant="default" disabled>
              批量保留首个
            </Button>
            <Button variant="secondary" disabled>
              批量删除重复项
            </Button>
          </div>
        </div>
        <div className="card p-6 border border-error/30 bg-error/5">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <X className="w-6 h-6 text-error" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-error mb-2">加载失败</h3>
              <p className="text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">重复书签检查</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => handleBatchProcess('keepFirst')}
            disabled={selectedGroups.size === 0}
            variant="default"
          >
            <Check className="w-4 h-4 mr-2" />
            批量保留首个
          </Button>
          <Button 
            onClick={() => handleBatchProcess('deleteAllButFirst')}
            disabled={selectedGroups.size === 0}
            variant="secondary"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            批量删除重复项
          </Button>
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {bookmarks.length}
          </p>
          <p className="text-text-secondary text-sm">总书签数</p>
        </div>
        <div className="card p-5 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Hash className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary">
            {duplicateGroups.length}
          </p>
          <p className="text-text-secondary text-sm">重复组数</p>
        </div>
        <div className="card p-5 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-accent/10">
              <FileText className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold text-accent">
            {duplicateGroups.reduce((total, group) => total + group.length, 0)}
          </p>
          <p className="text-text-secondary text-sm">重复书签总数</p>
        </div>
        <div className="card p-5 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-warning/10">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
          </div>
          <p className="text-2xl font-bold text-warning">
            {invalidBookmarks.length}
          </p>
          <p className="text-text-secondary text-sm">无效书签数</p>
        </div>
      </div>
      
      {/* 无效书签列表 */}
      {invalidBookmarks.length > 0 && (
        <div className="card mb-8">
          <div className="p-5 border-b border-border">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">
                发现 {invalidBookmarks.length} 个无效书签
              </h3>
              <Button 
                onClick={handleBatchDeleteInvalid}
                disabled={selectedInvalid.size === 0}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                批量删除选中
              </Button>
            </div>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-10">
                      <input
                        type="checkbox"
                        checked={selectedInvalid.size === invalidBookmarks.length && invalidBookmarks.length > 0}
                        onChange={() => {
                          if (selectedInvalid.size === invalidBookmarks.length) {
                            setSelectedInvalid(new Set());
                          } else {
                            setSelectedInvalid(new Set(invalidBookmarks.map((_, index) => index)));
                          }
                        }}
                        className="h-4 w-4 text-primary rounded border-input focus:ring-primary"
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      标题
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {invalidBookmarks.map((bookmark, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedInvalid.has(index)}
                          onChange={() => toggleInvalidSelection(index)}
                          className="h-4 w-4 text-primary rounded border-input focus:ring-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-text-primary max-w-xs truncate">
                          {bookmark.title || '无标题'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-text-secondary max-w-xs truncate">
                          {bookmark.url || '无效URL'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleVisitBookmark(bookmark.url)}
                          className="text-primary hover:text-primary-dark mr-3 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(bookmark.url)}
                          className="text-error hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* 重复书签列表 */}
      {duplicateGroups.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">恭喜！没有发现重复书签</h3>
          <p className="text-text-secondary">所有书签都是唯一的</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-primary">
              发现 {duplicateGroups.length} 组重复书签
            </h3>
            <p className="text-text-secondary text-sm">
              {selectedGroups.size > 0 ? `已选择 ${selectedGroups.size} 组` : '选择组进行批量操作'}
            </p>
          </div>
          
          {duplicateGroups.map((group, groupIndex) => (
            <DuplicateGroup
              key={groupIndex}
              group={group}
              groupIndex={groupIndex}
              isSelected={selectedGroups.has(groupIndex)}
              isExpanded={expandedGroups.has(groupIndex)}
              onToggleSelection={toggleGroupSelection}
              onToggleExpand={toggleGroup}
              onDelete={handleDelete}
              onKeepSelected={handleKeepSelected}
            />
          ))}
        </div>
      )}
    </div>
  );
}