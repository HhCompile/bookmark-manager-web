# 书签管理器 API 规范文档

## 1. 后端需要提供的能力

### 1.1 认证相关 API

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| POST | `/api/auth/register` | 用户注册 | 否 |
| POST | `/api/auth/login` | 用户登录 | 否 |
| POST | `/api/auth/logout` | 用户登出 | 是 |
| GET | `/api/auth/me` | 获取当前用户信息 | 是 |
| PUT | `/api/auth/profile` | 更新用户信息 | 是 |
| POST | `/api/auth/refresh` | 刷新 Token | 是 |

### 1.2 书签管理 API

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| GET | `/api/bookmarks` | 获取书签列表（支持分页/筛选） | 是 |
| GET | `/api/bookmarks/:id` | 获取单个书签详情 | 是 |
| POST | `/api/bookmarks` | 创建书签 | 是 |
| PUT | `/api/bookmarks/:id` | 更新书签 | 是 |
| DELETE | `/api/bookmarks/:id` | 删除书签 | 是 |
| POST | `/api/bookmarks/batch` | 批量创建书签（导入用） | 是 |
| POST | `/api/bookmarks/:id/tags` | 添加标签 | 是 |
| DELETE | `/api/bookmarks/:id/tags/:tag` | 删除标签 | 是 |

### 1.3 文件夹管理 API

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| GET | `/api/folders` | 获取文件夹树 | 是 |
| POST | `/api/folders` | 创建文件夹 | 是 |
| PUT | `/api/folders/:id` | 更新文件夹 | 是 |
| DELETE | `/api/folders/:id` | 删除文件夹 | 是 |
| POST | `/api/folders/:id/bookmarks` | 添加书签到文件夹 | 是 |

### 1.4 标签管理 API

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| GET | `/api/tags` | 获取所有标签 | 是 |
| GET | `/api/tags/cloud` | 获取标签云数据 | 是 |
| PUT | `/api/tags/:name` | 重命名标签 | 是 |
| DELETE | `/api/tags/:name` | 删除标签 | 是 |

### 1.5 数据分析 API

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| GET | `/api/analytics/overview` | 获取概览统计 | 是 |
| GET | `/api/analytics/categories` | 分类统计 | 是 |
| GET | `/api/analytics/timeline` | 时间线统计 | 是 |
| GET | `/api/analytics/quality` | 书签质量报告 | 是 |

### 1.6 AI 相关 API

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| POST | `/api/ai/analyze` | AI 分析书签 | 是 |
| GET | `/api/ai/suggestions` | 获取优化建议 | 是 |
| POST | `/api/ai/suggestions/:id/accept` | 接受建议 | 是 |
| POST | `/api/ai/suggestions/:id/reject` | 拒绝建议 | 是 |

### 1.7 导入/导出 API

| 方法 | 路径 | 描述 | 认证要求 |
|------|------|------|----------|
| POST | `/api/import/html` | 导入 HTML 书签文件 | 是 |
| POST | `/api/import/json` | 导入 JSON 书签文件 | 是 |
| GET | `/api/export/html` | 导出 HTML 格式 | 是 |
| GET | `/api/export/json` | 导出 JSON 格式 | 是 |

---

## 2. 前端需要给后端提供的请求规范

### 2.1 认证头

所有需要认证的接口必须在请求头中携带：

```
Authorization: Bearer <jwt_token>
```

### 2.2 请求格式

#### 2.2.1 注册请求
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "用户名",
  "email": "user@example.com",
  "password": "password123"
}
```

#### 2.2.2 登录请求
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 2.2.3 创建书签请求
```json
POST /api/bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "书签标题",
  "url": "https://example.com",
  "category": "分类名称",
  "tags": ["标签1", "标签2"],
  "summary": "书签描述",
  "alias": "别名",
  "isLocked": false
}
```

#### 2.2.4 更新书签请求
```json
PUT /api/bookmarks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "新标题",
  "category": "新分类",
  "tags": ["新标签"]
}
```

#### 2.2.5 批量导入请求
```json
POST /api/bookmarks/batch
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookmarks": [
    {
      "title": "书签1",
      "url": "https://example1.com",
      "category": "分类1",
      "tags": ["标签1"]
    },
    {
      "title": "书签2",
      "url": "https://example2.com",
      "category": "分类2",
      "tags": ["标签2"]
    }
  ]
}
```

#### 2.2.6 文件导入请求
```json
POST /api/import/html
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <二进制文件内容>
```

#### 2.2.7 获取书签列表（支持查询参数）
```
GET /api/bookmarks?page=1&limit=20&folderId=xxx&search=keyword&tag=前端
Authorization: Bearer <token>
```

查询参数说明：
- `page`: 页码，默认 1
- `limit`: 每页数量，默认 20
- `folderId`: 按文件夹筛选
- `search`: 搜索关键词（搜索标题、URL、标签）
- `tag`: 按标签筛选
- `category`: 按分类筛选
- `sortBy`: 排序字段 (title, createdAt, url)
- `sortOrder`: 排序方向 (asc, desc)

---

## 3. 后端需要返回的响应格式

### 3.1 标准响应格式

所有 API 返回统一格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

或错误时：

```json
{
  "success": false,
  "message": "错误描述",
  "error": {
    "code": "ERROR_CODE",
    "details": "详细错误信息"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3.2 具体响应示例

#### 3.2.1 登录响应
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "user_xxx",
      "name": "用户名",
      "email": "user@example.com",
      "avatar": "https://...",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

#### 3.2.2 书签列表响应
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "bookmarks": [
      {
        "id": "bm_xxx",
        "title": "React 官方文档",
        "url": "https://react.dev",
        "category": "前端开发",
        "tags": ["React", "文档", "前端"],
        "favicon": "https://react.dev/favicon.ico",
        "isLocked": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 4. 数据模型定义

### 4.1 User（用户）
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt 加密
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Bookmark（书签）
```typescript
interface Bookmark {
  id: string;
  userId: string; // 所属用户
  title: string;
  url: string;
  alias?: string;
  category?: string;
  tags: string[];
  favicon?: string;
  summary?: string;
  isLocked: boolean;
  isDead?: boolean; // 链接是否失效
  clickCount: number; // 点击次数
  lastAccessedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.3 Folder（文件夹）
```typescript
interface Folder {
  id: string;
  userId: string;
  name: string;
  parentId?: string; // 父文件夹ID，支持嵌套
  order: number; // 排序
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.4 Tag（标签）
```typescript
interface Tag {
  id: string;
  userId: string;
  name: string;
  color?: string;
  count: number; // 使用次数
  createdAt: Date;
}
```

---

## 5. 错误码定义

| 错误码 | HTTP 状态码 | 描述 |
|--------|-------------|------|
| `UNAUTHORIZED` | 401 | 未授权，Token 无效或过期 |
| `FORBIDDEN` | 403 | 禁止访问，权限不足 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 422 | 请求参数验证失败 |
| `DUPLICATE_ENTRY` | 409 | 数据重复（如邮箱已注册） |
| `RATE_LIMIT` | 429 | 请求过于频繁 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

---

## 6. 安全要求

1. **密码加密**: 使用 bcrypt 存储密码哈希
2. **JWT 安全**: 
   - Access Token 有效期 1-2 小时
   - Refresh Token 有效期 7 天
   - 支持 Token 黑名单（登出时）
3. **CORS**: 只允许指定域名访问
4. **请求限制**: 每分钟最多 100 次请求
5. **SQL 注入防护**: 使用参数化查询
6. **XSS 防护**: 对所有输入进行转义

---

## 7. 性能要求

1. **响应时间**: 
   - 简单查询 < 100ms
   - 复杂查询 < 300ms
   - 文件导入 < 5s
2. **分页**: 默认每页 20 条，最大 100 条
3. **缓存**: 建议对标签云、统计数据等添加缓存

---

## 8. 前端需要适配的改动

### 8.1 API 客户端配置
```typescript
// src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理 Token 过期
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 尝试刷新 Token
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken });
          localStorage.setItem('auth_token', data.data.token);
          // 重试原请求
          return apiClient(error.config);
        } catch {
          // 刷新失败，跳转到登录
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### 8.2 环境变量配置
```env
# .env.development
VITE_API_BASE_URL=http://localhost:3001/api

# .env.production
VITE_API_BASE_URL=https://api.bookmark-manager.com/api
```

---

## 9. 开发环境配置

### 9.1 前端代理配置（vite.config.ts）
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### 9.2 启动命令
```bash
# 启动后端
cd server && npm run dev

# 启动前端
npm run dev
```

---

## 10. 测试要求

后端需要提供以下测试支持：
1. **单元测试覆盖率** > 80%
2. **API 集成测试** - 使用 Postman 集合或类似工具
3. **性能测试** - 支持并发请求测试
