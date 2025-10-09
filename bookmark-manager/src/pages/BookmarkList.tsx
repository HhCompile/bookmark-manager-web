import { useState, useEffect, SetStateAction } from 'react';
import { api } from '@/services/api';
import { 
  Grid, 
  List, 
  Table,
  Folder, 
  X 
} from 'lucide-react';
import { toast } from 'sonner';
import BookmarkToolbar from '@/components/bookmark/BookmarkToolbar';
import BookmarkGridView from '@/components/bookmark/BookmarkGridView';
import BookmarkListView from '@/components/bookmark/BookmarkListView';
import BookmarkTableView from '@/components/bookmark/BookmarkTableView';
import { debounceFn } from '@/lib/utils';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 防抖搜索处理
  const debouncedSearch = debounceFn((term: string) => {
    setSearchTerm(term);
  }, 300);

  // 获取书签数据
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const response = await api.getAllBookmarks();
        setBookmarks(response.data.bookmarks);
        setFilteredBookmarks(response.data.bookmarks);
        
        // 提取所有分类和标签
        const allCategories: string[] = [...new Set(response.data.bookmarks
          .filter((b: Bookmark) => b.category)
          .map((b: Bookmark) => b.category))] as string[];
        const allTags: string[] = [...new Set(response.data.bookmarks
          .flatMap((b: Bookmark) => b.tags || [])
          .filter((tag: string | undefined): tag is string => tag !== undefined))] as string[];
        
        setCategories(allCategories as SetStateAction<string[]>);
        setTags(allTags as SetStateAction<string[]>);
      } catch (err: any) {
        setError('获取书签失败: ' + err.message);
        console.error('Fetch bookmarks error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // 筛选书签
  useEffect(() => {
    let result = bookmarks;
    
    // 搜索过滤
    if (searchTerm) {
      result = result.filter(bookmark => 
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 分类过滤
    if (selectedCategory) {
      result = result.filter(bookmark => bookmark.category === selectedCategory);
    }
    
    // 标签过滤
    if (selectedTag) {
      result = result.filter(bookmark => 
        bookmark.tags && bookmark.tags.includes(selectedTag)
      );
    }
    
    setFilteredBookmarks(result);
  }, [searchTerm, selectedCategory, selectedTag, bookmarks]);

  // 删除书签
  const handleDelete = async (url: string) => {
    if (window.confirm('确定要删除这个书签吗？')) {
      try {
        await api.deleteBookmark(url);
        setBookmarks(prev => prev.filter(b => b.url !== url));
        // 从选中列表中移除
        setSelectedBookmarks(prev => prev.filter(item => item !== url));
        // 重新获取数据以更新分类和标签
        const response = await api.getAllBookmarks();
        const updatedBookmarks = response.data.bookmarks;
        setBookmarks(updatedBookmarks);
        setFilteredBookmarks(updatedBookmarks);
        
        // 更新分类和标签
        const allCategories = [...new Set(updatedBookmarks
          .filter((b: Bookmark) => b.category)
          .map((b: Bookmark) => b.category))];
        const allTags = [...new Set(updatedBookmarks
          .flatMap((b: Bookmark) => b.tags || [])
          .filter((tag: string | undefined): tag is string => tag !== undefined))];
        
        setCategories(allCategories as SetStateAction<string[]>);
        setTags(allTags as SetStateAction<string[]>);
        
        toast.success('删除成功');
      } catch (err: any) {
        toast.error('删除失败: ' + err.message);
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (window.confirm(`确定要删除选中的 ${selectedBookmarks.length} 个书签吗？`)) {
      try {
        for (const url of selectedBookmarks) {
          await api.deleteBookmark(url);
        }
        setBookmarks(prev => prev.filter(b => !selectedBookmarks.includes(b.url)));
        setSelectedBookmarks([]);
        // 重新获取数据以更新分类和标签
        const response = await api.getAllBookmarks();
        const updatedBookmarks = response.data.bookmarks;
        setBookmarks(updatedBookmarks);
        setFilteredBookmarks(updatedBookmarks);
        
        // 更新分类和标签
        const allCategories = [...new Set(updatedBookmarks
          .filter((b: Bookmark) => b.category)
          .map((b: Bookmark) => b.category))];
        const allTags = [...new Set(updatedBookmarks
          .flatMap((b: Bookmark) => b.tags || [])
          .filter((tag: string | undefined): tag is string => tag !== undefined))];
        
        setCategories(allCategories as SetStateAction<string[]>);
        setTags(allTags as SetStateAction<string[]>);
        
        toast.success(`成功删除 ${selectedBookmarks.length} 个书签`);
      } catch (err: any) {
        toast.error('批量删除失败: ' + err.message);
      }
    }
  };

  

  // 切换书签选择
  const toggleBookmarkSelection = (url: string) => {
    if (selectedBookmarks.includes(url)) {
      setSelectedBookmarks(selectedBookmarks.filter(item => item !== url));
    } else {
      setSelectedBookmarks([...selectedBookmarks, url]);
    }
  };

  // 切换全选
  const toggleSelectAll = () => {
    if (selectedBookmarks.length === filteredBookmarks.length) {
      setSelectedBookmarks([]);
    } else {
      setSelectedBookmarks(filteredBookmarks.map(b => b.url));
    }
  };

  // 清除筛选
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  // 批量自动打标
  const handleBatchAutoTag = async () => {
    if (window.confirm(`确定要为选中的 ${selectedBookmarks.length} 个书签自动打标吗？`)) {
      try {
        let successCount = 0;
        const selectedBookmarksData = bookmarks.filter(b => selectedBookmarks.includes(b.url));
        
        // 改进的关键词提取函数
        const extractKeywords = (title: string, maxTags: number = 3) => {
          // 停用词列表
          const stopWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
          
          // 清理标题，移除非字母数字字符
          const cleanTitle = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');
          
          // 分词并过滤
          const words = cleanTitle.split(/\s+/).filter(word => 
            word.length > 1 && !stopWords.includes(word)
          );
          
          // 如果词数很少，直接返回
          if (words.length <= maxTags) {
            return Array.from(new Set(words));
          }
          
          // 计算词频
          const wordFreq: Record<string, number> = {};
          words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
          });
          
          // 计算词长权重（长词通常更重要）
          const wordScores: Record<string, number> = {};
          Object.keys(wordFreq).forEach(word => {
            // 词频权重 + 词长权重
            wordScores[word] = wordFreq[word] * (1 + Math.log(word.length));
          });
          
          // 按分数排序并取前maxTags个
          return Object.entries(wordScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxTags)
            .map(([word]) => word);
        };
        
        for (const bookmark of selectedBookmarksData) {
          // 提取关键词作为标签，根据标题长度动态调整标签数量
          const maxTags = bookmark.title.length > 20 ? 3 : Math.min(2, Math.ceil(bookmark.title.length / 5));
          const newTags = extractKeywords(bookmark.title, maxTags);
          
          // 如果已经有标签，合并新标签（最多保留5个标签）
          const updatedTags = [...new Set([...(bookmark.tags || []), ...newTags])].slice(0, 5);
          
          // 更新书签
          const updatedBookmark = {
            ...bookmark,
            tags: updatedTags
          };
          
          // 调用API更新书签
          await api.updateBookmark(bookmark.url, updatedBookmark);
          successCount++;
        }
        
        // 更新本地状态
        const updatedBookmarks = [...bookmarks];
        setBookmarks(updatedBookmarks);
        setFilteredBookmarks(updatedBookmarks);
        
        // 更新标签列表
        const allTags = [...new Set(updatedBookmarks
          .flatMap((b: Bookmark) => b.tags || [])
          .filter((tag: string | undefined): tag is string => tag !== undefined))];
        setTags(allTags);
        
        // 清除选择
        setSelectedBookmarks([]);
        
        toast.success(`成功为 ${successCount} 个书签自动打标`);
      } catch (err: any) {
        toast.error('批量自动打标失败: ' + err.message);
      }
    }
  };

  // 批量自动分类
  const handleBatchAutoClassify = async () => {
    if (window.confirm(`确定要为选中的 ${selectedBookmarks.length} 个书签自动分类吗？`)) {
      try {
        let successCount = 0;
        const selectedBookmarksData = bookmarks.filter(b => selectedBookmarks.includes(b.url));
        
        // 自动分类函数
        const classifyBookmark = (title: string, url: string): string => {
          const titleLower = title.toLowerCase();
          const urlLower = url.toLowerCase();
          
          // 技术类
          if (titleLower.includes('编程') || titleLower.includes('开发') || titleLower.includes('代码') || 
              urlLower.includes('github') || urlLower.includes('stackoverflow') || urlLower.includes('developer')) {
            return '技术';
          }
          
          // 新闻类
          if (titleLower.includes('新闻') || titleLower.includes('时事') || titleLower.includes('报道') ||
              urlLower.includes('news') || urlLower.includes('xinwen')) {
            return '新闻';
          }
          
          // 娱乐类
          if (titleLower.includes('娱乐') || titleLower.includes('电影') || titleLower.includes('音乐') || 
              titleLower.includes('游戏') || titleLower.includes('视频') ||
              urlLower.includes('youtube') || urlLower.includes('video') || urlLower.includes('movie')) {
            return '娱乐';
          }
          
          // 学习类
          if (titleLower.includes('学习') || titleLower.includes('教程') || titleLower.includes('课程') ||
              titleLower.includes('教育') || titleLower.includes('知识') ||
              urlLower.includes('edu') || urlLower.includes('course') || urlLower.includes('tutorial')) {
            return '学习';
          }
          
          // 购物类
          if (titleLower.includes('购物') || titleLower.includes('商品') || titleLower.includes('购买') ||
              urlLower.includes('shop') || urlLower.includes('buy') || urlLower.includes('taobao') || 
              urlLower.includes('jd.com') || urlLower.includes('amazon')) {
            return '购物';
          }
          
          // 社交类
          if (titleLower.includes('社交') || titleLower.includes('社区') || titleLower.includes('论坛') ||
              urlLower.includes('facebook') || urlLower.includes('twitter') || urlLower.includes('weibo') ||
              urlLower.includes('zhihu') || urlLower.includes('reddit')) {
            return '社交';
          }
          
          // 默认分类
          return '其他';
        };
        
        for (const bookmark of selectedBookmarksData) {
          // 自动分类
          const category = classifyBookmark(bookmark.title, bookmark.url);
          
          // 更新书签
          const updatedBookmark = {
            ...bookmark,
            category
          };
          
          // 调用API更新书签
          await api.updateBookmark(bookmark.url, updatedBookmark);
          successCount++;
        }
        
        // 更新本地状态
        const updatedBookmarks = [...bookmarks];
        setBookmarks(updatedBookmarks);
        setFilteredBookmarks(updatedBookmarks);
        
        // 更新分类列表
        const allCategories: string[] = [...new Set(updatedBookmarks
          .filter((b: Bookmark) => b.category)
          .map((b: Bookmark) => b.category))] as string[];
        setCategories(allCategories);
        
        // 清除选择
        setSelectedBookmarks([]);
        
        toast.success(`成功为 ${successCount} 个书签自动分类`);
      } catch (err: any) {
        toast.error('批量自动分类失败: ' + err.message);
      }
    }
  };

  // 自动打标功能
  const handleAutoTag = async (bookmark: Bookmark) => {
    try {
      // 改进的关键词提取函数
      const extractKeywords = (title: string, maxTags: number = 3) => {
        // 停用词列表
        const stopWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
        
        // 清理标题，移除非字母数字字符
        const cleanTitle = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');
        
        // 分词并过滤
        const words = cleanTitle.split(/\s+/).filter(word => 
          word.length > 1 && !stopWords.includes(word)
        );
        
        // 如果词数很少，直接返回
        if (words.length <= maxTags) {
          return Array.from(new Set(words));
        }
        
        // 计算词频
        const wordFreq: Record<string, number> = {};
        words.forEach(word => {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        // 计算词长权重（长词通常更重要）
        const wordScores: Record<string, number> = {};
        Object.keys(wordFreq).forEach(word => {
          // 词频权重 + 词长权重
          wordScores[word] = wordFreq[word] * (1 + Math.log(word.length));
        });
        
        // 按分数排序并取前maxTags个
        return Object.entries(wordScores)
          .sort((a, b) => b[1] - a[1])
          .slice(0, maxTags)
          .map(([word]) => word);
      };
      
      // 提取关键词作为标签，根据标题长度动态调整标签数量
      const maxTags = bookmark.title.length > 20 ? 3 : Math.min(2, Math.ceil(bookmark.title.length / 5));
      const newTags = extractKeywords(bookmark.title, maxTags);
      
      // 更新书签（最多保留5个标签）
      const updatedTags = [...new Set([...(bookmark.tags || []), ...newTags])].slice(0, 5);
      const updatedBookmark = {
        ...bookmark,
        tags: updatedTags
      };
      
      // 调用API更新书签
      await api.updateBookmark(bookmark.url, updatedBookmark);
      
      // 更新本地状态
      const updatedBookmarks = bookmarks.map(b => 
        b.url === bookmark.url ? updatedBookmark : b
      );
      setBookmarks(updatedBookmarks);
      setFilteredBookmarks(updatedBookmarks);
      
      // 更新标签列表
      const allTags = [...new Set(updatedBookmarks
        .flatMap((b: Bookmark) => b.tags || [])
        .filter((tag: string | undefined): tag is string => tag !== undefined))];
      setTags(allTags);
      
      // 显示成功消息
      toast.success('自动打标成功', {
        description: `为书签 "${bookmark.title}" 添加了标签: ${newTags.join(', ')}`
      });
    } catch (error: any) {
      toast.error('自动打标失败', {
        description: error.message
      });
    }
  };
  
  // 自动分类功能
  const handleAutoClassify = async (bookmark: Bookmark) => {
    try {
      // 自动分类
      const classifyBookmark = (title: string, url: string): string => {
        const titleLower = title.toLowerCase();
        const urlLower = url.toLowerCase();
        
        // 技术类
        if (titleLower.includes('编程') || titleLower.includes('开发') || titleLower.includes('代码') || 
            urlLower.includes('github') || urlLower.includes('stackoverflow') || urlLower.includes('developer')) {
          return '技术';
        }
        
        // 新闻类
        if (titleLower.includes('新闻') || titleLower.includes('时事') || titleLower.includes('报道') ||
            urlLower.includes('news') || urlLower.includes('xinwen')) {
          return '新闻';
        }
        
        // 娱乐类
        if (titleLower.includes('娱乐') || titleLower.includes('电影') || titleLower.includes('音乐') || 
            titleLower.includes('游戏') || titleLower.includes('视频') ||
            urlLower.includes('youtube') || urlLower.includes('video') || urlLower.includes('movie')) {
          return '娱乐';
        }
        
        // 学习类
        if (titleLower.includes('学习') || titleLower.includes('教程') || titleLower.includes('课程') ||
            titleLower.includes('教育') || titleLower.includes('知识') ||
            urlLower.includes('edu') || urlLower.includes('course') || urlLower.includes('tutorial')) {
          return '学习';
        }
        
        // 购物类
        if (titleLower.includes('购物') || titleLower.includes('商品') || titleLower.includes('购买') ||
            urlLower.includes('shop') || urlLower.includes('buy') || urlLower.includes('taobao') || 
            urlLower.includes('jd.com') || urlLower.includes('amazon')) {
          return '购物';
        }
        
        // 社交类
        if (titleLower.includes('社交') || titleLower.includes('社区') || titleLower.includes('论坛') ||
            urlLower.includes('facebook') || urlLower.includes('twitter') || urlLower.includes('weibo') ||
            urlLower.includes('zhihu') || urlLower.includes('reddit')) {
          return '社交';
        }
        
        // 默认分类
        return '其他';
      };
      
      const category = classifyBookmark(bookmark.title, bookmark.url);
      
      // 更新书签
      const updatedBookmark = {
        ...bookmark,
        category
      };
      
      // 调用API更新书签
      await api.updateBookmark(bookmark.url, updatedBookmark);
      
      // 更新本地状态
      const updatedBookmarks = bookmarks.map(b => 
        b.url === bookmark.url ? updatedBookmark : b
      );
      setBookmarks(updatedBookmarks);
      setFilteredBookmarks(updatedBookmarks);
      
      // 更新分类列表
      const allCategories: string[] = [...new Set(updatedBookmarks
        .filter((b: Bookmark) => b.category)
        .map((b: Bookmark) => b.category))] as string[];
      setCategories(allCategories);
      
      // 显示成功消息
      toast.success('自动分类成功', {
        description: `书签 "${bookmark.title}" 已分类为: ${category}`
      });
    } catch (error: any) {
      toast.error('自动分类失败', {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-h1 text-text-dark">书签列表</h2>
          <div className="flex bg-surface rounded-lg p-1 border border-border shadow-sm">
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-white shadow-sm">
              <Grid className="w-4 h-4 inline mr-2" />
              网格
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-text-gray hover:bg-blue-50">
              <List className="w-4 h-4 inline mr-2" />
              列表
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-text-gray hover:bg-blue-50">
              <Table className="w-4 h-4 inline mr-2" />
              表格
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-h1 text-text-dark">书签列表</h2>
          <div className="flex bg-surface rounded-lg p-1 border border-border shadow-sm">
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-white shadow-sm">
              <Grid className="w-4 h-4 inline mr-2" />
              网格
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-text-gray hover:bg-blue-50">
              <List className="w-4 h-4 inline mr-2" />
              列表
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-text-gray hover:bg-blue-50">
              <Table className="w-4 h-4 inline mr-2" />
              表格
            </button>
          </div>
        </div>
        <div className="card p-8 border border-danger/30 bg-danger/5">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <X className="w-6 h-6 text-danger" />
            </div>
            <div className="ml-4">
              <h3 className="text-h3 text-danger mb-2">加载失败</h3>
              <p className="text-body text-text-gray">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-h1 text-text-dark">书签列表</h2>
        <div className="flex bg-surface rounded-lg p-1 border border-border shadow-sm">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-text-gray hover:bg-blue-50'
            }`}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4 inline mr-2" />
            网格
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-text-gray hover:bg-blue-50'
            }`}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 inline mr-2" />
            列表
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-text-gray hover:bg-blue-50'
            }`}
            onClick={() => setViewMode('table')}
          >
            <Table className="w-4 h-4 inline mr-2" />
            表格
          </button>
        </div>
      </div>
      
      {/* 顶部工具栏 */}
      <BookmarkToolbar
        selectedBookmarks={selectedBookmarks}
        filteredBookmarksLength={filteredBookmarks.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        toggleSelectAll={toggleSelectAll}
        handleBatchDelete={handleBatchDelete}
        handleBatchAutoTag={handleBatchAutoTag}
        handleBatchAutoClassify={handleBatchAutoClassify}
        searchTerm={searchTerm}
        setSearchTerm={debouncedSearch}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        categories={categories}
        tags={tags}
        clearFilters={clearFilters}
      />
      
      {/* 结果统计 */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-text-secondary text-sm">
          找到 <span className="font-medium text-text-primary">{filteredBookmarks.length}</span> 个书签
        </p>
      </div>
      
      {/* 书签列表 */}
      {filteredBookmarks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Folder className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">没有找到书签</h3>
          <p className="text-text-secondary">
            {searchTerm || selectedCategory || selectedTag 
              ? '没有匹配筛选条件的书签' 
              : '暂无书签，请先上传一些书签'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <BookmarkGridView
          bookmarks={filteredBookmarks}
          selectedBookmarks={selectedBookmarks}
          toggleBookmarkSelection={toggleBookmarkSelection}
          handleDelete={handleDelete}
        />
      ) : viewMode === 'list' ? (
        <BookmarkListView
          bookmarks={filteredBookmarks}
          selectedBookmarks={selectedBookmarks}
          toggleBookmarkSelection={toggleBookmarkSelection}
          handleDelete={handleDelete}
        />
      ) : (
        <BookmarkTableView
          bookmarks={filteredBookmarks}
          selectedBookmarks={selectedBookmarks}
          toggleBookmarkSelection={toggleBookmarkSelection}
          handleDelete={handleDelete}
          handleAutoTag={handleAutoTag}
          handleAutoClassify={handleAutoClassify}
        />
      )}
    </div>
  );
}