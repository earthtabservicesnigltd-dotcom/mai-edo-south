import {
  createBrowserClient,
  createServerClient,
} from "@supabase/ssr";

import { createClient } from "@supabase/supabase-js";

const getUrl = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://placeholder.supabase.co';

const getAnonKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  'placeholder-anon-key';

const getServiceKey = () =>
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  'placeholder-service-key';

/* ---------------- CLIENT ---------------- */

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const supabaseBrowser = () => {
  if (typeof window === 'undefined') {
    return createBrowserClient(getUrl(), getAnonKey());
  }
  if (!browserClient) {
    browserClient = createBrowserClient(getUrl(), getAnonKey());
  }
  return browserClient;
};

export const supabasePublic = createClient(getUrl(), getAnonKey());

/* ---------------- SERVER ---------------- */
export async function supabaseServer() {
  const { cookies } = await import('next/headers');
  const jar = await cookies();

  return createServerClient(getUrl(), getAnonKey(), {
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

/* ---------------- ADMIN ---------------- */

export const supabaseAdmin = () =>
  createClient(getUrl(), getServiceKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });