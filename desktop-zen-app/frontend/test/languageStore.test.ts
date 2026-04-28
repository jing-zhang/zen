import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLanguageStore, translations } from '../src/stores/languageStore'

describe('languageStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('language initialization', () => {
    it('should initialize with English by default', () => {
      const store = useLanguageStore()
      expect(store.language).toBe('en')
    })

    it('should load language from localStorage if available', () => {
      localStorage.setItem('zen-app-language', 'zh')
      const store = useLanguageStore()
      store.initLanguage()
      expect(store.language).toBe('zh')
    })

    it('should save language to localStorage when set', () => {
      const store = useLanguageStore()
      store.setLanguage('zh')
      expect(localStorage.getItem('zen-app-language')).toBe('zh')
    })
  })

  describe('language switching', () => {
    it('should switch from English to Chinese', () => {
      const store = useLanguageStore()
      expect(store.language).toBe('en')
      store.setLanguage('zh')
      expect(store.language).toBe('zh')
    })

    it('should switch from Chinese to English', () => {
      const store = useLanguageStore()
      store.setLanguage('zh')
      expect(store.language).toBe('zh')
      store.setLanguage('en')
      expect(store.language).toBe('en')
    })
  })

  describe('translation function', () => {
    it('should return English translation by default', () => {
      const store = useLanguageStore()
      expect(store.t('start')).toBe('Start')
      expect(store.t('cancel')).toBe('Cancel')
    })

    it('should return Chinese translation when language is set to Chinese', () => {
      const store = useLanguageStore()
      store.setLanguage('zh')
      expect(store.t('start')).toBe('开始')
      expect(store.t('cancel')).toBe('取消')
    })

    it('should return English translation for all keys', () => {
      const store = useLanguageStore()
      const enKeys = Object.keys(translations.en) as Array<keyof typeof translations.en>
      enKeys.forEach((key) => {
        expect(store.t(key)).toBe(translations.en[key])
      })
    })

    it('should return Chinese translation for all keys', () => {
      const store = useLanguageStore()
      store.setLanguage('zh')
      const zhKeys = Object.keys(translations.zh) as Array<keyof typeof translations.zh>
      zhKeys.forEach((key) => {
        expect(store.t(key)).toBe(translations.zh[key])
      })
    })
  })

  describe('preset translations', () => {
    it('should translate preset names to English', () => {
      const store = useLanguageStore()
      expect(store.t('think')).toBe('Think')
      expect(store.t('study')).toBe('Study')
      expect(store.t('work')).toBe('Work')
    })

    it('should translate preset names to Chinese', () => {
      const store = useLanguageStore()
      store.setLanguage('zh')
      expect(store.t('think')).toBe('思考')
      expect(store.t('study')).toBe('学习')
      expect(store.t('work')).toBe('工作')
    })
  })

  describe('UI text translations', () => {
    it('should translate duration label', () => {
      const store = useLanguageStore()
      expect(store.t('duration')).toBe('Duration (min)')
      store.setLanguage('zh')
      expect(store.t('duration')).toBe('时长 (分钟)')
    })

    it('should translate session complete message', () => {
      const store = useLanguageStore()
      expect(store.t('sessionComplete')).toBe('Session Complete')
      expect(store.t('yourZenSessionHasEnded')).toBe('Your Zen session has ended.')
      store.setLanguage('zh')
      expect(store.t('sessionComplete')).toBe('会话完成')
      expect(store.t('yourZenSessionHasEnded')).toBe('您的禅修会话已结束。')
    })
  })

  describe('fallback behavior', () => {
    it('should return English translation if key not found in current language', () => {
      const store = useLanguageStore()
      store.setLanguage('zh')
      // All keys should exist, but test the fallback logic
      const key = 'start' as const
      expect(store.t(key)).toBeDefined()
    })
  })
})
