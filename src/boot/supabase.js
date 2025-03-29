import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default ({ app }) => {
  // This makes the supabase client available in all components
  app.config.globalProperties.$supabase = supabase
}

export { supabase }
