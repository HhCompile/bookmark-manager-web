import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

/**
 * 404 页面未找到组件
 * 当用户访问不存在的路由时显示
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-6">页面未找到</h2>
        <p className="text-text-secondary mb-8">
          抱歉，您访问的页面不存在或已被删除。
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          返回首页
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
