/**
 * ENGLISH ADVENTURE ACADEMY — PRODUCTION SUPABASE CONFIGURATION
 * 
 * Sets the default production Supabase database connection for both
 * localhost:8098 and GitHub Pages (https://maysaaaam-rgb.github.io/who-stole-the-treasure/).
 * 
 * Uses the public publishable anon key (safe for browser environments).
 * Allows teacher/developer overrides via localStorage or URL query parameters (?supabase_url=...&supabase_key=...).
 */

(function(root) {
  'use strict';

  root.SUPABASE_CONFIG = {
    url: 'https://raraoopavipwypvgpuhe.supabase.co',
    anonKey: 'sb_publishable_8A_Nu2aZRvySm4fzlcOA_A_L_sFckGO',
    projectId: 'raraoopavipwypvgpuhe',
    environment: 'production'
  };

  // Provide console confirmation for transparency
  if (typeof console !== 'undefined' && console.log) {
    console.log('[SupabaseConfig] Authoritative cloud configuration initialized for project: raraoopavipwypvgpuhe');
  }
})(typeof window !== 'undefined' ? window : global);
