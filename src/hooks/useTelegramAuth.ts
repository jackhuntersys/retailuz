import { useState, useEffect, useCallback } from 'react'
import type {
  TelegramUser,
  TelegramAuthState,
  TelegramContextType,
} from '@/types/telegram'

const BACKEND_URL = 'https://confocal-cuc-thankfully.ngrok-free.dev'
const TOKEN_KEY = 'telegram_token'
const USER_KEY = 'telegram_user'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string
        ready: () => void
        expand: () => void
        close: () => void
      }
    }
  }
}

export function useTelegramAuth(): TelegramContextType {
  const [state, setState] = useState<TelegramAuthState>({
    user: null,
    isLoading: true,
    error: null,
    isTelegramWebApp: false,
  })

  const authenticate = useCallback(async (initData: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/telegram/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      })

      if (!response.ok) {
        throw new Error('Failed to authenticate with backend')
      }

      const data = await response.json()

      if (!data?.success || !data?.user || !data?.token) {
        throw new Error('Invalid authentication response')
      }

      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))

      setState(prev => ({
        ...prev,
        user: data.user as TelegramUser,
        isLoading: false,
        error: null,
      }))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed'

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      const tg = window.Telegram?.WebApp
      const isTelegramWebApp = Boolean(tg)

      setState(prev => ({ ...prev, isTelegramWebApp }))

      if (tg?.initData) {
        tg.ready()
        tg.expand()
        await authenticate(tg.initData)
        return
      }

      // DEV fallback only
      if (import.meta.env.DEV) {
        const cachedUser = localStorage.getItem(USER_KEY)
        if (cachedUser) {
          try {
            const user: TelegramUser = JSON.parse(cachedUser)
            setState(prev => ({
              ...prev,
              user,
              isLoading: false,
            }))
            return
          } catch {
            localStorage.removeItem(USER_KEY)
          }
        }
      }

      setState(prev => ({ ...prev, isLoading: false }))
    }

    initAuth()
  }, [authenticate])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    setState({
      user: null,
      isLoading: false,
      error: null,
      isTelegramWebApp: false,
    })
  }, [])

  return {
    ...state,
    logout,
  }
}
