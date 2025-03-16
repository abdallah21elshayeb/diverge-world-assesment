import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import ar from '../locales/ar.json'
// Define translation messages
const messages = { en, ar }

// Define the type for i18n messages
type MessageSchema = (typeof messages)['en']

// Create the i18n instance with type safety
const i18n = createI18n<[MessageSchema], 'en' | 'ar'>({
  legacy: false, 
  locale: 'en', // Default language
  fallbackLocale: 'en', // Fallback language
  globalInjection: true, // Allows using `$t` globally in templates
  messages,
})

export default i18n;

