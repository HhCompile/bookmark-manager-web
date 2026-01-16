/**
 * 书签搜索栏组件
 * 提供搜索输入和快速筛选功能
 */

import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';

interface BookmarkSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onClearSearch?: () => void;
  onOpenFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function BookmarkSearchBar({
  searchTerm,
  onSearchTermChange,
  onClearSearch,
  onOpenFilters,
  hasActiveFilters = false,
}: BookmarkSearchBarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSearchTermChange(value);
  };

  const handleClear = () => {
    setInputValue('');
    onClearSearch?.();
  };

  return (
    <div className="flex gap-3 flex-1">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          placeholder="搜索书签标题、URL或标签..."
          className="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      <button
        onClick={onOpenFilters}
        className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 relative ${
          hasActiveFilters
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>筛选</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-1 h-1 bg-white rounded-full"></span>
          </span>
        )}
      </button>
    </div>
  );
}
