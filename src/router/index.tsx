import { processRoutes, mergeRoutes } from './utils/index';
import { createBrowserRouter } from 'react-router-dom';
import { errorRoutes } from './modules/error';
import { mainRoutes } from './modules/main';

// 合并所有路由模块
const allRoutes = mergeRoutes(mainRoutes, errorRoutes);

// 处理路由，添加懒加载和守卫
const processedRoutes = processRoutes(allRoutes);

// 创建浏览器路由
const router = createBrowserRouter(processedRoutes);

// 导出路由配置
export default router;

// 导出路由工具函数
export * from './utils';

// 导出路由类型
export * from './types';

// 导出路由模块
export { mainRoutes, errorRoutes };
