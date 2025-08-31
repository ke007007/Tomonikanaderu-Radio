import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase環境変数が設定されていません。右上の「Connect to Supabase」ボタンをクリックしてセットアップしてください。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          body_markdown: string;
          status: 'draft' | 'published';
          published_at: string | null;
          thumbnail_url: string | null;
          audio_links: any[];
          guest_ids: string[];
          navigator_ids: string[];
          tag_ids: string[];
          library_items: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          body_markdown?: string;
          status?: 'draft' | 'published';
          published_at?: string | null;
          thumbnail_url?: string | null;
          audio_links?: any[];
          guest_ids?: string[];
          navigator_ids?: string[];
          tag_ids?: string[];
          library_items?: any[];
        };
        Update: {
          title?: string;
          slug?: string;
          body_markdown?: string;
          status?: 'draft' | 'published';
          published_at?: string | null;
          thumbnail_url?: string | null;
          audio_links?: any[];
          guest_ids?: string[];
          navigator_ids?: string[];
          tag_ids?: string[];
          library_items?: any[];
        };
      };
      guests: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      navigators: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
      };
      page_views: {
        Row: {
          id: string;
          article_id: string;
          viewed_at: string;
          date: string;
        };
        Insert: {
          article_id: string;
          viewed_at?: string;
          date?: string;
        };
      };
    };
  };
};