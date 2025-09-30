# iFlow 上下文文档

## 项目概述

这是一个使用React技术栈的书签管理前端项目。项目旨在提供一个用户友好的界面来上传、管理、分类和检查重复的书签。

### 技术选型
- React 18 + Hooks
- shadcn/ui (样式组件库)
- Tailwind CSS (样式框架)
- Axios (HTTP客户端)
- Vite (构建工具)
- React Router v6 (路由管理)
- Zustand (状态管理)

### 项目结构规划
```
src/
├── components/          # 公共组件
│   ├── Header.jsx      # 页面头部
│   └── Footer.jsx      # 页面底部
├── pages/              # 页面组件
│   ├── UploadPage.jsx  # 上传页面
│   ├── BookmarkList.jsx # 书签列表页面
│   └── DuplicateCheck.jsx # 重复书签检查页面
├── services/           # API服务
│   └── api.js         # API调用封装
├── lib/                # 工具库
│   └── utils.js       # 通用工具函数
├── App.jsx            # 根组件
└── main.jsx           # 入口文件
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

1. **文件上传模块**
   - 支持上传HTML书签文件
   - 显示上传进度和结果

2. **书签展示模块**
   - 展示所有书签
   - 按分类和标签筛选
   - 支持编辑和删除

3. **重复检查模块**
   - 检测重复书签
   - 提供重复书签对比
   - 支持选择性删除

4. **自动分类模块**
   - 显示系统自动分类结果
   - 支持手动调整分类

## 已实现功能

### 基础框架搭建
- 使用Vite创建React项目
- 配置Tailwind CSS样式框架
- 配置shadcn/ui组件库
- 配置React Router路由
- 创建基础页面组件结构(Header, Footer, UploadPage, BookmarkList, DuplicateCheck)
- 配置Axios HTTP客户端
- 创建API服务层封装
- 配置Zustand状态管理方案

## 开发计划

### 第一阶段：环境搭建和基础框架 (2天)
- 使用Vite创建React项目
- 配置Tailwind CSS样式框架
- 配置shadcn/ui组件库
- 配置React Router路由
- 创建基础页面组件结构
- 配置Axios HTTP客户端
- 创建API服务层封装
- 配置状态管理方案(Zustand)
- 连接后端API进行测试

### 第二阶段：文件上传功能实现 (3天)
- 开发文件上传组件
- 实现文件选择和上传功能
- 添加上传进度显示
- 处理上传结果展示
- 与后端`/bookmark/upload`接口对接
- 添加错误处理和用户提示

### 第三阶段：书签展示和管理功能 (4天)
- 开发书签列表组件
- 实现分类筛选功能
- 实现标签筛选功能
- 开发书签编辑功能
- 实现书签删除功能
- 与后端相关接口对接(`/bookmarks`, `/bookmarks/category/{category}`, `/bookmark/{url}`)

### 第四阶段：重复书签检查功能 (3天)
- 开发重复书签检测算法(前端辅助)
- 创建重复书签展示界面
- 实现重复书签对比功能
- 开发选择性删除功能
- 与后端API协调处理逻辑

### 第五阶段：自动分类标签功能 (3天)
- 开发分类展示组件
- 开发标签展示组件
- 实现手动调整分类功能
- 实现手动调整标签功能
- 与后端API协调自动处理逻辑

### 第六阶段：优化和完善 (3天)
- 优化界面交互和响应式设计
- 添加加载状态和进度提示
- 完善错误处理和用户提示
- 集成测试工具并编写关键组件测试
- 性能分析和优化
- 编写用户使用说明

## 技术风险和应对措施
1. **跨域问题**: 配置Vite代理解决开发环境跨域
2. **大文件上传**: 实现分片上传或限制文件大小
3. **数据量大**: 实现分页加载和虚拟滚动
4. **浏览器兼容性**: 使用Babel和Polyfill处理兼容性
5. **状态管理复杂性**: 使用Zustand简化状态管理
6. **API集成问题**: 创建统一的API服务层封装，提高可维护性

## 开发约定
- 使用函数式组件和Hooks
- 遵循React最佳实践
- 使用Tailwind CSS进行样式开发
- 组件化开发，提高代码复用性
- 编写适当的注释和文档

## 预期成果
1. 完整的前端项目代码
2. 用户友好的界面交互
3. 与后端API完整对接
4. 完善的错误处理机制
5. 响应式设计支持多设备
6. 完整的测试覆盖
7. 良好的性能指标