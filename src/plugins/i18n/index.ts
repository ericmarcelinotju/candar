import { createI18n } from 'vue-i18n'
import stores from '@/stores'
import en from './en.json'
import id from './id.json'

const i18n = createI18n({
  legacy: false,
  locale: stores.getters.locale,
  fallbackLocale: 'en',
  messages: {
    en: en,
    id: id
  }
})

export default i18n
