# 智能书签组件使用示例

## 新组件概览

### 1. Favicon 图标组件
```tsx
import { Favicon, FaviconSmall, FaviconLarge } from './components';

// 基础使用
<Favicon url="https://github.com" size={32} />

// 小尺寸（列表用）
<FaviconSmall url="https://github.com" size={20} />

// 大尺寸（卡片用）
<FaviconLarge url="https://github.com" size={64} />
```

### 2. 智能列表视图 (SmartListView)
```tsx
import { SmartListView } from './components';

// 基础使用
<SmartListView 
  bookmarks={bookmarks}
  showAIInsights={true}
/>

// 完整功能
<SmartListView 
  bookmarks={bookmarks}
  onEdit={(bookmark) => openEditModal(bookmark)}
  onDelete={(bookmark) => deleteBookmark(bookmark.url)}
  onOpen={(bookmark) => console.log('Opened:', bookmark.title)}
  showAIInsights={true}
/>
```

**特性：**
- ✅ 序号展示
- ✅ 虚拟滚动（支持大量数据）
- ✅ 真实网站图标（从 Google/DuckDuckGo 获取）
- ✅ 别名展示
- ✅ AI 智能分类标签
- ✅ 访问次数统计
- ✅ 悬停快捷操作

### 3. 智能卡片视图 (SmartCardView)
```tsx
import { SmartCardView } from './components';

<SmartCardView 
  bookmarks={bookmarks}
  showAIInsights={true}
/>
```

**特性：**
- ✅ 大尺寸真实图标
- ✅ 渐变色卡片背景（根据访问频次）
- ✅ 别名展示
- ✅ AI 分类标签
- ✅ 访问统计可视化
- ✅ 一键复制链接

### 4. 智能树状视图 (SmartTreeView)
```tsx
import { SmartTreeView } from './components';

<SmartTreeView 
  bookmarks={bookmarks}
  folders={folders}
  showAIInsights={true}
/>
```

**特性：**
- ✅ 文件夹层级展示
- ✅ 可折叠/展开
- ✅ 图标展示
- ✅ 访问统计

### 5. AI 智能搜索栏 (AISearchBar)
```tsx
import { AISearchBar } from './components';
import type { SearchFilters } from './components';

const [filters, setFilters] = useState<SearchFilters>({
  categories: [],
  tags: [],
  hasAlias: null,
  isFavorite: null,
  minVisits: null,
});

<AISearchBar 
  bookmarks={bookmarks}
  onSearch={(query, filters) => {
    setSearchQuery(query);
    setFilters(filters);
  }}
  onClear={() => {
    setSearchQuery('');
    setFilters(defaultFilters);
  }}
  placeholder="搜索书签..."
/>
```

**特性：**
- ✅ AI 语义搜索（搜索标题、URL、别名、标签、备注）
- ✅ 智能搜索建议
- ✅ 高级筛选（分类、标签、别名、收藏、访问频次）
- ✅ 快捷键支持（Ctrl+K 聚焦，ESC 清除）

### 6. AI 洞察面板 (AIInsightsPanel)
```tsx
import { AIInsightsPanel } from './components';

<AIInsightsPanel bookmarks={bookmarks} />
```

**展示内容：**
- ✅ 书签统计（总数、收藏、别名、访问）
- ✅ 热门分类和标签
- ✅ 高频访问书签 TOP3
- ✅ AI 智能建议

### 7. AI 批量操作 (AIBatchActions)
```tsx
import { AIBatchActions } from './components';

<AIBatchActions 
  bookmarks={bookmarks}
  folders={folders}
  selectedBookmarks={selectedIds}
  onClearSelection={() => setSelectedIds(new Set())}
  onUpdateBookmarks={(urls, updates) => updateBookmarks(urls, updates)}
  onDeleteBookmarks={(urls) => deleteBookmarks(urls)}
  onMoveToFolder={(urls, folderId) => moveToFolder(urls, folderId)}
/>
```

**功能：**
- ✅ 批量移动到文件夹
- ✅ 批量添加标签
- ✅ 批量收藏
- ✅ 批量删除
- ✅ AI 智能整理

## 完整页面示例

```tsx
import { useState } from 'react';
import { 
  SmartListView, 
  SmartCardView, 
  AISearchBar, 
  AIInsightsPanel,
  AIBatchActions 
} from './components';
import { useBookmarkContext } from './contexts';
import type { SearchFilters } from './components';

export default function BookmarkPage() {
  const { 
    bookmarks, 
    folders, 
    filteredBookmarks,
    selectedBookmarks,
    toggleSelection,
    clearSelection 
  } = useBookmarkContext();
  
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [], tags: [], hasAlias: null, isFavorite: null, minVisits: null
  });
  
  return (
    <div className="flex gap-6">
      {/* 左侧主内容 */}
      <div className="flex-1 space-y-4">
        {/* 搜索栏 */}
        <AISearchBar 
          bookmarks={bookmarks}
          onSearch={(query, newFilters) => {
            setSearchQuery(query);
            setFilters(newFilters);
          }}
          onClear={() => {
            setSearchQuery('');
            setFilters({ categories: [], tags: [], hasAlias: null, isFavorite: null, minVisits: null });
          }}
        />
        
        {/* 批量操作 */}
        <AIBatchActions 
          bookmarks={bookmarks}
          folders={folders}
          selectedBookmarks={selectedBookmarks}
          onClearSelection={clearSelection}
          onUpdateBookmarks={(urls, updates) => {/* 更新逻辑 */}}
          onDeleteBookmarks={(urls) => {/* 删除逻辑 */}}
          onMoveToFolder={(urls, folderId) => {/* 移动逻辑 */}}
        />
        
        {/* 视图切换 */}
        <div className="flex justify-end gap-2">
          <button onClick={() => setViewMode('list')}>列表</button>
          <button onClick={() => setViewMode('card')}>卡片</button>
        </div>
        
        {/* 书签列表 */}
        {viewMode === 'list' ? (
          <SmartListView 
            bookmarks={filteredBookmarks}
            showAIInsights={true}
          />
        ) : (
          <SmartCardView 
            bookmarks={filteredBookmarks}
            showAIInsights={true}
          />
        )}
      </div>
      
      {/* 右侧 AI 面板 */}
      <div className="w-80 hidden lg:block">
        <AIInsightsPanel bookmarks={bookmarks} />
      </div>
    </div>
  );
}
```

## 特性对比

| 特性 | 旧视图 | 新智能视图 |
|------|--------|-----------|
| 序号展示 | ❌ | ✅ |
| 虚拟滚动 | ❌ | ✅ |
| 真实图标 | ❌ (emoji) | ✅ (自动获取) |
| 别名展示 | ✅ | ✅ (增强) |
| AI 分类标签 | ❌ | ✅ |
| 访问统计 | ❌ | ✅ |
| 多选功能 | ❌ | ✅ |
| 批量操作 | ❌ | ✅ |
| AI 搜索 | ❌ | ✅ |
| 高级筛选 | ❌ | ✅ |
| 智能建议 | ❌ | ✅ |
