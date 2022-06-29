import { createClient } from '@supabase/supabase-js'

const supabaseCreds = {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_KEY,
}

export const supabase = createClient(supabaseCreds.url, supabaseCreds.key)

