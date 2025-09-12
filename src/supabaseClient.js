import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kzoacsovknswqolrpbeb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6b2Fjc292a25zd3FvbHJwYmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjA0MjksImV4cCI6MjA3Mjg5NjQyOX0.NKKqML6aHUe4_euUX4x9p6TcTWIfKWeeVn_PQ_pS_o4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);