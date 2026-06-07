# Bookmark Manager Web - Kimi 配置

## 项目概述
React + TypeScript + Vite 前端项目，使用 pnpm 管理依赖。

## 自动验证规则（每次修改后执行）

每次代码修改后，**必须**执行以下验证循环：

### 1. 类型检查
```bash
npx tsc --noEmit
```

### 2. 构建检查
```bash
pnpm build
```

### 3. 测试检查
```bash
pnpm test
```

### 4. 关键文件手动检查
- 修改的组件是否能正常渲染
- 相关功能是否正常工作

## 代码修改原则

1. **小步修改**：每次只修改一个功能点
2. **立即验证**：修改后立即运行上述检查
3. **发现问题立即回滚**：如果验证失败，先回滚再重新尝试
4. **不破坏现有功能**：确保测试通过后再继续

## 技术栈
- React 18.3.1
- TypeScript 5.x
- Vite 6.3.5
- Tailwind CSS 4.1.12
- Jest + React Testing Library

## 常用命令
```bash
pnpm dev      # 开发服务器
pnpm build    # 生产构建
pnpm test     # 运行测试
pnpm lint     # 代码检查
pnpm typecheck # 类型检查
```

---

## 迁移说明

本配置由 Claude 配置迁移而来：
- 原配置: `CLAUDE.md` → 现配置: `.kimi/KIMI.md`
- 原 hooks: `.claude/hooks.json` → 现使用 Kimi 内置验证流程

## Kimi CLI 特定配置

### 使用技能
```bash
/skill:ui-expert        # 加载 UI/UX 设计专家
/skill:frontend-dev     # 加载前端开发规范
/flow:ui-workflow       # 执行 UI 设计工作流
```

### 项目级 Agent 技能
本项目已配置以下 Agent Skills：
- `ui-expert` - UI/UX 设计专家
- `ui-workflow` - UI 设计工作流
- `code-review` - 代码审查
- `pm-expert` - 项目管理

### 文档位置
- 项目文档: `/docs/`
- 前端文档: `/bookmark-manager-web/docs/`
