// 导入路由相关组件
import { RouterProvider } from 'react-router-dom';
// 导入全局样式
import './index.css';
import { Toaster } from '@/components/ui/sonner';

// 导入路由配置
import router from './router';

/**
 * 应用根组件
 * 包含路由配置和整体布局结构
 */
function App() {
  return (
    <div className="App min-h-screen flex flex-col bg-background">
      {/* 路由配置 */}
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;