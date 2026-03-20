# AGENTS.md - AI Coding Agent Guide

> 本文件为 AI 编码代理提供项目背景、技术栈、架构和开发指南。
> 项目语言：中文（注释和文档）、英文（代码）

## 项目概述

**智能书签管理系统** (Bookmark Manager) 是一个基于 React + TypeScript 的现代 Web 应用，用于管理和优化浏览器书签。项目采用 Vite 作为构建工具，Tailwind CSS 进行样式设计，集成了 Radix UI 组件库和 Framer Motion 动画库。

### 核心功能

- **Chrome 书签同步**: 通过 Chrome API 实现书签双向同步
- **HTML 导入**: 支持从浏览器导出的 HTML 书签文件导入
- **AI 智能优化**: 自动分类、生成别名、提取标签
- **书签管理**: 三种视图模式（列表/卡片/树状）、全文搜索、批注高亮
- **数据分析**: 可视化标签云、分类统计、使用洞察
- **质量监控**: 检测重复链接、失效书签、健康度评分
- **隐私空间**: 加密保护敏感书签，安全存储学习笔记

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18.3.1 |
| 语言 | TypeScript 5.x |
| 构建工具 | Vite 6.3.5 |
| 样式 | Tailwind CSS 4.1.12 |
| UI 组件 | Radix UI + shadcn/ui |
| 动画 | Framer Motion (motion/react) |
| 状态管理 | React Context + Hooks |
| 图标 | Lucide React |
| 测试 | Jest 30.x + Testing Library |
| 代码质量 | ESLint 9.x + Prettier 3.x |
| 包管理 | pnpm |

## 项目结构

```
bookmark-manager-web/
├── src/
│   ├── App.tsx              # 根组件，路由和状态管理
│   ├── main.tsx             # 应用入口
│   ├── common/              # 公共业务组件
│   │   ├── AIConfirmationPanel.tsx
│   │   ├── AIDemoPanel.tsx
│   │   ├── QualityMonitor.tsx
│   │   ├── SyncProgress.tsx
│   │   └── TagCloudVisualization.tsx
│   ├── components/          # 组件目录
│   │   ├── fallback/        # 降级组件
│   │   ├── home/            # 首页相关组件
│   │   ├── ui/              # UI 基础组件 (shadcn/ui)
│   │   ├── upload/          # 上传相关组件
│   │   └── views/           # 视图组件 (列表/卡片/树状)
│   ├── contexts/            # React Context
│   │   └── BookmarkContext.tsx
│   ├── hooks/               # 自定义 Hooks
│   │   └── useChromeBookmarks.ts
│   ├── layout/              # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ReaderSidebar.tsx
│   ├── pages/               # 页面组件
│   │   ├── home/HomePage.tsx
│   │   └── bookmark/
│   │       ├── BookmarkView.tsx
│   │       └── PrivateVault.tsx
│   ├── services/            # API 服务层
│   ├── styles/              # 全局样式
│   │   ├── index.css        # 样式入口
│   │   ├── tailwind.css     # Tailwind 导入
│   │   └── theme.css        # 主题变量
│   ├── types/               # TypeScript 类型定义
│   │   └── bookmark.ts
│   └── utils/               # 工具函数
│       ├── analytics.ts     # Google Analytics
│       └── env.ts           # 环境变量
├── index.html               # HTML 模板
├── vite.config.ts           # Vite 配置
├── tailwind.config.ts       # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
├── eslint.config.js         # ESLint 配置 (v9+ 扁平格式)
├── jest.config.js           # Jest 测试配置
├── prettier.config.mjs      # Prettier 配置
└── package.json             # 依赖管理
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发服务器 (端口 3000)
pnpm run dev

# 生产构建
pnpm run build

# 运行测试
pnpm run test

# 测试监视模式
pnpm run test:watch

# 测试覆盖率
pnpm run test:coverage
```

## 代码风格指南

### TypeScript 规范

- 严格模式启用 (`strict: true`)
- 禁用 `any` 类型 (`@typescript-eslint/no-explicit-any: error`)
- 未使用变量报错 (`@typescript-eslint/no-unused-vars: error`)
- 使用路径别名 `@/` 指向 `src/` 目录

### React 规范

- 函数组件 + Hooks，不使用类组件
- Props 类型使用接口定义
- 使用 `React.memo` 和 `useMemo`/`useCallback` 优化性能
- React Refresh 仅导出组件 (`react-refresh/only-export-components`)

### 命名规范

- 组件文件: PascalCase (如 `Button.tsx`)
- 工具文件: camelCase (如 `useBookmarks.ts`)
- 类型定义: PascalCase (如 `Bookmark`)
- 常量: UPPER_SNAKE_CASE

### 组件结构

```tsx
// 1. 导入 (按类型分组)
import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/components/ui/utils';

// 2. 类型定义
interface Props {
  title: string;
}

// 3. 组件实现
export default function Component({ title }: Props) {
  // hooks 调用
  // 状态管理
  // 副作用
  // 回调函数
  
  return (
    // JSX
  );
}
```

## 样式系统

### Tailwind CSS v4

项目使用 Tailwind CSS v4，配置在 `src/styles/theme.css` 中定义 CSS 变量。

```css
/* 常用工具类 */
bg-background       /* 背景色 */
text-foreground     /* 文字色 */
border-border       /* 边框色 */
rounded-md          /* 圆角 */
p-4                 /* 内边距 */
```

### 主题变量

定义在 `src/styles/theme.css`:

- `--primary`: 主色 (#030213)
- `--secondary`: 辅助色
- `--destructive`: 错误色 (#d4183d)
- `--muted`: 静音背景
- `--radius`: 圆角大小 (0.625rem)

### 响应式断点

- 移动设备: 默认
- 平板: `md:` (768px)
- 桌面: `lg:` (1024px)
- 大屏幕: `xl:` (1280px)

## 状态管理

### BookmarkContext

核心状态管理，提供：

```typescript
interface BookmarkContextType {
  bookmarks: Bookmark[];              // 书签列表
  folders: BookmarkFolder[];          // 文件夹列表
  viewMode: 'list' | 'card' | 'tree'; // 视图模式
  searchQuery: string;                // 搜索查询
  selectedFolder: string | null;      // 选中文件夹
  filteredBookmarks: Bookmark[];      // 过滤后的书签
  // ...actions
}
```

使用方式:

```tsx
import { useBookmarks } from '@/contexts/BookmarkContext';

function Component() {
  const { bookmarks, addBookmark } = useBookmarks();
  // ...
}
```

## Chrome 扩展集成

`useChromeBookmarks` Hook 封装了 Chrome Bookmarks API:

```typescript
const {
  bookmarks,        // 书签数据
  isLoading,        // 加载状态
  error,            // 错误信息
  refreshBookmarks, // 刷新书签
  createBookmark,   // 创建书签
  updateBookmark,   // 更新书签
  removeBookmark,   // 删除书签
} = useChromeBookmarks();
```

注意: 此功能仅在 Chrome 扩展环境中可用。

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_APP_NAME` | 应用名称 | Bookmark Manager |
| `VITE_APP_ENV` | 环境类型 | development |
| `VITE_APP_API_BASE_URL` | API 基础 URL | http://localhost:3001/api |
| `VITE_APP_DEBUG` | 调试模式 | true |
| `VITE_APP_VERSION` | 应用版本 | 1.0.0 |

环境文件:
- `.env.development` - 开发环境
- `.env.production` - 生产环境

## 测试策略

### Jest 配置

- 测试环境: `jsdom`
- 预设: `ts-jest`
- 模块映射: `@/*` -> `src/*`
- 覆盖率收集: `src/**/*.{ts,tsx}`

### 测试命令

```bash
pnpm test              # 运行测试
pnpm test:watch        # 监视模式
pnpm test:coverage     # 生成覆盖率报告
```

## 构建配置

### Vite 构建选项

```typescript
{
  outDir: 'dist',
  sourcemap: false,
  minify: 'esbuild',
  cssCodeSplit: true,
  rollupOptions: {
    output: {
      manualChunks: {
        react: ['react', 'react-dom'],
        ui: ['@mui/material', '@radix-ui/react-dialog'],
        charts: ['recharts'],
        icons: ['lucide-react'],
      }
    }
  }
}
```

## 性能优化

1. **代码分割**: 路由级懒加载 (`React.lazy`)
2. **手动分块**: 按功能模块分割 chunk
3. **缓存优化**: 使用 `useMemo`/`useCallback` 避免重复计算
4. **虚拟列表**: 大数据量时使用虚拟滚动
5. **图片优化**: 使用 WebP 格式，懒加载

## 安全注意事项

- 所有用户输入需要验证和转义
- Chrome API 调用需要检查权限
- 敏感数据（隐私空间）需要加密存储
- 使用 `noopener noreferrer` 处理外部链接

## 扩展开发

### 添加新页面

1. 在 `src/pages/` 创建页面组件
2. 在 `App.tsx` 中添加路由映射
3. 在 `Header` 或 `Sidebar` 添加导航入口

### 添加新组件

1. 在 `src/components/ui/` 添加基础 UI 组件
2. 在 `src/components/` 添加业务组件
3. 使用 `cn()` 工具函数合并 className

### 添加新 Hook

1. 在 `src/hooks/` 创建 Hook 文件
2. 在 `src/hooks/index.ts` 导出
3. 编写单元测试

## 相关文档

- `设计系统指南.md` - 详细的设计规范
- `技能功能与使用方法文档.md` - AI 技能使用指南
- `README.md` - 项目简介

## 注意事项

1. 项目使用 pnpm 管理依赖，请勿使用 npm/yarn
2. 代码提交前请运行 ESLint 检查
3. 保持组件的可复用性和单一职责
4. 优先使用 Radix UI 组件，保持 UI 一致性
5. 所有新功能需要配套 TypeScript 类型定义
