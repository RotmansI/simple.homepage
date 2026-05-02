import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUserSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('language')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error fetching user settings:", error);
    return { language: 'en' }; // Fallback לדיפולט שבחרנו
  }

  return data;
};