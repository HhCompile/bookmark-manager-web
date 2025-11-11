import { useState, useEffect, SetStateAction, useRef } from 'react';
import { apiService as api } from '@/services/api';
import { Grid, List, Table, Folder, X, BarChart, PieChart } from 'lucide-react';
import { toast } from 'sonner';
import * as echarts from 'echarts';
import BookmarkToolbar from '@/components/bookmark/BookmarkToolbar';
import BookmarkGridView from '@/components/bookmark/BookmarkGridView';
import BookmarkListView from '@/components/bookmark/BookmarkListView';
import BookmarkTableView from '@/components/bookmark/BookmarkTableView';
import FolderManager from '@/components/bookmark/FolderManager';
import { debounceFn } from '@/lib/utils';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
  isValid: boolean;
  alias?: string;
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedValidity, setSelectedValidity] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [setValidationStatus] = useState<any>(null);
  const [isValidationRunning, setIsValidationRunning] = useState(false);
  const [folders, setFolders] = useState<any[]>([]);
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const categoryChartRef = useRef<HTMLDivElement>(null);
  const domainChartRef = useRef<HTMLDivElement>(null);
  const categoryChartInstance = useRef<echarts.EChartsType | null>(null);
  const domainChartInstance = useRef<echarts.EChartsType | null>(null);

  // 渲染分类饼图
  const renderCategoryChart = () => {
    if (!categoryChartRef.current) return;

    // 销毁之前的实例
    if (categoryChartInstance.current) {
      categoryChartInstance.current.dispose();
    }

    // 初始化图表
    categoryChartInstance.current = echarts.init(categoryChartRef.current);

    // 统计分类数据
    const categoryCount: Record<string, number> = {};
    bookmarks.forEach(bookmark => {
      const category = bookmark.category || '未分类';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // 生成颜色数组
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ];

    // 准备数据
    const data = Object.entries(categoryCount).map(([name, value], index) => ({
      name,
      value,
      itemStyle: { color: colors[index % colors.length] }
    }));

    // 图表配置
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        textStyle: { color: '#6b7280' }
      },
      series: [
        {
          name: '书签分类',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    // 设置配置并渲染
    categoryChartInstance.current.setOption(option);

    // 响应窗口大小变化
    const handleResize = () => {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  // 渲染域名柱状图
  const renderDomainChart = () => {
    if (!domainChartRef.current) return;

    // 销毁之前的实例
    if (domainChartInstance.current) {
      domainChartInstance.current.dispose();
    }

    // 初始化图表
    domainChartInstance.current = echarts.init(domainChartRef.current);

    // 统计域名数据
    const domainCount: Record<string, number> = {};
    bookmarks.forEach(bookmark => {
      try {
        const domain = new URL(bookmark.url).hostname;
        domainCount[domain] = (domainCount[domain] || 0) + 1;
      } catch (e) {
        // 忽略无效URL
      }
    });

    // 取前10个域名
    const topDomains = Object.entries(domainCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // 图表配置
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: topDomains.map(item => item[0]),
        axisLabel: {
          rotate: 45,
          color: '#6b7280'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#6b7280'
        }
      },
      series: [
        {
          name: '书签数量',
          type: 'bar',
          data: topDomains.map(item => item[1]),
          itemStyle: {
            color: '#3b82f6'
          }
        }
      ]
    };

    // 设置配置并渲染
    domainChartInstance.current.setOption(option);

    // 响应窗口大小变化
    const handleResize = () => {
      if (domainChartInstance.current) {
        domainChartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  // 获取书签数据
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const response = await api.getBookmarks();
        setBookmarks(response.data.bookmarks);
        setFilteredBookmarks(response.data.bookmarks);

        // 提取所有分类和标签
        const allCategories: string[] = [
          ...new Set(
            response.data.bookmarks
              .filter((b: Bookmark) => b.category)
              .map((b: Bookmark) => b.category)
          ),
        ] as string[];
        const allTags: string[] = [
          ...new Set(
            response.data.bookmarks
              .flatMap((b: Bookmark) => b.tags || [])
              .filter(
                (tag: string | undefined): tag is string => tag !== undefined
              )
          ),
        ] as string[];

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

  // 渲染图表
  useEffect(() => {
    if (showCharts && bookmarks.length > 0) {
      renderCategoryChart();
      renderDomainChart();
    }

    // 清理图表实例
    return () => {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.dispose();
      }
      if (domainChartInstance.current) {
        domainChartInstance.current.dispose();
      }
    };
  }, [showCharts, bookmarks]);

  // 筛选书签
  useEffect(() => {
    let result = bookmarks;

    // 搜索过滤
    if (searchTerm) {
      result = result.filter(
        bookmark =>
          bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 分类过滤
    if (selectedCategory) {
      result = result.filter(
        bookmark => bookmark.category === selectedCategory
      );
    }

    // 标签过滤
    if (selectedTag) {
      result = result.filter(
        bookmark => bookmark.tags && bookmark.tags.includes(selectedTag)
      );
    }

    // 有效性过滤
    if (selectedValidity) {
      if (selectedValidity === 'valid') {
        result = result.filter(bookmark => bookmark.isValid);
      } else if (selectedValidity === 'invalid') {
        result = result.filter(bookmark => !bookmark.isValid);
      }
    }

    setFilteredBookmarks(result);
  }, [searchTerm, selectedCategory, selectedTag, selectedValidity, bookmarks]);

  // 删除书签
  const handleDelete = async (url: string) => {
    if (window.confirm('确定要删除这个书签吗？')) {
      try {
        await api.deleteBookmark(url);
        setBookmarks(prev => prev.filter(b => b.url !== url));
        // 从选中列表中移除
        setSelectedBookmarks(prev => prev.filter(item => item !== url));
        // 重新获取数据以更新分类和标签
        const response = await api.getBookmarks();
        const updatedBookmarks = response.data.bookmarks;
        setBookmarks(updatedBookmarks);
        setFilteredBookmarks(updatedBookmarks);

        // 更新分类和标签
        const allCategories = [
          ...new Set(
            updatedBookmarks
              .filter((b: Bookmark) => b.category)
              .map((b: Bookmark) => b.category)
          ),
        ];
        const allTags = [
          ...new Set(
            updatedBookmarks
              .flatMap((b: Bookmark) => b.tags || [])
              .filter(
                (tag: string | undefined): tag is string => tag !== undefined
              )
          ),
        ];

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
    if (
      window.confirm(`确定要删除选中的 ${selectedBookmarks.length} 个书签吗？`)
    ) {
      try {
        for (const url of selectedBookmarks) {
          await api.deleteBookmark(url);
        }
        setBookmarks(prev =>
          prev.filter(b => !selectedBookmarks.includes(b.url))
        );
        setSelectedBookmarks([]);
        // 重新获取数据以更新分类和标签
        const response = await api.getBookmarks();
        const updatedBookmarks = response.data.bookmarks;
        setBookmarks(updatedBookmarks);
        setFilteredBookmarks(updatedBookmarks);

        // 更新分类和标签
        const allCategories = [
          ...new Set(
            updatedBookmarks
              .filter((b: Bookmark) => b.category)
              .map((b: Bookmark) => b.category)
          ),
        ];
        const allTags = [
          ...new Set(
            updatedBookmarks
              .flatMap((b: Bookmark) => b.tags || [])
              .filter(
                (tag: string | undefined): tag is string => tag !== undefined
              )
          ),
        ];

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
    setSelectedValidity('');
  };

  // 开始验证
  const startValidation = async () => {
    try {
      setIsValidationRunning(true);
      const response = await api.startValidation();
      setValidationStatus(response.data);
      toast.success('验证已启动', {
        description: response.data.message,
      });

      // 获取更新后的书签数据
      const bookmarksResponse = await api.getBookmarks();
      setBookmarks(bookmarksResponse.data.bookmarks);
      setFilteredBookmarks(bookmarksResponse.data.bookmarks);
    } catch (error: any) {
      toast.error('启动验证失败', {
        description: error.message,
      });
    } finally {
      setIsValidationRunning(false);
    }
  };

  // 重试失败的验证
  const retryFailedValidation = async () => {
    try {
      // 这里应该调用后端API来重试失败的验证任务
      // 暂时使用模拟实现
      toast.info('重试失败的验证任务', {
        description: '正在重新验证失败的书签链接',
      });
    } catch (error: any) {
      toast.error('重试验证失败', {
        description: error.message,
      });
    }
  };

  // 导出书签
  const exportBookmarks = async () => {
    try {
      // 创建导出选项模态框
      const format = window.prompt('请选择导出格式:\n1. HTML (标准浏览器书签格式)\n2. JSON (结构化数据)\n3. CSV (表格格式)\n\n请输入数字 (1/2/3):', '1');
      
      if (!format || !['1', '2', '3'].includes(format)) {
        toast.info('导出已取消');
        return;
      }

      let data, filename, mimeType;
      
      switch (format) {
        case '1': // HTML
          data = generateBookmarkHTML(bookmarks);
          filename = 'bookmarks.html';
          mimeType = 'text/html';
          break;
        case '2': // JSON
          data = JSON.stringify(bookmarks, null, 2);
          filename = 'bookmarks.json';
          mimeType = 'application/json';
          break;
        case '3': // CSV
          data = generateBookmarkCSV(bookmarks);
          filename = 'bookmarks.csv';
          mimeType = 'text/csv';
          break;
        default:
          throw new Error('不支持的导出格式');
      }

      // 创建下载链接
      const blob = new Blob([data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // 清理
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('导出成功', {
        description: `书签已导出为${filename}文件`,
      });
    } catch (error: any) {
      toast.error('导出失败', {
        description: error.message,
      });
    }
  };

  // 生成书签HTML
  const generateBookmarkHTML = (bookmarks: Bookmark[]) => {
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>\n`;

    // 按分类组织书签
    const bookmarksByCategory: Record<string, Bookmark[]> = {};
    bookmarks.forEach(bookmark => {
      const category = bookmark.category || '未分类';
      if (!bookmarksByCategory[category]) {
        bookmarksByCategory[category] = [];
      }
      bookmarksByCategory[category].push(bookmark);
    });

    Object.entries(bookmarksByCategory).forEach(([category, categoryBookmarks]) => {
      html += `<DT><H3>${category}</H3>\n<DL><p>\n`;
      
      categoryBookmarks.forEach(bookmark => {
        const date = Math.floor(Date.now() / 1000);
        html += `<DT><A HREF="${bookmark.url}" ADD_DATE="${date}">${bookmark.title}</A>\n`;
      });
      
      html += `</DL><p>\n`;
    });

    html += `</DL><p>`;
    return html;
  };

  // 生成书签CSV
  const generateBookmarkCSV = (bookmarks: Bookmark[]) => {
    let csv = 'Title,URL,Category,Tags,Valid\n';
    
    bookmarks.forEach(bookmark => {
      const title = `"${bookmark.title.replace(/"/g, '"')}"`;
      const url = `"${bookmark.url.replace(/"/g, '"')}"`;
      const category = `"${(bookmark.category || '').replace(/"/g, '"')}"`;
      const tags = `"${(bookmark.tags || []).join(', ').replace(/"/g, '"')}"`;
      const valid = bookmark.isValid ? 'true' : 'false';
      
      csv += `${title},${url},${category},${tags},${valid}\n`;
    });
    
    return csv;
  };

  // 处理文件夹变化
  const handleFoldersChange = (newFolders: any[]) => {
    setFolders(newFolders);
    setShowFolderManager(false);
    toast.success('文件夹结构已更新');
  };

  // 显示文件夹管理器
  const showFolderManagerDialog = () => {
    setShowFolderManager(true);
  };

  // 批量自动打标
  const handleBatchAutoTag = async () => {
    if (
      window.confirm(
        `确定要为选中的 ${selectedBookmarks.length} 个书签自动打标吗？`
      )
    ) {
      try {
        let successCount = 0;
        const selectedBookmarksData = bookmarks.filter(b =>
          selectedBookmarks.includes(b.url)
        );

        // 改进的关键词提取函数
        const extractKeywords = (title: string, maxTags: number = 3) => {
          // 停用词列表
          const stopWords = [
            '的',
            '了',
            '在',
            '是',
            '我',
            '有',
            '和',
            '就',
            '不',
            '人',
            '都',
            '一',
            '一个',
            '上',
            '也',
            '很',
            '到',
            '说',
            '要',
            '去',
            '你',
            '会',
            '着',
            '没有',
            '看',
            '好',
            '自己',
            '这',
          ];

          // 清理标题，移除非字母数字字符
          const cleanTitle = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');

          // 分词并过滤
          const words = cleanTitle
            .split(/\s+/)
            .filter(word => word.length > 1 && !stopWords.includes(word));

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
          const maxTags =
            bookmark.title.length > 20
              ? 3
              : Math.min(2, Math.ceil(bookmark.title.length / 5));
          const newTags = extractKeywords(bookmark.title, maxTags);

          // 如果已经有标签，合并新标签（最多保留5个标签）
          const updatedTags = [
            ...new Set([...(bookmark.tags || []), ...newTags]),
          ].slice(0, 5);

          // 更新书签
          const updatedBookmark = {
            ...bookmark,
            tags: updatedTags,
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
        const allTags = [
          ...new Set(
            updatedBookmarks
              .flatMap((b: Bookmark) => b.tags || [])
              .filter(
                (tag: string | undefined): tag is string => tag !== undefined
              )
          ),
        ];
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
    if (
      window.confirm(
        `确定要为选中的 ${selectedBookmarks.length} 个书签自动分类吗？`
      )
    ) {
      try {
        let successCount = 0;
        const selectedBookmarksData = bookmarks.filter(b =>
          selectedBookmarks.includes(b.url)
        );

        // 自动分类函数
        const classifyBookmark = (title: string, url: string): string => {
          const titleLower = title.toLowerCase();
          const urlLower = url.toLowerCase();

          // 技术类
          if (
            titleLower.includes('编程') ||
            titleLower.includes('开发') ||
            titleLower.includes('代码') ||
            urlLower.includes('github') ||
            urlLower.includes('stackoverflow') ||
            urlLower.includes('developer')
          ) {
            return '技术';
          }

          // 新闻类
          if (
            titleLower.includes('新闻') ||
            titleLower.includes('时事') ||
            titleLower.includes('报道') ||
            urlLower.includes('news') ||
            urlLower.includes('xinwen')
          ) {
            return '新闻';
          }

          // 娱乐类
          if (
            titleLower.includes('娱乐') ||
            titleLower.includes('电影') ||
            titleLower.includes('音乐') ||
            titleLower.includes('游戏') ||
            titleLower.includes('视频') ||
            urlLower.includes('youtube') ||
            urlLower.includes('video') ||
            urlLower.includes('movie')
          ) {
            return '娱乐';
          }

          // 学习类
          if (
            titleLower.includes('学习') ||
            titleLower.includes('教程') ||
            titleLower.includes('课程') ||
            titleLower.includes('教育') ||
            titleLower.includes('知识') ||
            urlLower.includes('edu') ||
            urlLower.includes('course') ||
            urlLower.includes('tutorial')
          ) {
            return '学习';
          }

          // 购物类
          if (
            titleLower.includes('购物') ||
            titleLower.includes('商品') ||
            titleLower.includes('购买') ||
            urlLower.includes('shop') ||
            urlLower.includes('buy') ||
            urlLower.includes('taobao') ||
            urlLower.includes('jd.com') ||
            urlLower.includes('amazon')
          ) {
            return '购物';
          }

          // 社交类
          if (
            titleLower.includes('社交') ||
            titleLower.includes('社区') ||
            titleLower.includes('论坛') ||
            urlLower.includes('facebook') ||
            urlLower.includes('twitter') ||
            urlLower.includes('weibo') ||
            urlLower.includes('zhihu') ||
            urlLower.includes('reddit')
          ) {
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
            category,
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
        const allCategories: string[] = [
          ...new Set(
            updatedBookmarks
              .filter((b: Bookmark) => b.category)
              .map((b: Bookmark) => b.category)
          ),
        ] as string[];
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
        const stopWords = [
          '的',
          '了',
          '在',
          '是',
          '我',
          '有',
          '和',
          '就',
          '不',
          '人',
          '都',
          '一',
          '一个',
          '上',
          '也',
          '很',
          '到',
          '说',
          '要',
          '去',
          '你',
          '会',
          '着',
          '没有',
          '看',
          '好',
          '自己',
          '这',
        ];

        // 清理标题，移除非字母数字字符
        const cleanTitle = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');

        // 分词并过滤
        const words = cleanTitle
          .split(/\s+/)
          .filter(word => word.length > 1 && !stopWords.includes(word));

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
      const maxTags =
        bookmark.title.length > 20
          ? 3
          : Math.min(2, Math.ceil(bookmark.title.length / 5));
      const newTags = extractKeywords(bookmark.title, maxTags);

      // 更新书签（最多保留5个标签）
      const updatedTags = [
        ...new Set([...(bookmark.tags || []), ...newTags]),
      ].slice(0, 5);
      const updatedBookmark = {
        ...bookmark,
        tags: updatedTags,
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
      const allTags = [
        ...new Set(
          updatedBookmarks
            .flatMap((b: Bookmark) => b.tags || [])
            .filter(
              (tag: string | undefined): tag is string => tag !== undefined
            )
        ),
      ];
      setTags(allTags);

      // 显示成功消息
      toast.success('自动打标成功', {
        description: `为书签 "${bookmark.title}" 添加了标签: ${newTags.join(
          ', '
        )}`,
      });
    } catch (error: any) {
      toast.error('自动打标失败', {
        description: error.message,
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
        if (
          titleLower.includes('编程') ||
          titleLower.includes('开发') ||
          titleLower.includes('代码') ||
          urlLower.includes('github') ||
          urlLower.includes('stackoverflow') ||
          urlLower.includes('developer')
        ) {
          return '技术';
        }

        // 新闻类
        if (
          titleLower.includes('新闻') ||
          titleLower.includes('时事') ||
          titleLower.includes('报道') ||
          urlLower.includes('news') ||
          urlLower.includes('xinwen')
        ) {
          return '新闻';
        }

        // 娱乐类
        if (
          titleLower.includes('娱乐') ||
          titleLower.includes('电影') ||
          titleLower.includes('音乐') ||
          titleLower.includes('游戏') ||
          titleLower.includes('视频') ||
          urlLower.includes('youtube') ||
          urlLower.includes('video') ||
          urlLower.includes('movie')
        ) {
          return '娱乐';
        }

        // 学习类
        if (
          titleLower.includes('学习') ||
          titleLower.includes('教程') ||
          titleLower.includes('课程') ||
          titleLower.includes('教育') ||
          titleLower.includes('知识') ||
          urlLower.includes('edu') ||
          urlLower.includes('course') ||
          urlLower.includes('tutorial')
        ) {
          return '学习';
        }

        // 购物类
        if (
          titleLower.includes('购物') ||
          titleLower.includes('商品') ||
          titleLower.includes('购买') ||
          urlLower.includes('shop') ||
          urlLower.includes('buy') ||
          urlLower.includes('taobao') ||
          urlLower.includes('jd.com') ||
          urlLower.includes('amazon')
        ) {
          return '购物';
        }

        // 社交类
        if (
          titleLower.includes('社交') ||
          titleLower.includes('社区') ||
          titleLower.includes('论坛') ||
          urlLower.includes('facebook') ||
          urlLower.includes('twitter') ||
          urlLower.includes('weibo') ||
          urlLower.includes('zhihu') ||
          urlLower.includes('reddit')
        ) {
          return '社交';
        }

        // 默认分类
        return '其他';
      };

      const category = classifyBookmark(bookmark.title, bookmark.url);

      // 更新书签
      const updatedBookmark = {
        ...bookmark,
        category,
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
      const allCategories: string[] = [
        ...new Set(
          updatedBookmarks
            .filter((b: Bookmark) => b.category)
            .map((b: Bookmark) => b.category)
        ),
      ] as string[];
      setCategories(allCategories);

      // 显示成功消息
      toast.success('自动分类成功', {
        description: `书签 "${bookmark.title}" 已分类为: ${category}`,
      });
    } catch (error: any) {
      toast.error('自动分类失败', {
        description: error.message,
      });
    }
  };

  // 更新书签别名
  const updateBookmarkAlias = async (bookmark: Bookmark, alias: string) => {
    try {
      // 更新书签
      const updatedBookmark = {
        ...bookmark,
        alias: alias || undefined,
      };

      // 调用API更新书签
      await api.updateBookmark(bookmark.url, { alias: alias || undefined });

      // 更新本地状态
      const updatedBookmarks = bookmarks.map(b =>
        b.url === bookmark.url ? updatedBookmark : b
      );
      setBookmarks(updatedBookmarks);
      setFilteredBookmarks(updatedBookmarks);

      // 显示成功消息
      toast.success('更新别名成功', {
        description: `书签 "${bookmark.title}" 的别名已更新为: ${
          alias || '无别名'
        }`,
      });
    } catch (error: any) {
      toast.error('更新别名失败', {
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">书签列表</h1>
            <p className="text-gray-600">正在加载您的书签，请稍候...</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">书签列表</h1>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-2xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">加载失败</h3>
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  重新加载
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            书签管理
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            智能分类和整理您的书签，让您的收藏更加井井有条
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">书签列表</h2>
                <p className="text-sm text-gray-500 mt-1">
                  找到 <span className="font-bold text-primary">{filteredBookmarks.length}</span> 个书签
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    showCharts 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showCharts ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      隐藏图表
                    </>
                  ) : (
                    <>
                      <BarChart className="w-4 h-4 mr-2" />
                      显示图表
                    </>
                  )}
                </button>
                <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                      viewMode === 'grid'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4 inline mr-2" />
                    网格
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                      viewMode === 'list'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4 inline mr-2" />
                    列表
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                      viewMode === 'table'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setViewMode('table')}
                  >
                    <Table className="w-4 h-4 inline mr-2" />
                    表格
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 顶部工具栏 */}
          <div className="p-6 border-b border-gray-200">
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
              setSearchTerm={setSearchTerm}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              selectedValidity={selectedValidity}
              setSelectedValidity={setSelectedValidity}
              categories={categories}
              tags={tags}
              clearFilters={clearFilters}
              isValidationRunning={isValidationRunning}
              onStartValidation={startValidation}
              onRetryFailed={retryFailedValidation}
              onExport={exportBookmarks}
              onManageFolders={showFolderManagerDialog}
            />
          </div>

          {/* 图表区域 */}
          {showCharts && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 分类分布饼图 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                      分类分布
                    </h3>
                  </div>
                  <div ref={categoryChartRef} style={{ height: '300px' }}></div>
                </div>
                
                {/* 域名统计柱状图 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChart className="w-5 h-5 mr-2 text-green-600" />
                      热门域名
                    </h3>
                  </div>
                  <div ref={domainChartRef} style={{ height: '300px' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* 书签列表 */}
          <div className="p-6">
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6 shadow-md">
                  <Folder className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  没有找到书签
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || selectedCategory || selectedTag || selectedValidity
                    ? '没有匹配筛选条件的书签，请尝试调整筛选条件'
                    : '暂无书签，请先上传一些书签'}
                </p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                >
                  去上传书签
                </button>
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
                handleUpdateAlias={updateBookmarkAlias}
              />
            )}
          </div>
        </div>

        {/* 文件夹管理对话框 */}
        {showFolderManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    管理文件夹结构
                  </h3>
                  <button
                    onClick={() => setShowFolderManager(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FolderManager
                  folders={folders}
                  onFoldersChange={handleFoldersChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
