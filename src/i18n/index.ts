import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import vi from './locales/vi.json'
import en from './locales/en.json'

const resources = {
  vi: {
    translation: vi
  },
  en: {
    translation: en
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    // Chỉ hỗ trợ vi/en và bỏ phần vùng (en-US -> en) để không cache locale đầy đủ
    supportedLngs: ['vi', 'en'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    debug: false,

    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'cj-lang'
    }
  })

export default i18n
