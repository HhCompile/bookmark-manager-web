/**
 * 智能树状视图
 * 特性：
 * - 文件夹层级展示
 * - 真实图标
 * - 别名展示
 * - 可折叠/展开
 * - 拖拽排序支持（预留）
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  ExternalLink,
  Lock,
  AlertCircle,
  Star,
  Sparkles,
  TrendingUp,
  
} from 'lucide-react';
import { Bookmark, BookmarkFolder } from '@/types/bookmark';
import Favicon from '@/components/ui/Favicon';
import { useRecordBookmarkVisit } from '@/api/bookmarks';

interface SmartTreeViewProps {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
  onOpen?: (bookmark: Bookmark) => void;
  showAIInsights?: boolean;
}

interface TreeNode {
  id: string;
  type: 'folder' | 'bookmark';
  name: string;
  bookmark?: Bookmark;
  folder?: BookmarkFolder;
  children: TreeNode[];
  level: number;
}

// 标签颜色
const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-yellow-100 text-yellow-700',
];

const getTagColor = (tagName: string) => {
  const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tagColors[hash % tagColors.length];
};

export default function SmartTreeView({
  bookmarks,
  folders,
  onEdit: _onEdit,
  onDelete: _onDelete,
  onOpen,
  showAIInsights = true,
}: SmartTreeViewProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const recordVisitMutation = useRecordBookmarkVisit();
  
  // 构建树形结构
  const treeData = useMemo(() => {
    const folderMap = new Map<string, BookmarkFolder>();
    const bookmarkMap = new Map<string, Bookmark[]>();
    
    // 建立文件夹映射
    folders.forEach(folder => {
      folderMap.set(folder.id, folder);
      bookmarkMap.set(folder.id, []);
    });
    
    // 按文件夹ID分组书签
    bookmarks.forEach(bookmark => {
      const folderId = bookmark.metadata?.folder_id || 'uncategorized';
      if (!bookmarkMap.has(folderId)) {
        bookmarkMap.set(folderId, []);
      }
      bookmarkMap.get(folderId)!.push(bookmark);
    });
    
    // 递归构建树
    const buildTree = (folderId: string, level: number): TreeNode[] => {
      const nodes: TreeNode[] = [];
      
      // 添加该文件夹下的书签
      const folderBookmarks = bookmarkMap.get(folderId) || [];
      folderBookmarks.forEach(bookmark => {
        nodes.push({
          id: bookmark.id || bookmark.url,
          type: 'bookmark',
          name: bookmark.title,
          bookmark,
          children: [],
          level,
        });
      });
      
      // 添加子文件夹
      const childFolders = folders.filter(f => f.parentId === folderId);
      childFolders.forEach(folder => {
        nodes.push({
          id: folder.id,
          type: 'folder',
          name: folder.name,
          folder,
          children: buildTree(folder.id, level + 1),
          level,
        });
      });
      
      return nodes;
    };
    
    // 根节点
    const rootNodes: TreeNode[] = [
      {
        id: 'all',
        type: 'folder',
        name: '全部书签',
        children: buildTree('uncategorized', 0),
        level: 0,
      },
    ];
    
    // 添加根级文件夹
    const rootFolders = folders.filter(f => !f.parentId);
    rootFolders.forEach(folder => {
      rootNodes.push({
        id: folder.id,
        type: 'folder',
        name: folder.name,
        folder,
        children: buildTree(folder.id, 0),
        level: 0,
      });
    });
    
    return rootNodes;
  }, [bookmarks, folders]);
  
  // 切换文件夹展开/折叠
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);
  
  // 打开书签
  const handleOpen = useCallback((bookmark: Bookmark) => {
    recordVisitMutation.mutate({ url: bookmark.url });
    window.open(bookmark.url, '_blank');
    onOpen?.(bookmark);
  }, [onOpen, recordVisitMutation]);
  
  // 渲染树节点
  const renderNode = (node: TreeNode): React.ReactElement => {
    const isExpanded = expandedFolders.has(node.id);
    const hasChildren = node.children.length > 0;
    
    if (node.type === 'folder') {
      return (
        <div key={node.id} className="select-none">
          {/* 文件夹标题 */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            style={{ paddingLeft: `${node.level * 24 + 12}px` }}
            onClick={() => hasChildren && toggleFolder(node.id)}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )
            ) : (
              <span className="w-4" />
            )}
            
            {isExpanded ? (
              <FolderOpen className="w-5 h-5 text-blue-500" />
            ) : (
              <Folder className="w-5 h-5 text-gray-400" />
            )}
            
            <span className="font-medium text-gray-700">{node.name}</span>
            
            {hasChildren && (
              <span className="text-xs text-gray-400">
                ({node.children.length})
              </span>
            )}
          </div>
          
          {/* 子节点 */}
          {isExpanded && hasChildren && (
            <div className="mt-1">
              {node.children.map(child => renderNode(child))}
            </div>
          )}
        </div>
      );
    }
    
    // 书签节点
    const bookmark = node.bookmark!;
    const metadata = bookmark.metadata;
    const alias = metadata?.alias || bookmark.alias;
    const isFavorite = metadata?.is_favorite;
    const visitCount = metadata?.visit_count || 0;
    const customTags = metadata?.custom_tags || [];
    const allTags = [...bookmark.tags, ...customTags];
    
    return (
      <div
        key={node.id}
        className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
        style={{ paddingLeft: `${node.level * 24 + 36}px` }}
        onClick={() => handleOpen(bookmark)}
      >
        {/* 图标 */}
        <Favicon url={bookmark.url} size={24} />
        
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">
              {bookmark.title}
            </span>
            
            {/* 别名 */}
            {alias && (
              <span className="flex-shrink-0 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                {alias}
              </span>
            )}
            
            {/* AI 分类 */}
            {showAIInsights && bookmark.category && (
              <span className="flex-shrink-0 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {bookmark.category}
              </span>
            )}
            
            {/* 状态图标 */}
            {isFavorite && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
            {bookmark.isLocked && (
              <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            )}
            {bookmark.isDead && (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
          </div>
          
          {/* URL 和标签 */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500 truncate max-w-[300px]">
              {bookmark.url}
            </span>
            
            {allTags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
            {allTags.length > 2 && (
              <span className="text-xs text-gray-400">+{allTags.length - 2}</span>
            )}
          </div>
        </div>
        
        {/* 访问统计 */}
        {visitCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            {visitCount}
          </div>
        )}
        
        {/* 打开按钮 */}
        <button
          className="opacity-0 group-hover:opacity-100 p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-all"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen(bookmark);
          }}
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">文件夹视图</span>
        </div>
        <div className="text-sm text-gray-500">
          {bookmarks.length} 个书签 · {folders.length} 个文件夹
        </div>
      </div>
      
      {/* 树内容 */}
      <div className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {treeData.map(node => renderNode(node))}
      </div>
    </div>
  );
}
