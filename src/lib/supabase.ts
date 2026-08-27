import { createClient } from "@supabase/supabase-js";

// These are public Supabase client values. Row Level Security must protect all tables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://bgdeprbbrerrdrnofogy.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZGVwcmJicmVycmRybm9mb2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTY0ODcsImV4cCI6MjEwMzM5MjQ4N30.yJHURG-XjMbu8RsFEGOWIpVjILoXHb-_xYabaDwdCVo";

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
