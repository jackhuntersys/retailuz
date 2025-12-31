// src/types/telegram.ts
export interface TelegramUser {
  telegram_id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

export interface TelegramAuthState {
  user: TelegramUser | null
  isLoading: boolean
  error: string | null
  isTelegramWebApp: boolean
}

export interface TelegramContextType {
  user: TelegramUser | null
  isLoading: boolean
  error: string | null
  isTelegramWebApp: boolean
  logout: () => void
}

