import { createClient } from '@supabase/supabase-js'

// Usamos import.meta.env para que Vite lea las variables del archivo .env de forma segura
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)