/**
 * 树形视图
 * 使用 ahooks 的 useSetState 优化状态管理
 * 按分类展示书签
 */

import { memo, useCallback, useMemo } from 'react';
import { useSetState } from 'ahooks';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Bookmark } from '@/contexts/BookmarkContext';
import { formatDate, buildBookmarkTree } from '@/utils';
import type { BookmarkTreeNode } from '@/utils/bookmark';

interface TreeViewProps {
  bookmarks: Bookmark[];
}

interface TreeNodeState {
  expandedIds: Set<string>;
}

// 树节点组件
interface TreeNodeComponentProps {
  node: BookmarkTreeNode;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const TreeNodeComponent = memo(({ 
  node, 
  level, 
  isExpanded, 
  onToggle 
}: TreeNodeComponentProps) => {
  const handleQuickOpen = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  const indent = level * 24;

  // 文件夹节点
  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => onToggle(node.id)}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
          style={{ paddingLeft: `${indent + 16}px` }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <Folder className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-900">{node.name}</span>
          <span className="text-sm text-gray-500">
            ({node.children?.length || 0})
          </span>
        </button>

        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                isExpanded={false}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 书签节点
  if (node.bookmark) {
    const bookmark = node.bookmark;
    return (
      <div
        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
        style={{ paddingLeft: `${indent + 40}px` }}
      >
        <FileText className="w-4 h-4 text-gray-400" />
        <span className="text-xl">{bookmark.favicon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 truncate" title={bookmark.title}>
              {bookmark.title}
            </p>
            {bookmark.alias && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                {bookmark.alias}
              </span>
            )}
            {bookmark.isLocked && (
              <Lock className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate" title={bookmark.url}>
            {bookmark.url}
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(bookmark.addedDate)}
        </span>
        <button
          onClick={() => handleQuickOpen(bookmark.url)}
          className="p-2 opacity-0 group-hover:opacity-100 text-blue-600 hover:bg-blue-50 rounded transition-all"
          title="快速打开"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
});

TreeNodeComponent.displayName = 'TreeNodeComponent';

// 主组件
function TreeView({ bookmarks }: TreeViewProps) {
  // 使用 ahooks 的 useSetState 管理展开状态
  const [state, setState] = useSetState<TreeNodeState>({
    expandedIds: new Set(),
  });

  // 使用 useMemo 缓存树结构
  const tree = useMemo(() => {
    const treeData = buildBookmarkTree(bookmarks);
    // 默认展开所有分类
    const expandedIds = new Set(treeData.map((node) => node.id));
    setState({ expandedIds });
    return treeData;
  }, [bookmarks, setState]);

  // 切换文件夹展开状态
  const toggleFolder = useCallback((folderId: string) => {
    setState((prev) => {
      const newExpandedIds = new Set(prev.expandedIds);
      if (newExpandedIds.has(folderId)) {
        newExpandedIds.delete(folderId);
      } else {
        newExpandedIds.add(folderId);
      }
      return { expandedIds: newExpandedIds };
    });
  }, [setState]);

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-12 text-center text-gray-500">暂无书签</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-h-[calc(100vh-280px)] overflow-auto">
      <div className="divide-y divide-gray-100">
        {tree.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            isExpanded={state.expandedIds.has(node.id)}
            onToggle={toggleFolder}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(TreeView);
