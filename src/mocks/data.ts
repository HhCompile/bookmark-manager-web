/**
 * Mock 数据集中管理
 * 所有模拟数据统一从这里导出
 */

import type { Bookmark, BookmarkFolder } from '../types/bookmark';
import type { AISuggestion } from '../api/ai';

// 生成唯一 ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// 书签 Mock 数据
export const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'GitHub - facebook/react',
    url: 'https://github.com/facebook/react',
    alias: 'react-repo',
    category: '前端开发',
    tags: ['前端', 'React', '开源', 'JavaScript'],
    favicon: '⚛️',
    isLocked: false,
    addedDate: new Date('2024-01-15'),
    summary: 'React 官方仓库，用于构建用户界面的 JavaScript 库',
  },
  {
    id: '2',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    category: '文档资源',
    tags: ['Web', '文档', '前端', '参考'],
    favicon: '📚',
    isLocked: false,
    addedDate: new Date('2024-02-01'),
    summary: 'Mozilla 开发者网络，提供 Web 技术的完整文档',
  },
  {
    id: '3',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    alias: 'tailwind',
    category: '前端开发',
    tags: ['CSS', '框架', '前端', 'UI'],
    favicon: '🎨',
    isLocked: false,
    addedDate: new Date('2024-02-10'),
    summary: '实用优先的 CSS 框架',
  },
  {
    id: '4',
    title: 'TypeScript 文档',
    url: 'https://www.typescriptlang.org/docs',
    category: '文档资源',
    tags: ['TypeScript', '文档', '编程'],
    favicon: '📘',
    isLocked: false,
    addedDate: new Date('2024-02-15'),
    summary: 'TypeScript 官方文档',
  },
  {
    id: '5',
    title: 'Dribbble - Design Inspiration',
    url: 'https://dribbble.com',
    alias: 'dribbble',
    category: '设计灵感',
    tags: ['设计', '灵感', 'UI', 'UX'],
    favicon: '🏀',
    isLocked: false,
    addedDate: new Date('2024-03-01'),
    summary: '设计师分享作品的社区',
  },
  {
    id: '6',
    title: 'Figma',
    url: 'https://www.figma.com',
    category: '设计工具',
    tags: ['设计', '工具', '协作', 'UI'],
    favicon: '🎭',
    isLocked: false,
    addedDate: new Date('2024-03-05'),
    summary: '协作设计工具',
  },
  {
    id: '7',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    alias: 'so',
    category: '开发工具',
    tags: ['问答', '编程', '社区'],
    favicon: '💬',
    isLocked: false,
    addedDate: new Date('2024-03-10'),
    summary: '程序员问答社区',
  },
  {
    id: '8',
    title: 'Vite',
    url: 'https://vitejs.dev',
    category: '前端开发',
    tags: ['构建工具', '前端', '开发'],
    favicon: '⚡',
    isLocked: false,
    addedDate: new Date('2024-03-15'),
    summary: '下一代前端构建工具',
  },
  {
    id: '9',
    title: 'shadcn/ui',
    url: 'https://ui.shadcn.com',
    category: '前端开发',
    tags: ['React', '组件库', 'UI', '开源'],
    favicon: '🧩',
    isLocked: false,
    addedDate: new Date('2024-03-20'),
    summary: '基于 Radix UI 和 Tailwind CSS 的组件库',
  },
  {
    id: '10',
    title: '个人学习笔记 - Notion',
    url: 'https://notion.so/my-notes',
    alias: 'notes',
    category: '学习资料',
    tags: ['笔记', '生产力', '个人'],
    favicon: '📝',
    isLocked: true,
    addedDate: new Date('2024-03-25'),
    annotations: ['这是我的个人笔记', '包含学习心得'],
  },
  {
    id: '11',
    title: 'React Performance Patterns',
    url: 'https://example.com/react-perf',
    category: '学习资料',
    tags: ['React', '性能', '优化'],
    favicon: '🚀',
    isLocked: false,
    addedDate: new Date('2024-03-28'),
    summary: 'React 性能优化最佳实践',
  },
  {
    id: '12',
    title: 'Old Blog Site',
    url: 'https://old-blog-example.com',
    category: '其他',
    tags: ['博客', '旧链接'],
    favicon: '🔗',
    isLocked: false,
    addedDate: new Date('2023-01-01'),
    isDead: true,
  },
];

// 文件夹 Mock 数据
export const mockFolders: BookmarkFolder[] = [
  { id: '1', name: '前端开发', bookmarks: ['1', '3', '8', '9'] },
  { id: '2', name: '设计灵感', bookmarks: ['5', '6'] },
  { id: '3', name: '文档资源', bookmarks: ['2', '4'] },
  { id: '4', name: '开发工具', bookmarks: ['7'] },
  { id: '5', name: '学习资料', bookmarks: ['10', '11'] },
  { id: '6', name: '其他', bookmarks: ['12'] },
];

// AI 建议 Mock 数据
export const mockAISuggestions: AISuggestion[] = [
  {
    id: 'ai-1',
    bookmarkId: '1',
    bookmarkTitle: 'GitHub - facebook/react',
    originalCategory: '未分类',
    suggestedCategory: '前端开发',
    suggestedAlias: 'react-repo',
    suggestedTags: ['前端', 'React', '开源', 'JavaScript'],
    confidence: 'high',
    reason: '检测到 GitHub 链接和 React 关键词，高度确定属于前端开发分类',
  },
  {
    id: 'ai-2',
    bookmarkId: '5',
    bookmarkTitle: 'Dribbble - Design Inspiration',
    originalCategory: '未分类',
    suggestedCategory: '设计灵感',
    suggestedAlias: 'dribbble',
    suggestedTags: ['设计', '灵感', 'UI', 'UX'],
    confidence: 'high',
    reason: '检测到 Dribbble 设计网站，确定属于设计灵感分类',
  },
  {
    id: 'ai-3',
    bookmarkId: '10',
    bookmarkTitle: '个人学习笔记 - Notion',
    originalCategory: '未分类',
    suggestedCategory: '学习资料',
    suggestedAlias: 'notes',
    suggestedTags: ['笔记', '生产力', '个人'],
    confidence: 'medium',
    reason: 'Notion 可能属于"学习资料"或"工作"分类，需要手动确认',
  },
  {
    id: 'ai-4',
    bookmarkId: '12',
    bookmarkTitle: 'Old Blog Site',
    originalCategory: '未分类',
    suggestedCategory: '其他',
    suggestedTags: ['博客', '旧链接'],
    confidence: 'low',
    reason: '链接可能已失效，建议检查或删除',
  },
];

// 统计数据 Mock
export const mockStats = {
  totalBookmarks: 1247,
  weeklyUsers: 389,
  aiClassifications: 5621,
  avgPerUser: 14,
};

// 同步进度 Mock 数据
export const mockSyncProgress = {
  total: 150,
  current: 150,
  items: [
    '正在连接 Chrome...',
    '正在抓取书签 (12/150)...',
    '正在抓取书签 (45/150)...',
    '正在抓取书签 (89/150)...',
    '正在抓取书签 (120/150)...',
    '正在抓取书签 (150/150)...',
    'AI 预处理中...',
    '同步完成！',
  ],
};

// 任务 Mock 数据
export interface MockTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  priority: 'high' | 'medium' | 'low';
  source: 'user' | 'system' | 'ai';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
}

export const mockTasks: MockTask[] = [
  {
    id: '1',
    title: '构建项目',
    description: '运行 pnpm run build 构建生产版本',
    status: 'completed',
    progress: 100,
    priority: 'high',
    source: 'user',
    createdAt: new Date('2026-02-04T10:00:00'),
    startedAt: new Date('2026-02-04T10:00:10'),
    completedAt: new Date('2026-02-04T10:01:30'),
  },
  {
    id: '2',
    title: 'AI 智能分类',
    description: '对 50 个新书签进行 AI 分类',
    status: 'in_progress',
    progress: 65,
    priority: 'high',
    source: 'ai',
    createdAt: new Date('2026-02-04T10:02:00'),
    startedAt: new Date('2026-02-04T10:02:15'),
  },
  {
    id: '3',
    title: '质量检查',
    description: '检查失效链接和重复书签',
    status: 'pending',
    progress: 0,
    priority: 'medium',
    source: 'system',
    createdAt: new Date('2026-02-04T10:04:00'),
  },
];

// 文章示例（用于阅读器）
export const mockArticleContent = `
# React 性能优化指南

React 是一个用于构建用户界面的 JavaScript 库。它的核心概念是组件化，允许开发者将复杂的 UI 拆分成独立、可复用的组件。

## 为什么需要性能优化？

随着应用规模的增长，性能问题会逐渐显现。常见的性能问题包括：
- 不必要的重新渲染
- 大型列表渲染缓慢
- 状态更新导致的卡顿

## 优化技巧

### 1. 使用 React.memo
React.memo 是一个高阶组件，可以防止不必要的重新渲染。当组件的 props 没有变化时，它会跳过渲染。

### 2. 使用 useMemo 和 useCallback
这两个 Hook 可以帮助你缓存昂贵的计算结果和函数引用。

### 3. 虚拟化长列表
对于包含大量数据的列表，使用虚拟化技术可以显著提升性能。

## 总结

性能优化是一个持续的过程，需要根据实际情况选择合适的优化策略。
`;

// 标签颜色映射
export const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

// 根据标签名称获取颜色
export const getTagColor = (tagName: string): string => {
  const hash = tagName
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tagColors[hash % tagColors.length];
};
