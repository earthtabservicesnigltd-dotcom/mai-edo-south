import {
  createBrowserClient,
  createServerClient,
} from "@supabase/ssr";

import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/* ---------------- CLIENT ---------------- */

export const supabasePublic = createClient(URL, ANON);

/* ---------------- SERVER ---------------- */
export async function supabaseServer() {
  const {cookies} = await import('next/headers');
  const jar = await cookies();

  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            jar.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}

export const supabaseBrowser = () => createBrowserClient(URL, ANON)

/* ---------------- ADMIN ---------------- */

export const supabaseAdmin = () =>
  createClient(URL, SVC, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });