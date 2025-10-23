# Data Model: 修复项目测试运行问题并实现测试分析功能

## 实体定义

### TestResult (测试结果)
代表单个测试的结果

**属性**:
- id (string): 唯一标识符
- name (string): 测试名称
- status (enum): 测试状态 (通过/失败/跳过)
- executionTime (number): 执行时间(毫秒)
- errorMessage (string, optional): 错误信息
- stackTrace (string, optional): 堆栈跟踪
- context (object, optional): 相关上下文信息
- type (enum): 测试类型 (单元测试/集成测试/端到端测试)
- createdAt (datetime): 创建时间

**验证规则**:
- status 必须是 PASS, FAIL, SKIP 之一
- executionTime 必须是非负数
- type 必须是 UNIT, INTEGRATION, END_TO_END 之一

### TestSuite (测试套件)
代表一组测试的集合

**属性**:
- id (string): 唯一标识符
- name (string): 套件名称
- testResults (array of TestResult): 测试结果列表
- type (enum): 测试类型 (单元测试/集成测试/端到端测试)
- createdAt (datetime): 创建时间
- updatedAt (datetime): 更新时间

**关系**:
- 包含多个 TestResult 实体
- 支持 UNIT, INTEGRATION, END_TO_END 三种测试类型

### TestReport (测试报告)
代表完整的测试报告

**属性**:
- id (string): 唯一标识符
- testSuiteId (string): 关联的测试套件ID
- totalTests (number): 总测试数
- passedTests (number): 通过测试数
- failedTests (number): 失败测试数
- skippedTests (number): 跳过测试数
- coverage (object): 覆盖率信息
  - lineCoverage (number): 行覆盖率百分比
  - branchCoverage (number, optional): 分支覆盖率百分比
  - functionCoverage (number, optional): 函数覆盖率百分比
- executionTime (number): 总执行时间(毫秒)
- startTime (datetime): 开始时间
- endTime (datetime): 结束时间
- summary (string): 测试摘要

**验证规则**:
- totalTests = passedTests + failedTests + skippedTests
- lineCoverage 在 0-100 之间
- executionTime 必须是非负数

### TestConfiguration (测试配置)
代表测试环境的配置

**属性**:
- id (string): 唯一标识符
- frontendTechStack (string): 前端技术栈
- backendTechStack (string): 后端技术栈
- monitoringFrequency (number): 监控频率(秒)
- createdAt (datetime): 创建时间
- updatedAt (datetime): 更新时间

**验证规则**:
- monitoringFrequency 必须是正数
- frontendTechStack 和 backendTechStack 不能为空

## 实体关系图

```
TestConfiguration 1 ---- 1 TestSuite
TestSuite 1 ---- * TestResult
TestSuite 1 ---- 1 TestReport
```

## 状态转换

### TestResult 状态转换
```
[初始] --> PENDING --> RUNNING --> [PASS|FAIL|SKIP]
```

### TestSuite 状态转换
```
[初始] --> RUNNING --> COMPLETED
```