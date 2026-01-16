/**
 * 书签筛选面板组件
 * 提供分类、标签、有效性等筛选选项
 */

import { X, Filter } from 'lucide-react';
import { useState } from 'react';
import type { BookmarkFilters } from '../../types';

interface FilterPanelProps {
  filters: BookmarkFilters;
  onFiltersChange: (filters: Partial<BookmarkFilters>) => void;
  categories: string[];
  tags: string[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  categories,
  tags,
  isOpen = false,
  onClose,
}: FilterPanelProps) {
  const [localCategories] = useState(categories);
  const [localTags] = useState(tags);

  if (!isOpen) return null;

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ category: category === filters.category ? undefined : category });
  };

  const handleTagChange = (tag: string) => {
    const currentTags = filters.tag ? [filters.tag] : [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onFiltersChange({ tag: newTags.length > 0 ? newTags[0] : undefined });
  };

  const handleValidityChange = (validity: 'valid' | 'invalid' | 'all') => {
    onFiltersChange({ validity: validity === filters.validity ? undefined : validity });
  };

  const clearAll = () => {
    onFiltersChange({
      searchTerm: undefined,
      category: undefined,
      tag: undefined,
      validity: undefined,
    });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end pt-16 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">筛选</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !filters.category
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                全部
              </button>
              {localCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.category === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>
            <div className="flex flex-wrap gap-2">
              {localTags.slice(0, 12).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.tag === tag
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              有效性
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleValidityChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.validity === 'all' || !filters.validity
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => handleValidityChange('valid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.validity === 'valid'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                有效
              </button>
              <button
                onClick={() => handleValidityChange('invalid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.validity === 'invalid'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                无效
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between p-5 border-t border-gray-200 bg-gray-50">
          <button
            onClick={clearAll}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            清除筛选
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
