// Google Analytics 4 配置

// 声明 Window 接口扩展
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// 你的 GA4 测量 ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // 替换为你的实际测量 ID

// 检查是否在开发环境
const isDevelopment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

// 初始化 Google Analytics
const initAnalytics = () => {
  // 检查是否在浏览器环境中且不是开发环境
  if (typeof window !== 'undefined' && !isDevelopment) {
    // 加载 Google Analytics 脚本
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // 配置 GA4
      window.gtag?.('js', new Date());
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
        page_title: document.title,
      });

      // 启用增强型测量
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        enhanced_measurement: {
          page_view: true,
          scroll: true,
          outbound_clicks: true,
          site_search: true,
          form_submit: true,
          file_download: true,
        },
      });
    }
  }
};

// 跟踪页面浏览
const trackPageView = (path: string, title: string) => {
  if (typeof window !== 'undefined' && !isDevelopment && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// 跟踪事件
const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && !isDevelopment && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 跟踪用户交互
const trackUserInteraction = (
  action: string,
  details?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && !isDevelopment && window.gtag) {
    window.gtag('event', action, {
      ...details,
    });
  }
};

// 跟踪性能指标
const trackPerformance = (metricName: string, value: number) => {
  if (typeof window !== 'undefined' && !isDevelopment && window.gtag) {
    window.gtag('event', 'performance_metric', {
      metric_name: metricName,
      value: value,
    });
  }
};

export {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackUserInteraction,
  trackPerformance,
};
