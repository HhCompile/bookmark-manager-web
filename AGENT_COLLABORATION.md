# 🤖 AI Agent 协作开发方案

## 前后端 Agent 联动模式

```
┌─────────────────┐         API 契约         ┌─────────────────┐
│   前端 Agent    │  ◄────────────────────►  │   后端 Agent    │
│  (Kimi Code)    │    同步接口规范/类型定义  │   (Claude/等)   │
└────────┬────────┘                          └────────┬────────┘
         │                                            │
         ▼                                            ▼
┌─────────────────┐                          ┌─────────────────┐
│   React + TS    │                          │  Node.js + TS   │
│   书签管理界面   │                          │   REST API      │
└─────────────────┘                          └─────────────────┘
```

---

## 1. 协作流程

### Phase 1: 契约先行 (Contract First)
1. **前端 Agent** 输出 `API_SPEC.md` 初版
2. **后端 Agent** 审阅并提出修改建议
3. 双方确认后锁定 `API_SPEC.md v1.0`
4. 生成共享的 TypeScript 类型定义文件

### Phase 2: 并行开发
1. **前端 Agent**: 基于契约创建 Mock Service Worker
2. **后端 Agent**: 基于契约实现真实 API
3. 每日同步进度，调整接口细节

### Phase 3: 联调集成
1. 后端 Agent 提供 Swagger/OpenAPI 文档
2. 前端 Agent 切换 MSW → 真实 API
3. 共同测试并修复问题

---

## 2. 通信协议

### 2.1 文档共享方式

#### 方式 A: 文件同步 (推荐)
```bash
# 共享契约文件
shared/
├── types/
│   ├── bookmark.ts      # 书签类型定义
│   ├── user.ts          # 用户类型定义
│   └── api.ts           # API 响应类型
├── api-spec-v1.md       # API 规范文档
└── openapi.json         # OpenAPI 规范
```

#### 方式 B: 代码仓库联动
```bash
# 契约仓库
api-contracts/
├── src/
│   ├── types/           # TypeScript 类型
│   ├── schemas/         # JSON Schema
│   └── openapi.yaml     # OpenAPI 3.0
├── CHANGELOG.md         # 契约变更记录
└── version.txt          # 当前契约版本
```

### 2.2 消息通知格式

```json
{
  "from": "frontend-agent",
  "to": "backend-agent",
  "type": "API_CHANGE",      // API_CHANGE | TYPE_UPDATE | BUG_REPORT
  "version": "1.0.1",
  "changes": [
    {
      "action": "ADDED",     // ADDED | MODIFIED | REMOVED
      "resource": "/api/bookmarks/:id/tags",
      "description": "新增标签管理接口"
    }
  ],
  "breaking": false,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 3. 共享类型定义

### 3.1 书签类型 (types/bookmark.ts)
```typescript
// 前端后端共用

export interface Bookmark {
  id: string;
  userId: string;
  title: string;
  url: string;
  alias?: string;
  category?: string;
  tags: string[];
  favicon?: string;
  summary?: string;
  isLocked: boolean;
  isDead?: boolean;
  clickCount: number;
  createdAt: string;  // ISO 8601 格式
  updatedAt: string;
}

// 创建书签请求（后端需要）
export interface CreateBookmarkRequest {
  title: string;
  url: string;
  category?: string;
  tags?: string[];
  summary?: string;
  alias?: string;
}

// API 标准响应
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### 3.2 用户类型 (types/user.ts)
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}
```

---

## 4. 自动化协作工具

### 4.1 契约生成脚本
```typescript
// scripts/generate-openapi.ts
import { Bookmark } from '../shared/types/bookmark';

// 从 TypeScript 类型生成 OpenAPI Schema
export function generateOpenApi() {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Bookmark Manager API',
      version: '1.0.0'
    },
    paths: {
      '/api/bookmarks': {
        get: {
          summary: '获取书签列表',
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/BookmarkListResponse'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Bookmark: generateJsonSchema(Bookmark),
        // ...
      }
    }
  };
}
```

### 4.2 Mock 数据同步
```typescript
// shared/mocks/bookmarks.ts
// 前后端共用 Mock 数据

export const mockBookmarks = [
  {
    id: 'bm_1',
    title: 'React 官方文档',
    url: 'https://react.dev',
    category: '前端开发',
    tags: ['React', '文档'],
    isLocked: false,
    clickCount: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // ...
];

// 前端: 用于 MSW
// 后端: 用于单元测试和开发环境种子数据
```

---

## 5. 代码审查清单

### 5.1 前端 Agent 自检清单
- [ ] TypeScript 类型与契约一致
- [ ] API 调用路径与契约一致
- [ ] 错误处理符合后端错误码
- [ ] 分页参数符合规范
- [ ] Token 刷新逻辑正确

### 5.2 后端 Agent 自检清单
- [ ] 接口路径与契约一致
- [ ] 请求/响应类型与契约一致
- [ ] 认证中间件正确实现
- [ ] 错误码符合规范
- [ ] 分页逻辑正确实现

---

## 6. 联调检查点

### Checkpoint 1: 认证联调
```bash
# 前端 Agent 测试脚本
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# 期望响应
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJ..."
  }
}
```

### Checkpoint 2: 书签 CRUD
```bash
# 创建书签
curl -X POST http://localhost:3001/api/bookmarks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","url":"https://test.com"}'

# 获取列表
curl http://localhost:3001/api/bookmarks \
  -H "Authorization: Bearer <token>"
```

### Checkpoint 3: 文件导入
```bash
# 导入 HTML
curl -X POST http://localhost:3001/api/import/html \
  -H "Authorization: Bearer <token>" \
  -F "file=@bookmarks.html"
```

---

## 7. 冲突解决机制

### 场景 1: 接口字段变更
```
后端 Agent: 需要给 Bookmark 添加 clickCount 字段

解决方案:
1. 后端 Agent 更新 shared/types/bookmark.ts
2. 发送变更通知给前端 Agent
3. 前端 Agent 拉取最新契约
4. 双方同时更新代码
```

### 场景 2: 响应格式分歧
```
前端期望: { data: bookmarks[] }
后端返回: { data: { items: bookmarks[], pagination: {...} } }

解决方案:
1. 对照契约文档确定标准
2. 偏离方修改代码
3. 更新契约文档记录决策
```

---

## 8. 下一步行动

### 立即执行
1. ✅ 前端 Agent 已输出 `API_SPEC.md`
2. 🔄 后端 Agent 审阅并确认/修改
3. 🔄 双方创建共享类型定义仓库
4. 🔄 确定通信方式（文件/消息）

### 并行开发
```
前端 Agent                    后端 Agent
    │                            │
    ▼                            ▼
┌──────────────┐            ┌──────────────┐
│ 创建 MSW     │            │ 搭建项目骨架  │
│ Mock 处理器  │            │ 数据库设计    │
│ API 客户端   │            │ 认证模块      │
│ 组件开发     │            │ 书签 CRUD     │
└──────────────┘            └──────────────┘
    │                            │
    └──────────┬─────────────────┘
               ▼
          每日同步进度
               │
               ▼
          联调测试
```

---

## 9. 联系方式

| Agent | 角色 | 负责范围 |
|-------|------|----------|
| 前端 Agent (Kimi) | 前端开发 | React + TypeScript + UI |
| 后端 Agent | 后端开发 | API + Database + Auth |

**协作频率**: 每天同步一次进度
**紧急联系**: API 变更时立即通知
