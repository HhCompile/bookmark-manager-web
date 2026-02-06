# 直接读取本地Chrome书签文件功能设计

## 一、功能概述
设计一个功能，让用户点击HTML导入卡片时，直接读取Chrome存储在电脑本地的书签文件，而不是使用Chrome API。

## 二、核心技术方案

### 1. 设备检测模块
- 创建 `src/utils/deviceDetector.ts`
- 实现设备类型检测（移动端、Mac、Windows、Linux）
- 提供 `getDeviceInfo()` 函数返回设备信息

### 2. 权限请求组件
- 创建 `src/components/permission/LocalFilePermission.tsx`
- 实现用户权限请求弹窗
- 处理用户同意/拒绝逻辑

### 3. 书签文件查找服务
- 创建 `src/services/BookmarkFileFinder.ts`
- 实现不同设备的书签文件路径查找
- 提供 `findChromeBookmarkFile()` 函数

### 4. 本地文件读取组件
- 创建 `src/components/upload/LocalFileReader.tsx`
- 实现本地文件系统访问
- 处理文件读取和解析

### 5. 结果确认弹窗
- 创建 `src/components/permission/BookmarkConfirmation.tsx`
- 显示读取到的书签内容
- 提供确认/取消按钮

### 6. 集成到现有系统
- 修改 `src/components/home/FeatureCard.tsx`
- 添加点击事件处理逻辑
- 集成完整的书签读取流程

## 三、核心流程
1. 用户点击HTML导入功能卡片
2. 显示权限请求弹窗
3. 用户同意后，检测设备类型
4. 根据设备类型查找本地Chrome书签文件
5. 读取并解析书签文件内容
6. 显示书签内容确认弹窗
7. 用户确认后，导入书签到应用

## 四、设备特定的书签文件路径

### 1. Windows设备
- 路径：`%LOCALAPPDATA%\Google\Chrome\User Data\Default\Bookmarks`
- 格式：JSON文件

### 2. Mac设备
- 路径：`~/Library/Application Support/Google/Chrome/Default/Bookmarks`
- 格式：JSON文件

### 3. Linux设备
- 路径：`~/.config/google-chrome/Default/Bookmarks`
- 格式：JSON文件

### 4. 移动设备
- 显示HTML文件导入选项
- 提供文件上传界面

## 五、文件读取与解析

### 1. 文件读取
- 使用HTML5 File API读取本地文件
- 处理文件选择和读取操作

### 2. JSON解析
- 利用现有 `parseJsonBookmarks()` 函数解析Chrome书签JSON文件
- 支持书签树状结构解析

### 3. 错误处理
- 处理文件不存在的情况
- 处理文件格式错误的情况
- 处理权限不足的情况

## 六、文件结构变更
- ✅ 新增：`src/utils/deviceDetector.ts`
- ✅ 新增：`src/components/permission/LocalFilePermission.tsx`
- ✅ 新增：`src/services/BookmarkFileFinder.ts`
- ✅ 新增：`src/components/upload/LocalFileReader.tsx`
- ✅ 新增：`src/components/permission/BookmarkConfirmation.tsx`
- ✅ 修改：`src/components/home/FeatureCard.tsx`

## 七、技术实现优势

1. **直接访问**：直接读取本地书签文件，不依赖Chrome API
2. **跨设备兼容**：支持Windows、Mac、Linux和移动设备
3. **用户友好**：清晰的权限请求和结果确认流程
4. **安全可靠**：遵循浏览器安全策略，保护用户隐私
5. **无缝集成**：与现有书签管理系统完美融合

此设计方案实现了直接读取本地Chrome书签文件的功能，确保用户能够方便地将Chrome本地书签导入到书签管理系统中，无需依赖Chrome扩展API。