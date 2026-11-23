import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getEnvVar(key: string): string | undefined {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch {
    // ignore
  }
  try {
    const globalProcess = (globalThis as any).process;
    if (globalProcess?.env && globalProcess.env[key]) {
      return globalProcess.env[key];
    }
  } catch {
    // ignore
  }
  return undefined;
}

function sanitizeSupabaseUrl(rawUrl: string | undefined): string | undefined {
  if (!rawUrl) return undefined;
  let url = rawUrl.trim();
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  // If user accidentally copied the /rest/v1 or /v1 path from the Supabase dashboard
  url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/v1\/?$/, '');
  return url;
}

const rawSupabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl);
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY')?.trim();

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null =
  isSupabaseConfigured && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      })
    : null;
