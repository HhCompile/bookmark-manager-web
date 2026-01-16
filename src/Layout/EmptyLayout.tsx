import { Outlet } from 'react-router-dom';

/**
 * 空布局组件
 * 不含侧边栏，用于登录页等特殊页面
 */
export default function EmptyLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* 主内容区，居中显示 */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}