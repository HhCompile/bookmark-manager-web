<!-- Sync Impact Report:
Version change: 1.0.0 → 1.1.0
Modified principles:
- 代码边界
- 分支命名与生命周期
- UI 组件
- 后端组件策略
- 质量红线
- 任务流转
- 汇报语言
Added sections:
- 一键总验收（本地）
Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ pending
- .specify/templates/spec-template.md: ⚠ pending
- .specify/templates/tasks-template.md: ⚠ pending
- .specify/commands/*.md: ⚠ pending
Follow-up TODOs: None
-->

# Bookmark Manager 项目宪法

## 核心原则

### 1. 代码边界
1. 后端（Python 3.9 + Flask）**仅暴露 API & 静态资源**，禁止出现任何前端构建产物（`*.html`, `*.js`, `*.css`, `dist/` 等）。  
2. 前端（React 19 + TypeScript 5 + Vite）**仅通过 HTTP 调用后端**，禁止出现 ORM、DB 连接、直连数据库环境变量等后端逻辑。  
   - 验收：`make boundary-check`（扫描两端目录，出现违规文件即报错）

### 2. 分支命名与生命周期
1. **命名规则**  
   - 格式：`dev-YYYYMMDD-简短功能描述`  
   - 正则：`^dev-\d{8}-[a-z0-9-]{3,}$`  
   - 约束：小写；日期≥当天；描述≤5 英文单词/10 汉字；禁止 `tmp`/`test` 等模糊词  
   - 验收：`make branch-check`（本地）+ CI 日期逻辑校验

2. **创建/销毁流程**  
   - 禁止直接 `git branch` 后直接 push；统一用 GitHub Issue 侧栏「Create a branch」或命令  
     `gh issue develop <issue-number> --name "dev-日期-功能"`  
   - 服务端 `pre-receive` 钩子拒收不合规命名；紧急热修复需贴「紧急修复审批单」截图并 `@架构师`  
   - MR 合并后 24h 内机器人自动删分支；如需保留，在 MR 描述写「保留分支理由：***」并 `@架构师`  
   - 所有创建/销毁事件由 GitHub Webhook 自动写入 `docs/branch-lifecycle.md`，CI 每日 09:00 校验增量，缺失则阻断 MR  
   - 验收：同上一键脚本

### 3. UI 组件
1. 前端全局使用 **Tailwind CSS 和自定义UI组件库**；缺失时先提 Issue 申请封装，禁止同场景重复造轮子  
2. 公共业务组件统一放在 `src/components/`，**必须同时提供测试文件** `*.test.tsx`，未提供视为未完成  
   - 验收：`make ui-check`（扫描 `src/` 重复组件 + 检测测试文件存在性）

### 4. 后端组件策略
1. 开发前执行 `pip list`，**优先复用** PyPI 官方库；确实缺失需在 `requirements.txt` 登记并通过 Code Review  
   - 验收：`make backend-check`（比对 `requirements.txt` 新增包与自建代码，无登记即报错）

### 5. 质量红线
1. 后端使用 `coverage`，**MR 前覆盖率 ≥ 80%**，缺失行须注释 `# pragma: no cover` 并说明原因  
2. 前端使用 `vitest + @testing-library/react`，**MR 前覆盖率 ≥ 80%**，同样允许 pragma 例外  
   - 验收：`make coverage-check`（低于 80% 或 pragma 无说明即失败）

### 6. 任务流转
1. 项目根目录必须存在 `TODO.md`，**四段式表格**：  
   - 待完成 | 任务ID | 简短描述 |  日期：格式（YYYY-MM-DD）  
   - 待验证 | 任务ID | 简短描述 |  日期：格式（YYYY-MM-DD）
   - 已完成 | 任务ID | 简短描述 |  日期：格式（YYYY-MM-DD）
   - 任务详情｜任务ID｜简短描述｜日期
2. CI 在 MR 时解析 `TODO.md`，若「待完成」仍存在当前 MR 相关任务但未移至「待验证/已完成」，则 MR 失败  
   - 验收：`make todo-check`（解析表格，状态不一致即报错）

### 7. 汇报语言
1. 所有 `commit message`、MR 标题、Code Review 评论、Release Note **必须使用中文**（技术名词允许英文缩写，如 API、CI）  
   - 验收：`make lang-check`（正则扫描非中文段落，出现违规即报错）

## 开发工作流

### 8. 一键总验收（本地）
```bash
make constitution-check
```
依次执行 `boundary-check`、`branch-check`、`ui-check`、`backend-check`、`coverage-check`、`todo-check`、`lang-check`，全部返回 Yes 才允许 push

## 治理
所有 PRs/reviews 必须验证合规性；复杂性必须有合理解释；使用 README.md 和其他文档作为开发指导

**Version**: 1.1.0 | **Ratified**: 2025-10-22 | **Last Amended**: 2025-10-22