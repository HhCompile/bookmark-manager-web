# 智能书签管理系统 - 业务场景文档

## 产品定位

**智能书签管理系统**是一个 AI 驱动的书签管理工具，帮助用户高效整理、分类和优化浏览器书签，构建个性化的知识图谱。

## 核心业务场景

### 1. 书签导入与同步 (Import & Sync)
**用户故事：** 作为用户，我希望将现有浏览器书签导入系统，并保持同步

**功能点：**
- Chrome/Edge/Firefox 浏览器书签同步
- HTML 文件导入（从浏览器导出的书签文件）
- 增量同步，支持双向数据同步
- 冲突智能处理

**数据流：**
```
浏览器书签 → API/文件解析 → 数据清洗 → 本地存储 → AI 分析
```

### 2. AI 智能优化 (AI Optimization)
**用户故事：** 作为用户，我希望 AI 自动帮我分类和优化书签

**功能点：**
- 智能分类：基于内容理解自动分组
- 标签提取：自动提取关键词标签
- 别名生成：生成简短的别名便于搜索
- 置信度系统：高/中/低置信度分类，用户确认

**AI 处理流程：**
```
书签 URL/标题 → 内容抓取 → NLP 分析 → 分类建议 → 用户确认 → 应用优化
```

### 3. 书签管理 (Bookmark Management)
**用户故事：** 作为用户，我需要多种方式查看和管理我的书签

**功能点：**
- 三种视图模式：列表视图、卡片视图、树状视图
- 全文搜索：标题、URL、标签、别名
- 文件夹管理：创建、编辑、删除文件夹
- 批量操作：多选、批量移动、批量删除

### 4. 数据分析 (Analytics)
**用户故事：** 作为用户，我想了解我的书签分布和使用情况

**功能点：**
- 标签云可视化
- 分类统计饼图
- 使用趋势分析
- 收藏热度排行

### 5. 质量监控 (Quality Monitor)
**用户故事：** 作为用户，我希望系统帮我维护书签库的健康

**功能点：**
- 重复链接检测
- 失效链接巡检
- 健康度评分
- Wayback Machine 恢复支持

### 6. 隐私空间 (Private Vault)
**用户故事：** 作为用户，我有敏感书签需要加密保护

**功能点：**
- 端到端加密存储
- 密码保护访问
- 自动锁定机制
- 隐私书签与普通书签隔离

### 7. 阅读与批注 (Reader & Annotation)
**用户故事：** 作为用户，我需要在阅读网页时做笔记

**功能点：**
- 侧边栏阅读模式
- 文本高亮
- 添加批注
- 笔记导出

## 用户角色

| 角色 | 描述 | 核心需求 |
|------|------|---------|
| 普通用户 | 日常浏览器使用者 | 快速导入、AI 自动分类、简单搜索 |
| 开发者 | 技术资料收藏者 | 标签管理、全文搜索、代码片段保存 |
| 研究人员 | 大量文献收藏者 | 分类整理、批注功能、导出引用 |
| 隐私关注者 | 注重数据安全 | 加密存储、本地优先、隐私保护 |

## 数据结构

### Bookmark (书签)
```typescript
{
  id: string;           // 唯一标识
  title: string;        // 标题
  url: string;          // URL
  alias?: string;       // 别名（短名称）
  category?: string;    // 分类/文件夹
  tags: string[];       // 标签列表
  favicon?: string;     // 图标/emoji
  isLocked: boolean;    // 是否加密
  addedDate: Date;      // 添加时间
  annotations?: string[];  // 批注
  highlights?: string[];   // 高亮内容
  isDead?: boolean;     // 是否失效
}
```

### Folder (文件夹)
```typescript
{
  id: string;
  name: string;
  parentId?: string;    // 父文件夹（支持嵌套）
  bookmarks: string[];  // 书签 ID 列表
}
```

## API 设计规范

### RESTful API 端点

```
GET    /api/bookmarks           # 获取书签列表
POST   /api/bookmarks           # 创建书签
GET    /api/bookmarks/:id       # 获取单个书签
PUT    /api/bookmarks/:id       # 更新书签
DELETE /api/bookmarks/:id       # 删除书签

GET    /api/folders             # 获取文件夹列表
POST   /api/folders             # 创建文件夹
PUT    /api/folders/:id         # 更新文件夹
DELETE /api/folders/:id         # 删除文件夹

POST   /api/import/chrome       # Chrome 书签导入
POST   /api/import/html         # HTML 文件导入
POST   /api/sync                # 同步书签

POST   /api/ai/analyze          # AI 分析书签
GET    /api/ai/suggestions      # 获取 AI 优化建议
POST   /api/ai/apply            # 应用 AI 建议

GET    /api/analytics/tags      # 标签统计
GET    /api/analytics/categories # 分类统计
GET    /api/quality/check       # 质量检查

POST   /api/vault/unlock        # 解锁隐私空间
POST   /api/vault/lock          # 锁定隐私空间
```

## 技术架构

### 前端技术栈
- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui (组件库)
- react-i18next (国际化)
- react-router-dom (路由)
- zustand / React Context (状态管理)
- @tanstack/react-query (数据获取)

### Mock 策略
- 开发环境使用 Mock Service Worker (MSW)
- 所有 API 调用统一走请求配置
- Mock 数据集中管理，支持热更新
