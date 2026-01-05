import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// 导入翻译资源
import zhTranslations from './zh.json';
import enTranslations from './en.json';

// 初始化i18next
const i18nInstance = i18n.createInstance();

i18nInstance.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    zh: {
      translation: zhTranslations,
    },
  },
  lng: 'zh', // 默认语言
  fallbackLng: 'en', // 回退语言
  interpolation: {
    escapeValue: false, // 不需要React转义
  },
  react: {
    useSuspense: false, // 关闭Suspense，简化使用
  },
});

export default i18nInstance;
