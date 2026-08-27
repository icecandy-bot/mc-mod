import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Recommendation {
  id: string;
  author_name: string;
  mod_ids: string[];
  custom_mods: string[];
  note: string | null;
  edit_token: string;
  created_at: string;
}
