/**
 * AI 智能搜索栏 V2
 * 使用 ahooks 优化版本
 * - useSetState: 管理多个相关状态
 * - useDebounceFn: 防抖搜索
 * - useToggle: 切换显示状态
 * - useClickAway: 点击外部关闭
 * - useKeyPress: 快捷键支持
 */

import { useRef } from 'react';
import {
  useSetState,
  useToggle,
  useDebounceFn,
  useClickAway,
  useKeyPress,
} from 'ahooks';
import {
  Search,
  Sparkles,
  X,
  Tag,
  FolderOpen,
  Filter,
} from 'lucide-react';
import { Bookmark } from '@/types/bookmark';

interface AISearchBarV2Props {
  bookmarks: Bookmark[];
  onSearch: (query: string, filters: SearchFilters) => void;
  onClear: () => void;
  placeholder?: string;
}

export interface SearchFilters {
  categories: string[];
  tags: string[];
  hasAlias: boolean | null;
  isFavorite: boolean | null;
  minVisits: number | null;
}

const defaultFilters: SearchFilters = {
  categories: [],
  tags: [],
  hasAlias: null,
  isFavorite: null,
  minVisits: null,
};

// 提取所有分类和标签
const extractFilters = (bookmarks: Bookmark[]) => {
  const categories = new Set<string>();
  const tags = new Set<string>();
  
  bookmarks.forEach(b => {
    if (b.category) categories.add(b.category);
    b.tags.forEach(t => tags.add(t));
    b.metadata?.custom_tags?.forEach(t => tags.add(t));
  });
  
  return {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
  };
};

export default function AISearchBarV2({
  bookmarks,
  onSearch,
  onClear,
  placeholder = '搜索书签...',
}: AISearchBarV2Props) {
  // 使用 useSetState 管理多个相关状态
  const [state, setState] = useSetState({
    query: '',
    filters: defaultFilters,
    showFilters: false,
    showSuggestions: false,
  });

  // 使用 useToggle 管理 AI 开关
  const [isAIActive, { toggle: toggleAI }] = useToggle(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { categories, tags } = extractFilters(bookmarks);

  // 防抖执行搜索
  const { run: debouncedSearch } = useDebounceFn(
    () => {
      onSearch(state.query, state.filters);
      setState({ showSuggestions: false });
    },
    { wait: 300 }
  );

  // 点击外部关闭面板
  useClickAway(() => {
    setState({ showSuggestions: false, showFilters: false });
  }, containerRef);

  // 快捷键支持
  useKeyPress('ctrl.k', (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });

  useKeyPress('esc', () => {
    handleClear();
  });

  // 生成搜索建议（基于防抖后的逻辑）
  const suggestions = (() => {
    if (!state.query.trim()) return [];
    
    const q = state.query.toLowerCase();
    const results: string[] = [];
    
    bookmarks.forEach(b => {
      if (b.title.toLowerCase().includes(q)) {
        results.push(b.title);
      }
    });
    
    tags.forEach(t => {
      if (t.toLowerCase().includes(q)) {
        results.push(`标签: ${t}`);
      }
    });
    
    categories.forEach(c => {
      if (c.toLowerCase().includes(q)) {
        results.push(`分类: ${c}`);
      }
    });
    
    return [...new Set(results)].slice(0, 6);
  })();

  const handleQueryChange = (value: string) => {
    setState({ query: value, showSuggestions: true });
    debouncedSearch();
  };

  const handleClear = () => {
    setState({ query: '', filters: defaultFilters, showSuggestions: false });
    onClear();
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    const cleanQuery = suggestion.replace(/^(标签|分类): /, '');
    setState({ query: cleanQuery, showSuggestions: false });
    onSearch(cleanQuery, state.filters);
  };

  const toggleFilter = (type: 'categories' | 'tags', value: string) => {
    setState((prev) => ({
      filters: {
        ...prev.filters,
        [type]: prev.filters[type].includes(value)
          ? prev.filters[type].filter((v) => v !== value)
          : [...prev.filters[type], value],
      },
    }));
  };

  const hasActiveFilters = 
    state.filters.categories.length > 0 ||
    state.filters.tags.length > 0 ||
    state.filters.hasAlias !== null ||
    state.filters.isFavorite !== null ||
    state.filters.minVisits !== null;

  return (
    <div ref={containerRef} className="relative">
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={state.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setState({ showSuggestions: true })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch(state.query, state.filters);
              setState({ showSuggestions: false });
            }
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={state.showSuggestions && suggestions.length > 0}
        />
        
        {/* 右侧按钮 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          <button
            onClick={toggleAI}
            className={`p-2 rounded-lg transition-colors ${
              isAIActive 
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={isAIActive ? 'AI 搜索已开启' : 'AI 搜索已关闭'}
          >
            <Sparkles className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setState({ showFilters: !state.showFilters })}
            className={`p-2 rounded-lg transition-colors relative ${
              hasActiveFilters 
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title="筛选"
          >
            <Filter className="w-4 h-4" />
            {hasActiveFilters && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          
          {state.query && (
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* 搜索建议 */}
      {state.showSuggestions && suggestions.length > 0 && (
        <div 
          id="search-suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
        >
          <div className="py-2">
            <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase">
              搜索建议
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                {suggestion.startsWith('标签:') ? (
                  <Tag className="w-4 h-4 text-blue-500" />
                ) : suggestion.startsWith('分类:') ? (
                  <FolderOpen className="w-4 h-4 text-green-500" />
                ) : (
                  <Search className="w-4 h-4 text-gray-400" />
                )}
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 筛选面板 */}
      {state.showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900">高级筛选</span>
            <button
              onClick={() => setState({ filters: defaultFilters })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              重置
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
                分类
              </label>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleFilter('categories', cat)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      state.filters.categories.includes(cat)
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
                标签
              </label>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {tags.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleFilter('tags', tag)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      state.filters.tags.includes(tag)
                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              onSearch(state.query, state.filters);
              setState({ showFilters: false });
            }}
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            应用筛选
          </button>
        </div>
      )}
    </div>
  );
}
