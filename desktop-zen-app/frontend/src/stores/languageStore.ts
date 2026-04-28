import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Language = 'en' | 'zh'

export const translations = {
  en: {
    // Top Panel
    duration: 'Duration (min)',
    
    // Presets
    think: 'Think',
    study: 'Study',
    work: 'Work',
    
    // Buttons
    start: 'Start',
    cancel: 'Cancel',
    
    // Session Complete
    sessionComplete: 'Session Complete',
    yourZenSessionHasEnded: 'Your Zen session has ended.',
    dismiss: 'Dismiss',
  },
  zh: {
    // Top Panel
    duration: '时长 (分钟)',
    
    // Presets
    think: '思考',
    study: '学习',
    work: '工作',
    
    // Buttons
    start: '开始',
    cancel: '取消',
    
    // Session Complete
    sessionComplete: '会话完成',
    yourZenSessionHasEnded: '您的禅修会话已结束。',
    dismiss: '关闭',
  },
}

export const useLanguageStore = defineStore('language', () => {
  const language = ref<Language>('en')

  function setLanguage(lang: Language) {
    language.value = lang
    // Save to localStorage
    localStorage.setItem('zen-app-language', lang)
  }

  function initLanguage() {
    // Try to load from localStorage
    const saved = localStorage.getItem('zen-app-language') as Language | null
    if (saved && (saved === 'en' || saved === 'zh')) {
      language.value = saved
    } else {
      // Try to detect system language
      const systemLang = navigator.language.toLowerCase()
      if (systemLang.startsWith('zh')) {
        language.value = 'zh'
      } else {
        language.value = 'en'
      }
      localStorage.setItem('zen-app-language', language.value)
    }
  }

  function t(key: keyof typeof translations.en): string {
    return translations[language.value][key] || translations.en[key]
  }

  return {
    language,
    setLanguage,
    initLanguage,
    t,
  }
})
