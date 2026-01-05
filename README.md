# 书签管理前端项目

## 技术选型

- React 18 + Hooks
- shadcn/ui (样式组件库)
- Tailwind CSS (样式框架)
- Axios (HTTP客户端)
- Vite (构建工具)
- React Router v6 (路由管理)

## 项目结构

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
├── App.jsx            # 根组件
└── main.jsx           # 入口文件
```

## 功能模块设计

1. 文件上传模块
   - 支持上传HTML书签文件
   - 显示上传进度和结果

2. 书签展示模块
   - 展示所有书签
   - 按分类和标签筛选
   - 支持编辑和删除

3. 重复检查模块
   - 检测重复书签
   - 提供重复书签对比
   - 支持选择性删除

4. 自动分类模块
   - 显示系统自动分类结果
   - 支持手动调整分类
