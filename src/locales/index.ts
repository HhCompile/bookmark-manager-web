/**
 * i18n 配置
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zh from './zh';
import en from './en';

const resources = {
  zh: {
    translation: zh,
  },
  en: {
    translation: en,
  },
};

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 绑定 react-i18next
  .use(initReactI18next)
  // 初始化配置
  .init({
    resources,
    fallbackLng: 'zh',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React 已经做了 XSS 防护
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
export { zh, en };
