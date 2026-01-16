# 后端API能力清单

> 智能书签管理系统 - 后端接口需求文档
>
> 本文档基于前端MockService中的功能，定义后端需要实现的API接口规范。
>
> 文档版本：v1.0
> 更新日期：2026-01-14

---

## 一、API基础规范

### 1.1 基础URL

```
BASE_URL: https://api.bookmark-manager.com/v1
```

### 1.2 通用响应格式

所有API响应统一使用以下格式：

```typescript
interface ApiResponse<T> {
  code: number; // 状态码：200成功，4xx客户端错误，5xx服务端错误
  message: string; // 响应消息
  data: T; // 响应数据
  timestamp: string; // 响应时间戳 (ISO 8601格式)
}

interface PaginationResponse<T> extends ApiResponse<T> {
  total: number; // 总记录数
  page: number; // 当前页码
  pageSize: number; // 每页记录数
  data: T; // 数据列表
}
```

### 1.3 HTTP状态码规范

| 状态码 | 含义       | 使用场景             |
| ------ | ---------- | -------------------- |
| 200    | 成功       | 请求成功处理         |
| 201    | 创建成功   | 资源创建成功         |
| 204    | 无内容     | 删除成功，无返回内容 |
| 400    | 请求错误   | 参数错误、格式错误   |
| 401    | 未授权     | Token无效或过期      |
| 403    | 禁止访问   | 权限不足             |
| 404    | 资源不存在 | 书签、分类等不存在   |
| 409    | 请求冲突   | 资源已存在           |
| 429    | 请求过多   | 触发限流             |
| 500    | 服务器错误 | 服务器内部错误       |
| 503    | 服务不可用 | 服务器维护中         |

### 1.4 错误响应格式

```typescript
interface ErrorResponse {
  code: number;
  message: string;
  errors?: Array<{
    field: string; // 错误字段
    message: string; // 错误详情
    value?: string; // 错误值
  }>;
}
```

---

## 二、认证与授权接口

### 2.1 用户登录

```http
POST /auth/login
Content-Type: application/json
```

**请求参数：**

```typescript
interface LoginRequest {
  email: string; // 用户邮箱，必填
  password: string; // 用户密码，必填
  remember?: boolean; // 记住我，默认false
}
```

**响应数据：**

```typescript
interface LoginResponse {
  user: {
    id: string;
    email: string;
    username?: string;
    avatar?: string;
  };
  token: string; // JWT访问令牌
  refreshToken: string; // 刷新令牌
}
```

### 2.2 用户注册

```http
POST /auth/register
Content-Type: application/json
```

**请求参数：**

```typescript
interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}
```

### 2.3 Token刷新

```http
POST /auth/refresh
Content-Type: application/json
Authorization: Bearer {refreshToken}
```

### 2.4 用户登出

```http
POST /auth/logout
Authorization: Bearer {token}
```

### 2.5 获取用户信息

```http
GET /auth/me
Authorization: Bearer {token}
```

**响应数据：**

```typescript
interface UserInfo {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  createdAt: string;
  settings: UserSettings;
}
```

---

## 三、书签管理接口

### 3.1 获取书签列表

```http
GET /bookmarks
Authorization: Bearer {token}
```

**查询参数：**

| 参数名     | 类型    | 必填 | 说明                                  |
| ---------- | ------- | ---- | ------------------------------------- |
| page       | number  | 否   | 页码，默认1                           |
| pageSize   | number  | 否   | 每页数量，默认20，最大100             |
| categoryId | string  | 否   | 分类ID筛选                            |
| tag        | string  | 否   | 标签筛选                              |
| keyword    | string  | 否   | 搜索关键词                            |
| isValid    | boolean | 否   | 有效性筛选                            |
| sortBy     | string  | 否   | 排序字段：createdAt, updatedAt, title |
| sortOrder  | string  | 否   | 排序方式：asc, desc，默认desc         |

**响应数据：**

```typescript
interface BookmarksResponse {
  bookmarks: Bookmark[];
  categories: string[];
  tags: string[];
  folders: Folder[];
}

interface Bookmark {
  id: string; // 书签唯一ID
  url: string; // 书签URL，必填，唯一
  title: string; // 书签标题，必填
  description?: string; // 书签描述
  favicon?: string; // Favicon URL
  categoryId?: string; // 分类ID
  tags?: string[]; // 标签列表，最多5个
  isValid: boolean; // 链接是否有效
  alias?: string; // 别名
  createdAt: string; // 创建时间 (ISO 8601)
  updatedAt: string; // 更新时间 (ISO 8601)
}
```

### 3.2 获取单个书签

```http
GET /bookmarks/{id}
Authorization: Bearer {token}
```

### 3.3 添加书签

```http
POST /bookmarks
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface CreateBookmarkRequest {
  url: string; // 必填，需要验证URL格式和唯一性
  title: string; // 必填
  description?: string;
  categoryId?: string;
  tags?: string[];
}
```

**响应数据：** 返回创建的书签对象（参见3.1）

### 3.4 更新书签

```http
PUT /bookmarks/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface UpdateBookmarkRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  alias?: string;
}
```

### 3.5 删除单个书签

```http
DELETE /bookmarks/{id}
Authorization: Bearer {token}
```

### 3.6 批量删除书签

```http
POST /bookmarks/batch-delete
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface BatchDeleteRequest {
  urls: string[]; // 要删除的书签URL列表，必填
}
```

**响应数据：**

```typescript
interface BatchDeleteResponse {
  deletedCount: number; // 成功删除的数量
  failedUrls?: string[]; // 删除失败的URL列表
}
```

### 3.7 导出书签

```http
GET /bookmarks/export
Authorization: Bearer {token}
```

**查询参数：**

| 参数名 | 类型   | 说明                                |
| ------ | ------ | ----------------------------------- |
| format | string | 导出格式：html, json, csv，默认json |

**响应：** 返回文件下载流

### 3.8 批量自动打标

```http
POST /bookmarks/batch-auto-tag
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface BatchAutoTagRequest {
  urls: string[]; // 要打标的书签URL列表，必填
  maxTags?: number; // 每个书签最大标签数，默认3，最大5
}
```

**响应数据：**

```typescript
interface BatchAutoTagResponse {
  successCount: number; // 成功打标的数量
  failedCount?: number; // 失败的数量
  results: Array<{
    url: string;
    success: boolean;
    tags: string[];
  }>;
}
```

### 3.9 批量自动分类

```http
POST /bookmarks/batch-auto-classify
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface BatchAutoClassifyRequest {
  urls: string[]; // 要分类的书签URL列表，必填
}
```

**响应数据：**

```typescript
interface BatchAutoClassifyResponse {
  successCount: number; // 成功分类的数量
  failedCount?: number; // 失败的数量
  results: Array<{
    url: string;
    success: boolean;
    category?: string;
  }>;
}
```

---

## 四、分类管理接口

### 4.1 获取分类列表

```http
GET /categories
Authorization: Bearer {token}
```

**查询参数：**

| 参数名   | 类型   | 说明             |
| -------- | ------ | ---------------- |
| page     | number | 页码，默认1      |
| pageSize | number | 每页数量，默认50 |

**响应数据：**

```typescript
interface Category {
  id: string; // 分类唯一ID
  name: string; // 分类名称，必填，唯一
  description?: string; // 分类描述
  icon?: string; // 分类图标（emoji或URL）
  parentId?: string; // 父分类ID
  order: number; // 排序权重
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}
```

### 4.2 创建分类

```http
POST /categories
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  order?: number;
}
```

### 4.3 更新分类

```http
PUT /categories/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  parentId?: string;
  order?: number;
}
```

### 4.4 删除分类

```http
DELETE /categories/{id}
Authorization: Bearer {token}
```

---

## 五、标签管理接口

### 5.1 获取标签列表

```http
GET /tags
Authorization: Bearer {token}
```

**查询参数：**

| 参数名   | 类型   | 说明             |
| -------- | ------ | ---------------- |
| page     | number | 页码，默认1      |
| pageSize | number | 每页数量，默认50 |

**响应数据：**

```typescript
interface Tag {
  id: string; // 标签唯一ID
  name: string; // 标签名称，必填，唯一
  count?: number; // 使用次数（可选，用于热度排序）
  createdAt: string; // 创建时间
}
```

### 5.2 创建标签

```http
POST /tags
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface CreateTagRequest {
  name: string;
}
```

### 5.3 更新标签

```http
PUT /tags/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface UpdateTagRequest {
  name?: string;
}
```

### 5.4 删除标签

```http
DELETE /tags/{id}
Authorization: Bearer {token}
```

---

## 六、文件夹管理接口

### 6.1 获取文件夹列表

```http
GET /folders
Authorization: Bearer {token}
```

**响应数据：**

```typescript
interface Folder {
  id: string; // 文件夹唯一ID
  name: string; // 文件夹名称，必填
  icon?: string; // 文件夹图标
  parentId?: string; // 父文件夹ID
  order: number; // 排序权重
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}
```

### 6.2 创建文件夹

```http
POST /folders
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface CreateFolderRequest {
  name: string;
  icon?: string;
  parentId?: string;
  order?: number;
}
```

### 6.3 更新文件夹

```http
PUT /folders/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface UpdateFolderRequest {
  name?: string;
  icon?: string;
  parentId?: string;
  order?: number;
}
```

### 6.4 删除文件夹

```http
DELETE /folders/{id}
Authorization: Bearer {token}
```

### 6.5 批量移动书签到文件夹

```http
POST /bookmarks/batch-move
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface BatchMoveRequest {
  urls: string[]; // 要移动的书签URL列表，必填
  folderId: string; // 目标文件夹ID，必填
}
```

---

## 七、书签导入接口

### 7.1 上传书签文件

```http
POST /bookmarks/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求参数：**

| 参数名   | 类型   | 必填 | 说明                             |
| -------- | ------ | ---- | -------------------------------- |
| file     | File   | 是   | 书签文件（HTML, JSON, CSV格式）  |
| folderId | string | 否   | 导入到的文件夹ID，默认为根文件夹 |

**响应数据：**

```typescript
interface UploadResponse {
  taskId: string; // 导入任务ID
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total: number; // 文件中书签总数
  parsedCount: number; // 成功解析的书签数量
  duplicatedCount: number; // 重复的书签数量
}
```

### 7.2 获取导入任务状态

```http
GET /bookmarks/upload/{taskId}
Authorization: Bearer {token}
```

**响应数据：**

```typescript
interface UploadTaskResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 进度百分比 0-100
  message?: string; // 状态消息
  bookmarks?: Bookmark[]; // 已导入的书签列表（分页）
}
```

### 7.3 确认导入书签

```http
POST /bookmarks/upload/{taskId}/confirm
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface ConfirmImportRequest {
  bookmarkIds: string[]; // 要确认导入的书签ID列表，必填
  folderId?: string; // 目标文件夹ID
}
```

**响应数据：** 返回成功导入的书签数量

### 7.4 取消导入任务

```http
POST /bookmarks/upload/{taskId}/cancel
Authorization: Bearer {token}
```

---

## 八、链接验证接口

### 8.1 验证书签链接

```http
POST /bookmarks/validate
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface ValidateRequest {
  urls?: string[]; // 要验证的URL列表，为空则验证所有书签
}
```

**响应数据：**

```typescript
interface ValidateResponse {
  taskId: string; // 验证任务ID
  total: number; // 待验证总数
  status: 'pending' | 'running' | 'completed' | 'failed';
}
```

### 8.2 获取验证任务状态

```http
GET /bookmarks/validate/{taskId}
Authorization: Bearer {token}
```

**响应数据：**

```typescript
interface ValidationTaskStatus {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 进度百分比 0-100
  valid: number; // 有效链接数
  invalid: number; // 无效链接数
  failed: Array<{
    url: string;
    error: string;
  }>;
}
```

### 8.3 重试失败的验证

```http
POST /bookmarks/validate/retry
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface RetryValidationRequest {
  urls: string[]; // 要重试的URL列表，必填
}
```

---

## 九、重复检测接口

### 9.1 检测重复书签

```http
POST /bookmarks/detect-duplicates
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

| 参数名 | 类型    | 必填 | 说明                        |
| ------ | ------- | ---- | --------------------------- |
| url    | string  | 是   | 要检测的书签URL             |
| byUrl  | boolean | 否   | 是否按URL精确匹配，默认true |

**响应数据：**

```typescript
interface DuplicateResponse {
  groups: Array<{
    url: string; // 重复的URL
    bookmarks: Bookmark[]; // 重复的书签列表
  }>;
  totalDuplicates: number; // 总重复书签数
}
```

### 9.2 合并重复书签

```http
POST /bookmarks/merge-duplicates
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface MergeDuplicatesRequest {
  groupUrl: string; // 要合并的URL，必填
  keepId: string; // 保留的书签ID，必填
  deleteIds: string[]; // 要删除的书签ID列表，必填
}
```

---

## 十、统计接口

### 10.1 获取书签统计

```http
GET /bookmarks/stats
Authorization: Bearer {token}
```

**响应数据：**

```typescript
interface StatsResponse {
  total: number; // 总书签数
  categories: number; // 分类数量
  tags: number; // 标签数量
  validLinks: number; // 有效链接数
  recentlyAdded: number; // 最近7天新增数
  favorites: number; // 收藏书签数
  todayAdded: number; // 今日新增数
}
```

### 10.2 获取分类统计

```http
GET /categories/stats
Authorization: Bearer {token}
```

**响应数据：**

```typescript
interface CategoryStatsResponse {
  categories: Array<{
    categoryId: string;
    categoryName: string;
    bookmarkCount: number;
    recentAdded: number;
  }>;
  total: number;
}
```

---

## 十一、用户设置接口

### 11.1 更新用户设置

```http
PUT /user/settings
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  emailNotifications?: boolean;
  desktopNotifications?: boolean;
  autoTag?: boolean; // 自动打标设置
  autoClassify?: boolean; // 自动分类设置
}
```

### 11.2 获取用户设置

```http
GET /user/settings
Authorization: Bearer {token}
```

### 11.3 更新用户资料

```http
PUT /user/profile
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**

```typescript
interface UpdateProfileRequest {
  username?: string;
  avatar?: string;
  bio?: string;
}
```

---

## 十二、数据导出接口

### 12.1 导出用户数据

```http
GET /user/export
Authorization: Bearer {token}
```

**查询参数：**

| 参数名           | 类型    | 说明                        |
| ---------------- | ------- | --------------------------- |
| format           | string  | 导出格式：json, csv         |
| includeBookmarks | boolean | 是否包含书签数据，默认true  |
| includeSettings  | boolean | 是否包含设置数据，默认false |

**响应：** 返回文件下载流

---

## 十三、安全与限流

### 13.1 请求限流

- **默认限制**：每用户每分钟最多100次请求
- **上传限制**：每用户每小时最多5次文件上传
- **批量操作限制**：单次批量操作最多100个项目
- **响应头**：
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1640986480
  ```

### 13.2 数据验证

**URL格式验证**：

- 必须以http://或https://开头
- 不允许包含恶意代码（javascript:, data:, vbscript:等）
- 最大长度限制：2048字符

**标题验证**：

- 长度范围：1-200字符
- 不允许为空
- 去除首尾空白

**标签验证**：

- 每个书签最多5个标签
- 标签名称长度：1-30字符
- 特殊字符限制：仅支持中文、字母、数字、下划线、中划线

### 13.3 数据加密

- 所有敏感数据传输必须使用HTTPS
- Token必须通过JWT（JSON Web Token）签发
- Token有效期：7天，RefreshToken有效期：30天

---

## 十四、WebSocket接口（可选）

### 14.1 实时更新推送

```javascript
WebSocket: wss://api.bookmark-manager.com/ws
Authorization: Bearer {token}
```

**连接认证**：

```typescript
interface WSAuth {
  token: string; // JWT Token
  timestamp: number; // 连接时间戳
}
```

**事件类型：**

| 事件名               | 数据方向        | 说明           |
| -------------------- | --------------- | -------------- |
| bookmarks:created    | Server → Client | 新书签创建通知 |
| bookmarks:updated    | Server → Client | 书签更新通知   |
| bookmarks:deleted    | Server → Client | 书签删除通知   |
| validation:progress  | Server → Client | 验证进度推送   |
| validation:completed | Server → Client | 验证完成通知   |
| import:progress      | Server → Client | 导入进度推送   |
| import:completed     | Server → Client | 导入完成通知   |

---

## 十五、错误处理规范

### 15.1 错误码定义

| 错误码 | HTTP状态码 | 错误类型   | 说明             |
| ------ | ---------- | ---------- | ---------------- |
| 1001   | 400        | 参数错误   | 必填参数缺失     |
| 1002   | 400        | 参数错误   | 参数格式错误     |
| 1003   | 400        | 参数错误   | 参数值超出范围   |
| 1004   | 401        | 认证错误   | Token无效        |
| 1005   | 401        | 认证错误   | Token已过期      |
| 1006   | 403        | 权限错误   | 无操作权限       |
| 1007   | 404        | 资源错误   | 书签不存在       |
| 1008   | 409        | 冲突错误   | URL已存在        |
| 1009   | 429        | 限流错误   | 请求过于频繁     |
| 1010   | 400        | 数据错误   | 数据格式错误     |
| 1011   | 400        | 业务错误   | 书签数量已达上限 |
| 2001   | 500        | 服务器错误 | 数据库错误       |
| 2002   | 500        | 服务器错误 | 外部服务错误     |
| 2003   | 500        | 服务器错误 | 文件处理错误     |
| 2004   | 500        | 服务器错误 | 导出失败         |
| 9999   | 500        | 未知错误   | 未知异常         |

### 15.2 错误消息规范

```typescript
interface ErrorMessage {
  code: number;
  message: string;
  zh_CN: string; // 中文错误消息
  en_US: string; // 英文错误消息
}
```

---

## 十六、性能要求

### 16.1 响应时间要求

| 接口类型  | 目标响应时间 | 最大响应时间 |
| --------- | ------------ | ------------ |
| 列表查询  | < 200ms      | < 500ms      |
| 详情查询  | < 100ms      | < 200ms      |
| 创建/更新 | < 300ms      | < 500ms      |
| 删除操作  | < 100ms      | < 200ms      |
| 批量操作  | < 500ms      | < 1000ms     |
| 文件上传  | < 2s         | < 5s         |
| 链接验证  | < 200ms      | < 500ms      |

### 16.2 并发支持

- 批量查询API支持最大20个并发请求
- 长时间任务（上传、验证）使用任务队列
- WebSocket长连接保持最短30秒

---

## 十七、测试建议

### 17.1 单元测试覆盖要求

| 模块     | 目标覆盖率 | 必测场景              |
| -------- | ---------- | --------------------- |
| 书签CRUD | > 80%      | 增删改查全流程        |
| 分类管理 | > 75%      | 树形结构、增删改查    |
| 标签管理 | > 75%      | 增删改查              |
| 文件导入 | > 70%      | HTML/JSON/CSV格式解析 |
| 链接验证 | > 60%      | 有效/无效链接判定     |

### 17.2 集成测试覆盖要求

| 测试场景 | 关键接口 | 验证要点                       |
| -------- | -------- | ------------------------------ |
| 正常流程 | 全部接口 | 参数验证、权限验证、数据完整性 |
| 异常流程 | 全部接口 | 400/401/403/404/409/429/500等  |
| 并发场景 | 批量操作 | 并发安全性、数据一致性         |
| 性能测试 | 查询接口 | 大数据量（1000+书签）性能      |

---

## 十八、部署要求

### 18.1 环境变量

| 变量名          | 说明           | 必填 |
| --------------- | -------------- | ---- |
| DB_HOST         | 数据库主机地址 | 是   |
| DB_PORT         | 数据库端口     | 是   |
| DB_NAME         | 数据库名称     | 是   |
| DB_USER         | 数据库用户     | 是   |
| DB_PASSWORD     | 数据库密码     | 是   |
| REDIS_URL       | Redis连接地址  | 是   |
| JWT_SECRET      | JWT密钥        | 是   |
| ALLOWED_ORIGINS | 允许的跨域来源 | 是   |

### 18.2 容器化要求

- 使用Docker容器化部署
- 暴露端口：80（HTTP）、443（HTTPS）
- 健康检查端点：`GET /health`
- 日志级别：info级别及以上

---

## 附录：数据模型定义

### A. Bookmark 完整定义

```typescript
interface Bookmark {
  id: string; // UUID v4
  url: string; // 完整URL，最大2048字符
  title: string; // 书签标题，1-200字符
  description?: string; // 可选描述，最大1000字符
  favicon?: string; // 可选favicon URL
  categoryId?: string; // 所属分类ID，引用Category.id
  tags?: string[]; // 标签数组，最多5个，每个1-30字符
  isValid: boolean; // 链接有效性，默认true
  alias?: string; // 别名，最大100字符
  createdAt: string; // 创建时间，ISO 8601格式
  updatedAt: string; // 更新时间，ISO 8601格式
}
```

### B. Category 完整定义

```typescript
interface Category {
  id: string; // UUID v4
  name: string; // 分类名称，1-50字符，唯一
  description?: string; // 可选描述，最大500字符
  icon?: string; // 可选图标（emoji或URL）
  parentId?: string; // 父分类ID，null表示顶级分类
  order: number; // 排序权重，0-9999
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}
```

### C. Tag 完整定义

```typescript
interface Tag {
  id: string; // UUID v4
  name: string; // 标签名称，1-30字符，唯一
  count?: number; // 使用次数统计
  createdAt: string; // 创建时间
}
```

### D. Folder 完整定义

```typescript
interface Folder {
  id: string; // UUID v4
  name: string; // 文件夹名称，1-50字符，唯一
  icon?: string; // 可选图标（emoji或URL）
  parentId?: string; // 父文件夹ID，null表示顶级文件夹
  order: number; // 排序权重，0-9999
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}
```

---

**文档维护者**：开发团队
**最后更新**：2026-01-14
