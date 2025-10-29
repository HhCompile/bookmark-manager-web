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
- date-fns (日期处理)
- lodash-es (工具库)

#### 后端技术栈
- Flask 2.3.2 (Python Web框架)
- BeautifulSoup4 4.12.2 (HTML解析库)
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
└── vitest.config.ts       # 测试配置文件
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
- 使用Vite创建React项目，支持TypeScript和现代ES6+语法
- 配置Tailwind CSS样式框架，实现响应式设计
- 创建自定义UI组件库，包括按钮、通知等基础组件
- 配置React Router v7路由，实现单页应用导航
- 创建基础页面组件结构(Header, Footer, UploadPage, BookmarkList, DuplicateCheck)
- 配置Axios HTTP客户端，封装统一的API调用服务
- 创建API服务层封装，提供类型安全的接口调用
- 配置Zustand状态管理方案，实现全局状态共享
- 集成Sonner通知组件，提供美观的用户反馈
- 集成Lucide React图标库，提供丰富的图标资源

#### 路由系统
- 实现基于React Router v7的路由配置，支持嵌套路由
- 创建统一布局组件(Layout.tsx)管理页面公共结构
- 配置主页、书签列表、重复检查三个主要路由

#### 文件上传功能
- 实现文件选择和上传功能，支持拖拽上传
- 处理上传结果展示，提供友好的用户反馈
- 与后端`/bookmark/upload`接口对接，实现文件上传和处理
- 添加错误处理和用户提示，提升用户体验
- 支持文件拖拽上传，提供现代化交互体验
- 支持上传进度显示，让用户了解上传状态
- 支持文件移除功能，允许用户取消已选择的文件
- 使用Sonner组件显示友好的通知消息

#### 书签管理功能
- 实现书签列表数据获取和展示，支持分页加载
- 添加分类筛选功能，用户可以按分类查看书签
- 添加标签筛选功能，用户可以按标签查看书签
- 实现书签删除功能，支持单个和批量删除
- 支持网格视图、列表视图和表格视图，满足不同用户需求
- 支持批量选择和删除，提高操作效率
- 支持自动打标和分类功能，智能管理书签
- 支持书签更新功能，允许用户修改书签信息

#### 重复检查功能
- 实现重复书签检测算法，基于URL识别重复书签
- 展示重复书签列表，按组显示重复项
- 提供重复书签对比视图，便于用户识别差异
- 实现选择性删除功能，用户可选择保留特定书签
- 添加批量处理功能，支持批量保留或删除重复项
- 无效书签检测和清理功能，识别并处理无效URL

#### 调试和测试功能
- 添加Zustand开发工具中间件支持，便于状态调试
- 创建前端调试工具库，提供实用的调试函数
- 配置Vitest测试框架，支持单元测试和组件测试
- 添加组件测试示例，确保代码质量
- 配置VS Code调试环境，提升开发体验
- 添加API调用性能监控，优化应用性能

### 后端功能
#### API接口
- 实现健康检查接口 (/health)，用于监控服务状态
- 实现文件上传接口 (/bookmark/upload)，支持HTML书签文件上传和解析
- 实现书签添加接口 (/bookmark)，支持单个书签添加和自动处理
- 实现批量书签添加接口 (/bookmarks/batch)，支持批量书签添加和自动处理
- 实现获取所有书签接口 (/bookmarks)，返回完整的书签列表
- 实现按分类获取书签接口 (/bookmarks/category/{category})，支持分类筛选
- 实现按标签获取书签接口 (/bookmarks/tag/{tag})，支持标签筛选
- 实现删除书签接口 (/bookmark/{url})，支持按URL删除书签
- 实现更新书签接口 (/bookmark/{url})，支持按URL更新书签

#### 核心功能
- 实现书签数据结构定义，支持URL、标题、标签和分类
- 实现书签管理器核心逻辑，提供书签的增删改查功能
- 实现自动打标和分类算法，基于关键词智能处理书签
- 实现数据存储接口（JSON格式），支持书签数据持久化
- 支持HTML书签文件解析，提取书签信息
- 添加详细的日志记录功能，便于问题排查

#### 调试和监控功能
- 添加结构化日志记录，便于日志分析
- 配置Flask调试模式，提升开发效率
- 配置VS Code后端调试环境，简化调试流程

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

1. **跨域问题**: 前端已配置Vite代理解决开发环境跨域
2. **大文件上传**: 后端已配置文件大小限制(16MB)，后续可实现分片上传
3. **数据量大**: 前端已实现分页加载机制，避免一次性加载大量数据
4. **浏览器兼容性**: 使用现代浏览器特性，后续可添加Babel和Polyfill处理兼容性
5. **状态管理复杂性**: 使用Zustand简化状态管理，并集成开发工具支持
6. **API集成问题**: 创建统一的API服务层封装，提高可维护性
7. **数据持久化**: 当前使用JSON文件存储，后续可迁移至数据库
8. **安全性**: 后续需添加API身份验证和请求数据验证
9. **调试困难**: 已配置完整的前后端调试环境和工具
10. **测试覆盖不足**: 已配置Vitest测试框架，支持单元测试和组件测试

## 开发约定

### 前端开发约定
- 使用函数式组件和Hooks，遵循React最佳实践
- 使用TypeScript增强代码可维护性和类型安全
- 使用Tailwind CSS进行样式开发，实现响应式设计
- 组件化开发，提高代码复用性和可维护性
- 使用Zustand进行状态管理，简化全局状态共享
- 遵循ESLint代码规范，保证代码质量
- 使用Vitest进行测试，确保功能正确性
- 遵循调试最佳实践，提升开发效率

### 后端开发约定
- 使用Flask框架开发RESTful API，遵循RESTful设计原则
- 遵循Python PEP8代码规范，保证代码风格一致性
- 使用JSON格式进行数据交换，确保前后端数据兼容性
- 实现统一的错误处理机制，提高系统稳定性
- 使用结构化日志记录，便于问题排查和系统监控
- 遵循调试和监控最佳实践，提升开发和运维效率

### 项目结构约定
- 前端采用页面组件和功能组件分离的结构，提高代码组织性
- 后端采用模块化设计，职责分离，提高代码可维护性
- 配置文件和业务逻辑分离，便于配置管理
- 使用环境变量管理配置，提高部署灵活性
- 测试文件与源代码分离，保证项目结构清晰

## 预期成果

### 前端预期成果
1. 完整的前端项目代码，使用React 19和TypeScript构建
2. 用户友好的界面交互，支持现代化的UI设计
3. 与后端API完整对接，实现数据交互和功能调用
4. 完善的错误处理机制，提供友好的用户提示
5. 响应式设计支持多设备，适配不同屏幕尺寸
6. 良好的性能指标，优化加载速度和交互体验
7. 现代化的UI设计和用户体验，提升用户满意度
8. 完整的测试覆盖，确保代码质量和功能稳定性
9. 完善的调试和监控工具，便于开发和问题排查

### 后端预期成果
1. 稳定的API服务，提供高效的书签管理功能
2. 完善的书签管理功能，支持增删改查等操作
3. 高效的自动分类和打标算法，智能处理书签数据
4. 可靠的数据存储机制，使用JSON格式存储书签信息
5. 良好的扩展性和维护性，便于后续功能迭代
6. 完善的错误处理和日志记录，提高系统稳定性
7. 安全的API访问机制，保护数据安全
8. 详细的调试和监控支持，便于系统维护和问题排查

## iFlow Agents配置

项目已配置以下iFlow Agents以提升开发体验：

### DX Optimizer (开发体验优化器)
- 优化项目工具链配置，提升开发效率
- 改进开发工作流程，规范开发操作
- 提升代码质量和一致性，确保代码规范
- 配置编辑器和IDE设置，优化开发环境

### Error Detective (错误侦探)
- 检测和分析代码错误，定位问题根源
- 监控运行时异常，及时发现潜在问题
- 识别性能问题，优化应用性能
- 提供修复建议，协助解决问题

### Debugger (调试器)
- 配置调试环境，简化调试流程
- 设置断点和监控点，便于问题排查
- 分析变量变化，理解程序执行过程
- 提供调试策略，提升调试效率

### MCP (Model Context Protocol) 集成
- Chrome DevTools MCP集成，提供浏览器开发工具上下文
- 提供浏览器开发工具上下文，增强调试能力
- 支持实时调试和分析，提高开发效率