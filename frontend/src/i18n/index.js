import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

const savedLanguage = localStorage.getItem('language') || 'ru';

document.documentElement.lang = savedLanguage;

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      translation: ru,
    },
    en: {
      translation: en,
    },
  },
  lng: savedLanguage,
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;