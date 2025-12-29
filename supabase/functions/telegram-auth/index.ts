import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

async function validateTelegramWebAppData(initData: string, botToken: string): Promise<TelegramUser | null> {
  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) {
      console.error('No hash in init data')
      return null
    }
    
    // Remove hash from params for validation
    params.delete('hash')
    
    // Sort parameters alphabetically
    const sortedParams = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
    
    // Create HMAC-SHA256
    const encoder = new TextEncoder()
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode('WebAppData'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const secretKeyData = await crypto.subtle.sign(
      'HMAC',
      secretKey,
      encoder.encode(botToken)
    )
    
    const dataKey = await crypto.subtle.importKey(
      'raw',
      secretKeyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      dataKey,
      encoder.encode(sortedParams)
    )
    
    const calculatedHash = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    if (calculatedHash !== hash) {
      console.error('Hash mismatch:', { calculated: calculatedHash, received: hash })
      return null
    }
    
    // Parse user data
    const userDataStr = params.get('user')
    if (!userDataStr) {
      console.error('No user data in init data')
      return null
    }
    
    const user = JSON.parse(userDataStr) as TelegramUser
    console.log('Validated Telegram user:', user)
    return user
  } catch (error) {
    console.error('Validation error:', error)
    return null
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN not configured')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { initData } = await req.json()
    
    if (!initData) {
      return new Response(
        JSON.stringify({ error: 'Missing initData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Validating Telegram init data...')
    const telegramUser = await validateTelegramWebAppData(initData, botToken)
    
    if (!telegramUser) {
      return new Response(
        JSON.stringify({ error: 'Invalid Telegram data' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return validated user data
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          telegram_id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          username: telegramUser.username,
          photo_url: telegramUser.photo_url,
          language_code: telegramUser.language_code,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
