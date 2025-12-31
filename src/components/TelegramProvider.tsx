import { createContext, useContext, ReactNode } from 'react'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import type { TelegramContextType } from '@/types/telegram'

const TelegramContext = createContext<TelegramContextType | undefined>(undefined)

export function TelegramProvider(
  { children }: { children: ReactNode }
): JSX.Element {
  const auth = useTelegramAuth()

  return (
    <TelegramContext.Provider value={auth}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram(): TelegramContextType {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider')
  }
  return context
}
