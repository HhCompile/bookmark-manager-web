/**
 * 书签列表组件 - 复合组件模式
 * 提供灵活的书签列表展示方式
 * 
 * 使用示例:
 * <BookmarkList bookmarks={bookmarks}>
 *   <BookmarkList.Header title="我的书签" count={bookmarks.length} />
 *   <BookmarkList.Grid>
 *     {bookmark => <BookmarkCard key={bookmark.id} bookmark={bookmark} />}
 *   </BookmarkList.Grid>
 *   <BookmarkList.Empty description="暂无书签" />
 * </BookmarkList>
 */

import { createContext, useContext, ReactNode } from 'react';
import { Bookmark } from '@/types/bookmark';
import { cn } from '@/components/ui/utils';

// ==================== Context ====================

interface BookmarkListContextValue {
  bookmarks: Bookmark[];
  isLoading: boolean;
  selectedIds: Set<string>;
  onSelect?: (id: string) => void;
  onSelectAll?: () => void;
}

const BookmarkListContext = createContext<BookmarkListContextValue | null>(null);

function useBookmarkList() {
  const context = useContext(BookmarkListContext);
  if (!context) {
    throw new Error('BookmarkList 子组件必须在 BookmarkList 内部使用');
  }
  return context;
}

// ==================== 主组件 ====================

interface BookmarkListProps {
  bookmarks: Bookmark[];
  isLoading?: boolean;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: () => void;
  children: ReactNode;
  className?: string;
}

function BookmarkList({
  bookmarks,
  isLoading = false,
  selectedIds = [],
  onSelect,
  onSelectAll,
  children,
  className,
}: BookmarkListProps) {
  const value: BookmarkListContextValue = {
    bookmarks,
    isLoading,
    selectedIds: new Set(selectedIds),
    onSelect,
    onSelectAll,
  };

  return (
    <BookmarkListContext.Provider value={value}>
      <div className={cn('bookmark-list', className)}>{children}</div>
    </BookmarkListContext.Provider>
  );
}

// ==================== Header 子组件 ====================

interface HeaderProps {
  title: ReactNode;
  count?: number;
  actions?: ReactNode;
  className?: string;
}

function Header({ title, count, actions, className }: HeaderProps) {
  const { bookmarks, selectedIds, onSelectAll } = useBookmarkList();
  const allSelected = bookmarks.length > 0 && selectedIds.size === bookmarks.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < bookmarks.length;

  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 px-4 border-b border-gray-200',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onSelectAll && (
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onChange={onSelectAll}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label="全选"
          />
        )}
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {count !== undefined && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
            {count}
          </span>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ==================== Grid 子组件 ====================

interface GridProps {
  children: (bookmark: Bookmark, index: number) => ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 'auto';
}

function Grid({ children, className, columns = 'auto' }: GridProps) {
  const { bookmarks, isLoading } = useBookmarkList();

  if (isLoading) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  };

  return (
    <div className={cn('grid gap-4 p-4', gridClasses[columns], className)}>
      {bookmarks.map((bookmark, index) => children(bookmark, index))}
    </div>
  );
}

// ==================== List 子组件 ====================

interface ListProps {
  children: (bookmark: Bookmark, index: number) => ReactNode;
  className?: string;
}

function List({ children, className }: ListProps) {
  const { bookmarks, isLoading } = useBookmarkList();

  if (isLoading) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-gray-200', className)}>
      {bookmarks.map((bookmark, index) => children(bookmark, index))}
    </div>
  );
}

// ==================== Empty 子组件 ====================

interface EmptyProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function Empty({
  icon,
  title = '暂无数据',
  description = '列表为空',
  action,
  className,
}: EmptyProps) {
  const { bookmarks, isLoading } = useBookmarkList();

  // 有数据或加载中时不显示
  if (bookmarks.length > 0 || isLoading) {
    return null;
  }

  return (
    <div className={cn('p-12 text-center', className)}>
      {icon || (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
      )}
      <h4 className="text-lg font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-500 mb-4">{description}</p>
      {action && <div className="flex justify-center gap-3">{action}</div>}
    </div>
  );
}

// ==================== Footer 子组件 ====================

interface FooterProps {
  children: ReactNode;
  className?: string;
}

function Footer({ children, className }: FooterProps) {
  const { bookmarks } = useBookmarkList();

  if (bookmarks.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'py-3 px-4 border-t border-gray-200 bg-gray-50 rounded-b-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

// ==================== 绑定子组件 ====================

BookmarkList.Header = Header;
BookmarkList.Grid = Grid;
BookmarkList.List = List;
BookmarkList.Empty = Empty;
BookmarkList.Footer = Footer;

export { BookmarkList };
export default BookmarkList;
