# Quick Start Guide: 智能书签管理与分类系统

## 环境准备

### 后端环境

1. 确保安装了Python 3.9或更高版本
2. 安装项目依赖：
   ```bash
   cd bookmark-manager-admin
   pip install -r requirements.txt
   ```

### 前端环境

1. 确保安装了Node.js和pnpm
2. 安装项目依赖：
   ```bash
   cd bookmark-manager
   pnpm install
   ```

## 启动服务

### 启动后端服务

```bash
cd bookmark-manager-admin
python app.py
```

后端服务将在 `http://localhost:9001` 启动。

### 启动前端服务

```bash
cd bookmark-manager
pnpm dev
```

前端服务将在 `http://localhost:3000` 启动。

## 核心功能使用流程

### 1. 上传书签文件

1. 访问前端页面 `http://localhost:3000`
2. 点击"上传书签文件"区域
3. 选择一个HTML格式的书签文件
4. 点击上传按钮
5. 系统将自动处理文件，为书签打标和分类

### 2. 查看书签列表

1. 上传完成后，系统会自动跳转到书签列表页面
2. 可以通过网格视图、列表视图或表格视图查看书签
3. 使用搜索框搜索书签
4. 使用筛选器按分类或标签筛选书签

### 3. 验证书签链接有效性

1. 在书签列表页面，点击"重复检查"导航链接
2. 系统将自动进行三轮链接有效性验证
3. 无效链接将显示在"无效书签"列表中
4. 可以选择删除无效链接

### 4. 管理文件夹结构

1. 在书签列表页面，可以查看系统生成的文件夹结构建议
2. 可以编辑文件夹名称和结构调整
3. 确认后，系统将按文件夹结构整理书签

### 5. 导出书签

1. 在书签列表页面，点击导出按钮
2. 系统将生成通用HTML书签格式文件
3. 可以在浏览器中导入该文件使用整理后的书签

## API接口测试

### 健康检查

```bash
curl http://localhost:9001/health
```

### 上传书签文件

```bash
curl -X POST http://localhost:9001/bookmark/upload \
  -F "file=@path/to/bookmarks.html"
```

### 获取所有书签

```bash
curl http://localhost:9001/bookmarks
```

## 开发指南

### 后端开发

1. 主要代码位于 `bookmark-manager-admin/` 目录
2. `app.py` 是Flask应用入口
3. `bookmark.py` 定义书签数据结构
4. `bookmark_manager.py` 实现书签管理逻辑
5. `classifier.py` 实现自动打标和分类算法
6. `storage.py` 实现数据存储接口

### 前端开发

1. 主要代码位于 `bookmark-manager/` 目录
2. `src/App.tsx` 是React应用根组件
3. `src/pages/` 包含页面组件
4. `src/components/` 包含公共组件
5. `src/services/` 包含API服务
6. `src/store/` 包含状态管理

### 测试

#### 后端测试

```bash
cd bookmark-manager-admin
# 运行测试（需要先安装pytest）
python -m pytest
```

#### 前端测试

```bash
cd bookmark-manager
# 运行测试
pnpm test

# 运行测试（UI界面）
pnpm test:ui

# 运行测试（命令行）
pnpm test:run
```