# 🔖 Bookmark Manager

> 一个现代化的浏览器书签管理 Web 应用：AI 智能整理 + 浏览器同步 + 数据可视化 + 私密保险箱

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=fff&style=flat)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=000&style=flat)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=fff&style=flat)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss&logoColor=fff&style=flat)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

## ✨ 核心功能

- 🔖 **多视图书签管理**：列表 / 卡片 / 树形 3 种展示模式
- 🔄 **Chrome 书签同步**：与浏览器书签双向同步
- 🤖 **AI 智能整理**：自动分类、智能标签、死链检测
- ☁️ **Tag 云可视化**：高频标签云图、点击钻取
- 📊 **数据可视化**：书签健康度监控、活跃度分析
- 🔐 **私密保险箱**：加密存储敏感书签
- ✅ **任务管理器**：批量操作（批量打 tag / 批量归档）
- 📖 **阅读模式**：将书签文章转为清爽阅读视图

## 🛠 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | **React 18.3.1** + TypeScript 5 |
| 构建 | **Vite 6.3.5** |
| 样式 | **Tailwind CSS 4** + Radix UI + shadcn/ui 模式 |
| 动画 | **Motion** (Framer Motion 继任者) |
| 测试 | **Jest** + Testing Library |
| Lint | ESLint + Prettier |
| 包管理 | **pnpm** (workspace 模式) |
| 状态 | React Context + Hooks |

## 📦 项目结构

```
bookmark-manager-web/
├── src/
│   ├── api/          # API 客户端层
│   ├── components/   # 通用组件
│   ├── pages/        # 页面（auth / bookmark / home / tags）
│   ├── contexts/     # 全局 Context
│   ├── hooks/        # 自定义 Hooks
│   ├── router/       # 路由配置
│   ├── locales/      # i18n
│   ├── utils/        # 工具函数
│   ├── types/        # TS 类型
│   ├── styles/       # 全局样式
│   └── mocks/        # mock 数据
├── server/           # 后端服务（占位中）
├── docs/             # 项目文档
├── public/           # 静态资源
└── .claude/          # Claude 协作配置
```

## 🚀 本地开发

```bash
# 1. 克隆
git clone https://github.com/HhCompile/bookmark-manager-web.git
cd bookmark-manager-web

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
# → http://localhost:5173

# 4. 构建生产版本
pnpm build

# 5. 跑测试
pnpm test
```

## 📸 截图

<!-- 部署后截图上传到 docs/screenshot.png，再取消下面注释 -->
<!-- ![Home](docs/screenshot-home.png) -->

_待补_

## 🤝 AI 协作

本项目使用 **Claude / Kimi / Trae** 多 AI 协作开发：

- 📄 `AGENTS.md` — AI 协作指南（项目结构、规范、常用命令）
- 📁 `.claude/` `.kimi/` `.trae/` — 各 AI 工具的配置
- 🤖 AI 参与的功能：智能整理、Tag 建议、阅读模式优化

## 📝 License

MIT

## 🔗 相关仓库

- [bookmark-manager-admin](https://github.com/HhCompile/bookmark-manager-admin) — 管理后台（后端配套）
- [HhCompile/HhCompile](https://github.com/HhCompile/HhCompile) — 个人 Profile（含本项目详情文档）
