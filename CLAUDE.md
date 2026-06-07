# 配置已迁移

> ⚠️ **注意**: 本项目的 Claude 配置已迁移到 Kimi CLI 配置

## 新配置位置

| 原配置 | 新配置 |
|--------|--------|
| `CLAUDE.md` | `.kimi/KIMI.md` |
| `.claude/hooks.json` | `.kimi/hooks.json` |

## 迁移说明

本项目已全面迁移到 **Kimi Code CLI** 进行 AI 辅助开发。

### 迁移原因
1. 统一使用 Kimi CLI 作为项目的主要 AI 开发工具
2. 利用 Kimi 的 Agent Skills 系统进行项目管理
3. 与项目其他配置保持一致

### 如何使用 Kimi CLI

```bash
# 启动 Kimi CLI
cd /Users/sunxiansheng/Mine/www/bookMark-manager
kimi

# 使用项目特定的 Agent Skills
/skill:ui-expert
/skill:pm-expert
/flow:ui-workflow
```

### 查看新配置

新配置位于：
- `.kimi/KIMI.md` - 项目配置和验证规则
- `.kimi/hooks.json` - 文件修改后的自动验证钩子

---

*迁移日期: 2026-04-06*
