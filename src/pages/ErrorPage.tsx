import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home } from 'lucide-react';

/**
 * 错误页面组件
 * 当服务器发生错误或其他异常情况时显示
 */
const ErrorPage = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-error mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-6">服务器错误</h2>
        <p className="text-text-secondary mb-8">
          抱歉，服务器发生了内部错误。请稍后重试或联系管理员。
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            刷新页面
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
