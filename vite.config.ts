import { codeInspectorPlugin } from 'code-inspector-plugin';
import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// 获取当前目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 插件配置
    plugins: [
      react(),
      codeInspectorPlugin({
        bundler: 'vite',
      }),
    ],

    // 路径别名配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@utils': path.resolve(__dirname, './src/lib'),
        '@services': path.resolve(__dirname, './src/services'),
        '@store': path.resolve(__dirname, './src/store'),
        '@router': path.resolve(__dirname, './src/router'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
      },
      // 文件扩展名解析
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },

    // 服务器配置
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PORT || '3000'),
      open: env.VITE_OPEN === 'true',
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:9001',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },

    // 构建配置
    build: {
      // 输出目录
      outDir: 'dist',
      // 静态资源目录
      assetsDir: 'assets',
      // 静态资源内联限制
      assetsInlineLimit: 4096,
      // CSS代码分割
      cssCodeSplit: true,
      // 构建后是否生成source map文件
      sourcemap: mode === 'development',
      // 启用/禁用CSS压缩
      cssMinify: true,
      // 启用/禁用JS压缩
      minify: mode === 'production' ? 'esbuild' : false,
      // 小于此阈值的导入或引用资源将内联为base64编码
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: [],
        output: {
          // 分包配置
          manualChunks: {
            // 将React相关库打包在一起
            react: ['react', 'react-dom', 'react-router-dom'],
            // 将UI组件库打包在一起
            ui: ['lucide-react', 'sonner', '@radix-ui/react-*'],
            // 将工具库打包在一起
            utils: ['lodash-es', 'date-fns'],
            // 将状态管理库打包在一起
            state: ['zustand'],
            // 将网络请求库打包在一起
            network: ['axios', '@tanstack/react-query'],
          },
          // 输出文件命名
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
      },
    },

    // 预览配置
    preview: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
    },

    // CSS配置
    css: {
      // 指定传递给CSS预处理器的选项
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    // 优化配置
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
        'sonner',
        'zustand',
        'axios',
        'lodash-es',
        'date-fns',
        '@tanstack/react-query',
        'i18next',
        'react-i18next',
      ],
      // 开发环境下强制优化
      force: mode === 'development',
      // 缓存目录
      cacheDir: path.resolve(__dirname, 'node_modules/.vite-cache'),
    },

    // 环境变量配置
    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version || '0.0.0'
      ),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __IS_DEV__: JSON.stringify(mode === 'development'),
      __IS_PROD__: JSON.stringify(mode === 'production'),
    },

    // 日志配置
    logLevel:
      (env.VITE_LOG_LEVEL as 'info' | 'warn' | 'error' | 'silent') ||
      (mode === 'development' ? 'info' : 'warn'),

    // 工作区配置
    worker: {
      format: 'es',
    },
  };
});
