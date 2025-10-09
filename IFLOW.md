# iFlow 上下文文档

## 项目概述

这是一个使用React技术栈的书签管理前后端项目。前端提供用户友好的界面来上传、管理、分类和检查重复的书签，后端提供API服务支持书签的存储、分类和标签功能。

### 技术选型

#### 前端技术栈
- React 19 + Hooks
- TypeScript
- Tailwind CSS (样式框架)
- 自定义UI组件库 (基于Tailwind CSS)
- Axios (HTTP客户端)
- Vite (构建工具)
- React Router v7 (路由管理)
- Zustand (状态管理)
- Sonner (通知组件)
- Lucide React (图标库)

#### 后端技术栈
- Flask 2.3.2 (Python Web框架)
- BeautifulSoup4 4.12.2 (HTML解析库)
- Flask-CORS 3.0.10 (跨域支持)
- JSON (数据存储格式)

## 项目结构

### 前端项目结构
```
bookmark-manager/
├── src/
│   ├── assets/             # 静态资源文件
│   │   └── react.svg      # React图标
│   ├── components/         # 公共组件
│   │   ├── Header.tsx     # 页面头部
│   │   ├── Footer.tsx     # 页面底部
│   │   ├── Layout.tsx     # 页面布局组件
│   │   ├── bookmark/      # 书签相关组件
│   │   │   ├── BookmarkGrid.tsx
│   │   │   ├── BookmarkGridView.tsx
│   │   │   ├── BookmarkListView.tsx
│   │   │   ├── BookmarkTable.tsx
│   │   │   ├── BookmarkTableView.tsx
│   │   │   └── BookmarkToolbar.tsx
│   │   ├── duplicate/     # 重复检查相关组件
│   │   │   └── DuplicateGroup.tsx
│   │   ├── ui/            # UI组件库
│   │   │   ├── button.tsx # 按钮组件
│   │   │   └── sonner.tsx # 通知组件
│   │   └── upload/        # 上传相关组件
│   │       ├── FileUploadArea.tsx
│   │       ├── RecentUploads.tsx
│   │       ├── UploadResult.tsx
│   │       ├── UploadStats.tsx
│   │       └── UsageInstructions.tsx
│   ├── lib/                # 工具库
│   │   ├── utils.ts       # 通用工具函数
│   │   └── debug.ts       # 调试工具函数
│   ├── pages/              # 页面组件
│   │   ├── UploadPage.tsx # 上传页面
│   │   ├── BookmarkList.tsx # 书签列表页面
│   │   └── DuplicateCheck.tsx # 重复书签检查页面
│   ├── router/             # 路由配置
│   │   └── index.tsx      # 路由配置文件
│   ├── services/           # API服务
│   │   └── api.ts         # API调用封装
│   ├── store/              # 状态管理
│   │   └── bookmarkStore.ts # 书签状态管理
│   ├── App.css            # 应用样式
│   ├── App.tsx            # 根组件
│   ├── index.css          # 全局样式
│   └── main.tsx           # 入口文件
├── public/                 # 静态资源
├── tests/                  # 测试文件
│   ├── setup.js           # 测试设置
│   ├── UploadPage.test.jsx # UploadPage组件测试
│   └── debug.test.js      # 调试工具测试
├── .vscode/                # VS Code配置
│   └── launch.json        # 调试配置
├── package.json           # 项目依赖和脚本
├── vite.config.ts         # Vite配置文件
└── vitest.config.js       # 测试配置文件
```

### 后端项目结构
```
bookmark-manager-admin/
├── app.py              # Flask应用入口文件
├── bookmark.py         # 书签数据结构定义
├── bookmark_manager.py # 书签管理器核心逻辑
├── classifier.py       # 自动打标和分类算法
├── storage.py          # 数据存储接口
├── bookmarks.json      # 书签数据存储文件
├── requirements.txt    # 项目依赖文件
├── uploads/            # 上传文件存储目录
├── .vscode/            # VS Code配置
│   └── launch.json     # 调试配置
└── main.py             # 程序入口文件
```

## 后端API接口

后端API服务器运行在 `http://localhost:9001`，提供以下接口：

### 健康检查
- `GET /health` - 检查应用是否正常运行

### 书签操作
- `POST /bookmark` - 添加单个书签
- `POST /bookmarks/batch` - 批量添加书签
- `GET /bookmarks` - 获取所有书签
- `GET /bookmarks/category/{category}` - 根据分类获取书签
- `GET /bookmarks/tag/{tag}` - 根据标签获取书签
- `DELETE /bookmark/{url}` - 删除书签
- `PUT /bookmark/{url}` - 更新书签

### 文件上传
- `POST /bookmark/upload` - 上传书签文件

### 调试接口
- `GET /debug/state` - 获取应用状态信息

## 功能模块设计

### 1. 文件上传模块
- 支持上传HTML格式书签文件
- 可视化上传进度显示
- 上传结果即时反馈
- 文件拖拽上传支持
- 支持文件移除功能

### 2. 书签展示模块
- 美观的卡片式书签展示
- 网格视图、列表视图和表格视图切换
- 智能分类和标签系统
- 强大的搜索和筛选功能
- 批量选择和删除功能
- 自动打标和分类功能

### 3. 重复检查模块
- 智能检测重复书签（基于URL）
- 分组展示重复项
- 对比视图便于识别差异
- 选择性删除重复书签
- 批量处理重复书签
- 无效书签检测和清理

### 4. 自动分类模块
- 基于关键词的自动分类算法
- 自动打标功能
- 支持技术、新闻、娱乐、学习、购物、社交等分类
- 支持自定义标签

### 5. 调试和监控模块
- 前端状态调试工具
- 后端详细日志记录
- API调用性能监控
- 应用状态检查接口

## 已实现功能

### 前端功能
#### 基础框架搭建
- 使用Vite创建React项目
- 配置Tailwind CSS样式框架
- 创建自定义UI组件库
- 配置React Router v7路由
- 创建基础页面组件结构(Header, Footer, UploadPage, BookmarkList, DuplicateCheck)
- 配置Axios HTTP客户端
- 创建API服务层封装
- 配置Zustand状态管理方案
- 集成Sonner通知组件
- 集成Lucide React图标库

#### 路由系统
- 实现基于React Router v7的路由配置
- 创建统一布局组件(Layout.tsx)管理页面公共结构
- 配置主页、书签列表、重复检查三个主要路由

#### 文件上传功能
- 实现文件选择和上传功能
- 处理上传结果展示
- 与后端`/bookmark/upload`接口对接
- 添加错误处理和用户提示
- 支持文件拖拽上传
- 支持上传进度显示
- 支持文件移除功能
- 使用Sonner组件显示友好的通知消息

#### 书签管理功能
- 实现书签列表数据获取和展示
- 添加分类筛选功能
- 添加标签筛选功能
- 实现书签删除功能
- 支持网格视图、列表视图和表格视图
- 支持批量选择和删除
- 支持自动打标和分类功能

#### 重复检查功能
- 实现重复书签检测算法
- 展示重复书签列表
- 提供重复书签对比视图
- 实现选择性删除功能
- 添加批量处理功能
- 无效书签检测和清理功能

#### 调试和测试功能
- 添加Zustand开发工具中间件支持
- 创建前端调试工具库
- 配置Vitest测试框架
- 添加组件测试示例
- 配置VS Code调试环境
- 添加API调用性能监控

### 后端功能
#### API接口
- 实现健康检查接口 (/health)
- 实现文件上传接口 (/bookmark/upload)
- 实现书签添加接口 (/bookmark)
- 实现批量书签添加接口 (/bookmarks/batch)
- 实现获取所有书签接口 (/bookmarks)
- 实现按分类获取书签接口 (/bookmarks/category/{category})
- 实现按标签获取书签接口 (/bookmarks/tag/{tag})
- 实现删除书签接口 (/bookmark/{url})
- 实现更新书签接口 (/bookmark/{url})
- 实现调试状态接口 (/debug/state)

#### 核心功能
- 实现书签数据结构定义
- 实现书签管理器核心逻辑
- 实现自动打标和分类算法
- 实现数据存储接口（JSON格式）
- 支持HTML书签文件解析
- 添加详细的日志记录功能
- 配置CORS跨域支持

#### 调试和监控功能
- 添加结构化日志记录
- 配置Flask调试模式
- 添加应用状态检查接口
- 配置VS Code后端调试环境

## 开发命令

### 前端开发命令
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 运行代码检查
pnpm lint

# 运行测试
pnpm test

# 运行测试（UI界面）
pnpm test:ui

# 运行测试（命令行）
pnpm test:run
```

### 后端开发命令
```bash
# 安装依赖
pip3 install -r requirements.txt

# 启动开发服务器
python3 app.py
```

## 技术风险和应对措施

1. **跨域问题**: 前端已配置Vite代理解决开发环境跨域，后端已配置Flask-CORS
2. **大文件上传**: 后端已配置文件大小限制(16MB)，后续可实现分片上传
3. **数据量大**: 前端已实现虚拟滚动和分页加载机制
4. **浏览器兼容性**: 使用现代浏览器特性，后续可添加Babel和Polyfill处理兼容性
5. **状态管理复杂性**: 使用Zustand简化状态管理，并集成开发工具支持
6. **API集成问题**: 创建统一的API服务层封装，提高可维护性
7. **数据持久化**: 当前使用JSON文件存储，后续可迁移至数据库
8. **安全性**: 后续需添加API身份验证和请求数据验证
9. **调试困难**: 已配置完整的前后端调试环境和工具
10. **测试覆盖不足**: 已配置Vitest测试框架，支持单元测试和组件测试

## 开发约定

### 前端开发约定
- 使用函数式组件和Hooks
- 遵循React最佳实践
- 使用Tailwind CSS进行样式开发
- 组件化开发，提高代码复用性
- 使用Zustand进行状态管理
- 遵循ESLint代码规范
- 使用Vitest进行测试
- 遵循调试最佳实践

### 后端开发约定
- 使用Flask框架开发RESTful API
- 遵循Python PEP8代码规范
- 使用JSON格式进行数据交换
- 实现统一的错误处理机制
- 遵循RESTful API设计原则
- 使用结构化日志记录
- 遵循调试和监控最佳实践

### 项目结构约定
- 前端采用页面组件和功能组件分离的结构
- 后端采用模块化设计，职责分离
- 配置文件和业务逻辑分离
- 使用环境变量管理配置
- 测试文件与源代码分离

## 预期成果

### 前端预期成果
1. 完整的前端项目代码
2. 用户友好的界面交互
3. 与后端API完整对接
4. 完善的错误处理机制
5. 响应式设计支持多设备
6. 良好的性能指标
7. 现代化的UI设计和用户体验
8. 完整的测试覆盖
9. 完善的调试和监控工具

### 后端预期成果
1. 稳定的API服务
2. 完善的书签管理功能
3. 高效的自动分类和打标算法
4. 可靠的数据存储机制
5. 良好的扩展性和维护性
6. 完善的错误处理和日志记录
7. 安全的API访问机制
8. 详细的调试和监控支持

## iFlow Agents配置

项目已配置以下iFlow Agents以提升开发体验：

### DX Optimizer (开发体验优化器)
- 优化项目工具链配置
- 改进开发工作流程
- 提升代码质量和一致性
- 配置编辑器和IDE设置

### Error Detective (错误侦探)
- 检测和分析代码错误
- 监控运行时异常
- 识别性能问题
- 提供修复建议

### Debugger (调试器)
- 配置调试环境
- 设置断点和监控点
- 分析变量变化
- 提供调试策略

### MCP (Model Context Protocol) 集成
- Chrome DevTools MCP集成
- 提供浏览器开发工具上下文
- 支持实时调试和分析