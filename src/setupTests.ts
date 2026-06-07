import '@testing-library/jest-dom';

// Mock Google Analytics
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// 设置默认的 mock 函数
window.gtag = jest.fn();
window.dataLayer = [];

// Mock document.title
document.title = 'Test Page';
