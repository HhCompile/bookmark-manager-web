import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Bookmark } from '../../contexts/BookmarkContext';
import { useState } from 'react';

interface TreeViewProps {
  bookmarks: Bookmark[];
}

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'bookmark';
  children?: TreeNode[];
  bookmark?: Bookmark;
  isExpanded?: boolean;
}

export default function TreeView({ bookmarks }: TreeViewProps) {
  // 将书签按分类组织成树状结构
  const buildTree = (): TreeNode[] => {
    const categoryMap: { [key: string]: Bookmark[] } = {};

    bookmarks.forEach(bookmark => {
      const category = bookmark.category || '未分类';
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(bookmark);
    });

    return Object.entries(categoryMap).map(([category, items]) => ({
      id: category,
      name: category,
      type: 'folder' as const,
      isExpanded: true,
      children: items.map(bookmark => ({
        id: bookmark.id,
        name: bookmark.title,
        type: 'bookmark' as const,
        bookmark,
      })),
    }));
  };

  const [tree, setTree] = useState<TreeNode[]>(buildTree());

  const toggleFolder = (folderId: string) => {
    setTree(prev =>
      prev.map(node => {
        if (node.id === folderId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        return node;
      })
    );
  };

  const handleQuickOpen = (url: string) => {
    window.open(url, '_blank');
  };

  const TreeNodeComponent = ({
    node,
    level = 0,
  }: {
    node: TreeNode;
    level?: number;
  }) => {
    const indent = level * 24;

    if (node.type === 'folder') {
      return (
        <div>
          <button
            onClick={() => toggleFolder(node.id)}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
            style={{ paddingLeft: `${indent + 16}px` }}
          >
            {node.isExpanded ? (
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

          {node.isExpanded && node.children && (
            <div>
              {node.children.map(child => (
                <TreeNodeComponent
                  key={child.id}
                  node={child}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Bookmark node
    if (node.bookmark) {
      return (
        <div
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
          style={{ paddingLeft: `${indent + 40}px` }}
        >
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-xl">{node.bookmark.favicon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {node.bookmark.title}
              </p>
              {node.bookmark.alias && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                  {node.bookmark.alias}
                </span>
              )}
              {node.bookmark.isLocked && (
                <Lock className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {node.bookmark.url}
            </p>
          </div>
          <button
            onClick={() => handleQuickOpen(node.bookmark!.url)}
            className="p-2 opacity-0 group-hover:opacity-100 text-blue-600 hover:bg-blue-50 rounded transition-all"
            title="快速打开"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {bookmarks.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-500">暂无书签</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {tree.map(node => (
            <TreeNodeComponent key={node.id} node={node} />
          ))}
        </div>
      )}
    </div>
  );
}
