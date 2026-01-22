import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh_TW from './locales/zh_TW.json';
import zh_CN from './locales/zh_CN.json';
import th from './locales/th.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh_TW: { translation: zh_TW },
      zh_CN: { translation: zh_CN },
      th: { translation: th }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;