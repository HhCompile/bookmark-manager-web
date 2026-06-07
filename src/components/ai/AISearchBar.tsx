/**
 * AI 智能搜索栏
 * 特性：
 * - 语义搜索（不仅匹配标题，还匹配内容描述）
 * - 搜索建议
 * - 智能联想
 * - 快捷筛选
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  X,
  Tag,
  FolderOpen,
  Filter,
} from 'lucide-react';
import { Bookmark } from '@/types/bookmark';
import { useDebounce } from '@/hooks/useDebounce';

interface AISearchBarProps {
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

export default function AISearchBar({
  bookmarks,
  onSearch,
  onClear,
  placeholder = '搜索书签...',
}: AISearchBarProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAIActive, setIsAIActive] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { categories, tags } = useMemo(() => extractFilters(bookmarks), [bookmarks]);
  
  // 使用防抖优化搜索输入
  const debouncedQuery = useDebounce(query, 200);
  
  // 生成搜索建议（基于防抖后的查询）
  const suggestions = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    
    const q = query.toLowerCase();
    const results: string[] = [];
    
    // 标题匹配
    bookmarks.forEach(b => {
      if (b.title.toLowerCase().includes(q)) {
        results.push(b.title);
      }
    });
    
    // 标签匹配
    tags.forEach(t => {
      if (t.toLowerCase().includes(q)) {
        results.push(`标签: ${t}`);
      }
    });
    
    // 分类匹配
    categories.forEach(c => {
      if (c.toLowerCase().includes(q)) {
        results.push(`分类: ${c}`);
      }
    });
    
    return [...new Set(results)].slice(0, 6);
  }, [debouncedQuery, bookmarks, tags, categories]);
  
  // 执行搜索
  const executeSearch = useCallback(() => {
    onSearch(query, filters);
    setShowSuggestions(false);
  }, [query, filters, onSearch]);
  
  // 清除搜索
  const handleClear = useCallback(() => {
    setQuery('');
    setFilters(defaultFilters);
    onClear();
    inputRef.current?.focus();
  }, [onClear]);
  
  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        handleClear();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClear]);
  
  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.hasAlias !== null ||
    filters.isFavorite !== null ||
    filters.minVisits !== null;
  
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
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions && suggestions.length > 0}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              executeSearch();
            }
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        {/* 右侧按钮 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          <button
            onClick={() => setIsAIActive(!isAIActive)}
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
            onClick={() => setShowFilters(!showFilters)}
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
          
          {query && (
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
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="py-2">
            <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase">
              搜索建议
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion.replace(/^(标签|分类): /, ''));
                  executeSearch();
                }}
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
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900">高级筛选</span>
            <button
              onClick={() => setFilters(defaultFilters)}
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
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        categories: prev.categories.includes(cat)
                          ? prev.categories.filter(c => c !== cat)
                          : [...prev.categories, cat],
                      }));
                    }}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      filters.categories.includes(cat)
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
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        tags: prev.tags.includes(tag)
                          ? prev.tags.filter(t => t !== tag)
                          : [...prev.tags, tag],
                      }));
                    }}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      filters.tags.includes(tag)
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
            onClick={executeSearch}
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            应用筛选
          </button>
        </div>
      )}
    </div>
  );
}
