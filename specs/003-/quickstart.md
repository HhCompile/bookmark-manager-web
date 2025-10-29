# 快速入门指南: 修复项目测试运行问题并实现测试分析功能

## 概述

本文档提供了修复项目测试运行问题并实现测试分析功能的快速入门指南。按照以下步骤，您可以快速设置环境并开始使用测试功能。

## 前置条件

1. Python 3.9 或更高版本
2. Node.js 16 或更高版本
3. pnpm 包管理器
4. 项目代码已克隆到本地

## 环境设置

### 1. 后端环境设置

```bash
# 进入后端目录
cd bookmark-manager-admin

# 创建虚拟环境（如果尚未创建）
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt
```

### 2. 前端环境设置

```bash
# 进入前端目录
cd bookmark-manager

# 安装依赖
pnpm install
```

## 运行测试

### 1. 运行后端测试

```bash
# 确保在bookmark-manager-admin目录中
cd bookmark-manager-admin

# 激活虚拟环境（如果尚未激活）
source venv/bin/activate

# 运行测试
python -m pytest

# 运行测试并生成覆盖率报告
python -m pytest --cov=. --cov-report=html
```

### 2. 运行前端测试

```bash
# 确保在bookmark-manager目录中
cd bookmark-manager

# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:run --coverage
```

## 使用测试分析功能

### 1. 启动后端服务

```bash
# 确保在bookmark-manager-admin目录中
cd bookmark-manager-admin

# 激活虚拟环境（如果尚未激活）
source venv/bin/activate

# 启动服务
python app.py
```

### 2. 启动前端应用

```bash
# 确保在bookmark-manager目录中
cd bookmark-manager

# 启动开发服务器
pnpm dev
```

### 3. 访问应用

打开浏览器访问 `http://localhost:3000`，您将看到测试管理界面。

## 监控系统资源

系统会自动每秒监控一次系统资源使用情况，您可以在测试运行期间查看CPU和内存使用率。

## 故障排除

### 1. 测试无法运行

- 检查是否已正确安装所有依赖
- 确认虚拟环境已激活（后端）
- 检查端口是否被占用

### 2. 覆盖率报告不准确

- 确保测试已完全运行
- 检查覆盖率工具配置

### 3. 前后端无法通信

- 检查后端服务是否正在运行
- 确认前端配置的API地址正确

## 进一步阅读

- [数据模型文档](./data-model.md)
- [API契约](./contracts/openapi.yaml)
- [功能规范](./spec.md)