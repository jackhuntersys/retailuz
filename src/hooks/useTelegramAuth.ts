import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface TelegramUser {
  telegram_id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

interface TelegramAuthState {
  user: TelegramUser | null
  isLoading: boolean
  error: string | null
  isTelegramWebApp: boolean
}

const STORAGE_KEY = 'telegram_user'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
            language_code?: string
          }
        }
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
      }
    }
  }
}

export function useTelegramAuth() {
  const [state, setState] = useState<TelegramAuthState>({
    user: null,
    isLoading: true,
    error: null,
    isTelegramWebApp: false,
  })

  const validateAndAuth = useCallback(async (initData: string) => {
    try {
      console.log('Validating Telegram init data...')
      
      const { data, error } = await supabase.functions.invoke('telegram-auth', {
        body: { initData }
      })

      if (error) {
        console.error('Telegram auth error:', error)
        throw new Error(error.message || 'Authentication failed')
      }

      if (data?.success && data?.user) {
        console.log('Telegram auth successful:', data.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
        setState(prev => ({
          ...prev,
          user: data.user,
          isLoading: false,
          error: null,
        }))
        return data.user
      } else {
        throw new Error('Invalid response from auth server')
      }
    } catch (error) {
      console.error('Auth error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return null
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      // Check if running in Telegram Web App
      const tg = window.Telegram?.WebApp
      const isTelegramWebApp = !!tg?.initData

      setState(prev => ({ ...prev, isTelegramWebApp }))

      if (isTelegramWebApp && tg) {
        // Signal to Telegram that app is ready
        tg.ready()
        tg.expand()

        // Validate with backend
        await validateAndAuth(tg.initData)
      } else {
        // Check for cached user (development mode)
        const cachedUser = localStorage.getItem(STORAGE_KEY)
        if (cachedUser) {
          try {
            const user = JSON.parse(cachedUser)
            setState(prev => ({
              ...prev,
              user,
              isLoading: false,
            }))
          } catch {
            localStorage.removeItem(STORAGE_KEY)
            setState(prev => ({ ...prev, isLoading: false }))
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      }
    }

    initAuth()
  }, [validateAndAuth])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(prev => ({
      ...prev,
      user: null,
      error: null,
    }))
  }, [])

  return {
    ...state,
    logout,
  }
}
