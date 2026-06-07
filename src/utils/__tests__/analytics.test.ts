/**
 * Analytics 工具函数测试
 * 
 * 注意：这些测试在 localhost 环境下运行，所以大部分跟踪功能会被禁用
 */

import {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackUserInteraction,
  trackPerformance,
} from '../analytics';

describe('Analytics', () => {
  const mockGtag = jest.fn();
  const originalGtag = window.gtag;

  beforeEach(() => {
    jest.clearAllMocks();
    window.gtag = mockGtag;
    window.dataLayer = [];
  });

  afterEach(() => {
    window.gtag = originalGtag;
  });

  describe('initAnalytics', () => {
    it('should not initialize if gtag already exists', () => {
      window.gtag = mockGtag;

      initAnalytics();

      // 不应该添加脚本
      const scripts = document.querySelectorAll('script[src*="googletagmanager"]');
      expect(scripts.length).toBe(0);
    });
  });

  describe('trackPageView', () => {
    it('should not track in development (localhost)', () => {
      trackPageView('/test-path', 'Test Page');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should not throw if gtag is not available', () => {
      window.gtag = undefined;

      expect(() => trackPageView('/test', 'Test')).not.toThrow();
    });
  });

  describe('trackEvent', () => {
    it('should not track in development', () => {
      trackEvent('category', 'action');

      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('trackUserInteraction', () => {
    it('should not track in development', () => {
      trackUserInteraction('click');

      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('trackPerformance', () => {
    it('should not track in development', () => {
      trackPerformance('loadTime', 1500);

      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('Server-side rendering', () => {
    it('should handle undefined window gracefully', () => {
      const originalWindow = global.window;
      
      // @ts-expect-error: 模拟 SSR 环境
      global.window = undefined;

      expect(() => initAnalytics()).not.toThrow();
      expect(() => trackPageView('/test', 'Test')).not.toThrow();
      expect(() => trackEvent('cat', 'act')).not.toThrow();
      expect(() => trackUserInteraction('click')).not.toThrow();
      expect(() => trackPerformance('metric', 100)).not.toThrow();

      global.window = originalWindow;
    });
  });
});
