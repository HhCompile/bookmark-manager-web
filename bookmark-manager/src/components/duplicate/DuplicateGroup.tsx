import { useState } from 'react';
import { 
  ChevronDown, 
  ExternalLink, 
  Trash2, 
  Check, 
  Folder, 
  Tag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Bookmark {
  url: string;
  title: string;
  category?: string;
  tags?: string[];
}

interface DuplicateGroupProps {
  group: Bookmark[];
  groupIndex: number;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelection: (index: number) => void;
  onToggleExpand: (index: number) => void;
  onDelete: (url: string) => void;
  onKeepSelected: (group: Bookmark[], selectedIndex: number) => void;
}

export default function DuplicateGroup({
  group,
  groupIndex,
  isSelected,
  isExpanded,
  onToggleSelection,
  onToggleExpand,
  onDelete,
  onKeepSelected
}: DuplicateGroupProps) {
  return (
    <div className="card">
      {/* 重复组头部 */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(groupIndex)}
              className="h-4 w-4 text-primary rounded border-input focus:ring-primary mr-3"
            />
            <div>
              <h4 className="font-medium text-text-primary">
                {group[0].title || group[0].url}
              </h4>
              <p className="text-text-secondary text-sm mt-1">
                发现 {group.length} 个重复项
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (window.confirm(`确定要保留第一个书签并删除其他 ${group.length - 1} 个重复项吗？`)) {
                  onKeepSelected(group, 0);
                }
              }}
              className="text-sm text-primary hover:text-primary-dark hover:underline transition-colors"
            >
              保留首个
            </button>
            <button
              onClick={() => onToggleExpand(groupIndex)}
              className="text-text-secondary hover:text-primary p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* 展开的详细内容 */}
      {isExpanded && (
        <div className="p-5 border-b border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    标题
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    分类
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    标签
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {group.map((bookmark, index) => (
                  <tr key={index} className={index === 0 ? "bg-success/5" : ""}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-text-primary">
                        {bookmark.title || '无标题'}
                        {index === 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                            <Check className="w-3 h-3 mr-1" />
                            保留
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-text-secondary max-w-xs truncate">
                        <a 
                          href={bookmark.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline transition-colors"
                        >
                          {bookmark.url}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {bookmark.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <Folder className="w-3 h-3 mr-1" />
                          {bookmark.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {bookmark.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
                            >
                              <Tag className="w-2.5 h-2.5 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {bookmark.tags.length > 2 && (
                            <span className="text-xs text-text-secondary">+{bookmark.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => window.open(bookmark.url, '_blank')}
                        className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      {index > 0 && (
                        <button 
                          onClick={() => onDelete(bookmark.url)}
                          className="text-error hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 组操作按钮 */}
          <div className="flex justify-end space-x-3 mt-5">
            <Button
              onClick={() => {
                if (window.confirm(`确定要保留第一个书签并删除其他 ${group.length - 1} 个重复项吗？`)) {
                  onKeepSelected(group, 0);
                }
              }}
              variant="default"
            >
              <Check className="w-4 h-4 mr-2" />
              保留第一个并删除其他
            </Button>
            <Button
              onClick={() => {
                if (window.confirm(`确定要删除这 ${group.length - 1} 个重复项吗？`)) {
                  const bookmarksToDelete = group.slice(1);
                  bookmarksToDelete.forEach(bookmark => {
                    onDelete(bookmark.url);
                  });
                }
              }}
              variant="secondary"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              删除重复项（保留第一个）
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}