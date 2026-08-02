import { createClient } from '@supabase/supabase-js'
import { type Database } from '@/lib/database.types'

/**
 * Cliente Supabase con service_role. BYPASSA RLS.
 *
 * ⚠️ Solo debe importarse dentro de `app/api/**`. Nunca desde un componente
 * cliente. Ver docs/ARQUITECTURA.md §4.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}
