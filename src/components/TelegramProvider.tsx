import { createContext, useContext, ReactNode } from 'react'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'

interface TelegramUser {
  telegram_id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

interface TelegramContextType {
  user: TelegramUser | null
  isLoading: boolean
  error: string | null
  isTelegramWebApp: boolean
  logout: () => void
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined)

export function TelegramProvider({ children }: { children: ReactNode }) {
  const auth = useTelegramAuth()

  return (
    <TelegramContext.Provider value={auth}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider')
  }
  return context
}
