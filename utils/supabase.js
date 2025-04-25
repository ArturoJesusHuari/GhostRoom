import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(url, key)