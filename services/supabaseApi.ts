import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import type { Article, Person, Tag, LibraryItem } from '../types';

type Tables = Database['public']['Tables'];
type ArticleRow = Tables['articles']['Row'];
type GuestRow = Tables['guests']['Row'];
type NavigatorRow = Tables['navigators']['Row'];
type TagRow = Tables['tags']['Row'];

// データ変換ヘルパー
const convertArticleFromDB = (row: ArticleRow): Article => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  content: row.body_markdown,
  audio_links: Array.isArray(row.audio_links) ? row.audio_links.map(link => link.url || '') : [],
  guestIds: Array.isArray(row.guest_ids) ? row.guest_ids : [],
  navigatorIds: Array.isArray(row.navigator_ids) ? row.navigator_ids : [],
  tagIds: Array.isArray(row.tag_ids) ? row.tag_ids : [],
  library_items: Array.isArray(row.library_items) ? row.library_items : [],
  published_at: row.published_at,
  created_at: row.created_at,
  updated_at: row.updated_at,
  body_markdown: row.body_markdown,
  status: row.status,
  thumbnail_url: row.thumbnail_url,
  libraryItems: Array.isArray(row.library_items) ? row.library_items : [],
});

const convertPersonFromDB = (row: GuestRow | NavigatorRow, role: 'guest' | 'navigator'): Person => ({
  id: row.id,
  name: row.name,
  role,
});

const convertTagFromDB = (row: TagRow): Tag => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
});

// 記事API
export const articlesApi = {
  async getAll(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false });
    
    if (error) {
      console.error('記事の取得に失敗しました:', error);
      return [];
    }
    
    return (data || []).map(convertArticleFromDB);
  },

  async getBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('記事の取得に失敗しました:', error);
      return null;
    }
    
    return data ? convertArticleFromDB(data) : null;
  },

  async create(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        slug: article.slug,
        body_markdown: article.body_markdown || article.content,
        status: article.status,
        published_at: article.published_at,
        thumbnail_url: article.thumbnail_url,
        audio_links: article.audio_links.map(url => ({ platform: 'spotify', url })),
        guest_ids: article.guestIds,
        navigator_ids: article.navigatorIds,
        tag_ids: article.tagIds,
        library_items: article.libraryItems || article.library_items,
      })
      .select()
      .single();
    
    if (error) {
      console.error('記事の作成に失敗しました:', error);
      return null;
    }
    
    return data ? convertArticleFromDB(data) : null;
  },

  async update(id: string, updates: Partial<Article>): Promise<Article | null> {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.body_markdown !== undefined) updateData.body_markdown = updates.body_markdown;
    if (updates.content !== undefined) updateData.body_markdown = updates.content;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.published_at !== undefined) updateData.published_at = updates.published_at;
    if (updates.thumbnail_url !== undefined) updateData.thumbnail_url = updates.thumbnail_url;
    if (updates.audio_links !== undefined) updateData.audio_links = updates.audio_links.map(url => ({ platform: 'spotify', url }));
    if (updates.guestIds !== undefined) updateData.guest_ids = updates.guestIds;
    if (updates.navigatorIds !== undefined) updateData.navigator_ids = updates.navigatorIds;
    if (updates.tagIds !== undefined) updateData.tag_ids = updates.tagIds;
    if (updates.libraryItems !== undefined) updateData.library_items = updates.libraryItems;
    if (updates.library_items !== undefined) updateData.library_items = updates.library_items;

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('記事の更新に失敗しました:', error);
      return null;
    }
    
    return data ? convertArticleFromDB(data) : null;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('記事の削除に失敗しました:', error);
      return false;
    }
    
    return true;
  },
};

// ゲストAPI
export const guestsApi = {
  async getAll(): Promise<Person[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('ゲストの取得に失敗しました:', error);
      return [];
    }
    
    return (data || []).map(row => convertPersonFromDB(row, 'guest'));
  },

  async create(name: string): Promise<Person | null> {
    const { data, error } = await supabase
      .from('guests')
      .insert({ name })
      .select()
      .single();
    
    if (error) {
      console.error('ゲストの作成に失敗しました:', error);
      return null;
    }
    
    return data ? convertPersonFromDB(data, 'guest') : null;
  },

  async update(id: string, name: string): Promise<boolean> {
    const { error } = await supabase
      .from('guests')
      .update({ name })
      .eq('id', id);
    
    if (error) {
      console.error('ゲストの更新に失敗しました:', error);
      return false;
    }
    
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('ゲストの削除に失敗しました:', error);
      return false;
    }
    
    return true;
  },
};

// ナビゲーターAPI
export const navigatorsApi = {
  async getAll(): Promise<Person[]> {
    const { data, error } = await supabase
      .from('navigators')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('ナビゲーターの取得に失敗しました:', error);
      return [];
    }
    
    return (data || []).map(row => convertPersonFromDB(row, 'navigator'));
  },

  async create(name: string): Promise<Person | null> {
    const { data, error } = await supabase
      .from('navigators')
      .insert({ name })
      .select()
      .single();
    
    if (error) {
      console.error('ナビゲーターの作成に失敗しました:', error);
      return null;
    }
    
    return data ? convertPersonFromDB(data, 'navigator') : null;
  },

  async update(id: string, name: string): Promise<boolean> {
    const { error } = await supabase
      .from('navigators')
      .update({ name })
      .eq('id', id);
    
    if (error) {
      console.error('ナビゲーターの更新に失敗しました:', error);
      return false;
    }
    
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('navigators')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('ナビゲーターの削除に失敗しました:', error);
      return false;
    }
    
    return true;
  },
};

// タグAPI
export const tagsApi = {
  async getAll(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('タグの取得に失敗しました:', error);
      return [];
    }
    
    return (data || []).map(convertTagFromDB);
  },

  async create(name: string): Promise<Tag | null> {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    
    const { data, error } = await supabase
      .from('tags')
      .insert({ name, slug })
      .select()
      .single();
    
    if (error) {
      console.error('タグの作成に失敗しました:', error);
      return null;
    }
    
    return data ? convertTagFromDB(data) : null;
  },

  async update(id: string, name: string): Promise<boolean> {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    
    const { error } = await supabase
      .from('tags')
      .update({ name, slug })
      .eq('id', id);
    
    if (error) {
      console.error('タグの更新に失敗しました:', error);
      return false;
    }
    
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('タグの削除に失敗しました:', error);
      return false;
    }
    
    return true;
  },
};

// アナリティクスAPI
export const analyticsApi = {
  async trackPageView(articleId: string): Promise<boolean> {
    const { error } = await supabase
      .from('page_views')
      .insert({ article_id: articleId });
    
    if (error) {
      console.error('ページビューの記録に失敗しました:', error);
      return false;
    }
    
    return true;
  },

  async getAnalytics(startDate: string, endDate: string): Promise<{
    totalViews: number;
    topArticles: { articleId: string; articleTitle: string; views: number }[];
  }> {
    // ページビューの集計
    const { data: viewsData, error: viewsError } = await supabase
      .from('page_views')
      .select('article_id, articles!inner(title)')
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (viewsError) {
      console.error('アナリティクスの取得に失敗しました:', viewsError);
      return { totalViews: 0, topArticles: [] };
    }

    const totalViews = viewsData?.length || 0;
    
    // 記事別のビュー数を集計
    const articleViews: Record<string, { title: string; count: number }> = {};
    
    viewsData?.forEach(view => {
      const articleId = view.article_id;
      const title = (view.articles as any)?.title || '不明な記事';
      
      if (!articleViews[articleId]) {
        articleViews[articleId] = { title, count: 0 };
      }
      articleViews[articleId].count++;
    });

    const topArticles = Object.entries(articleViews)
      .map(([articleId, { title, count }]) => ({
        articleId,
        articleTitle: title,
        views: count,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return { totalViews, topArticles };
  },
};

// 統合API
export const supabaseApi = {
  articles: articlesApi,
  guests: guestsApi,
  navigators: navigatorsApi,
  tags: tagsApi,
  analytics: analyticsApi,

  // ライブラリアイテムの取得（記事から展開）
  async getFlattenedLibraryItems(): Promise<any[]> {
    const articles = await articlesApi.getAll();
    const flattened: any[] = [];
    
    articles.forEach(article => {
      (article.library_items || []).forEach((item: any, index: number) => {
        flattened.push({
          id: `${article.id}-${index}`,
          type: item.type || '',
          title: item.title || '',
          url: item.url || '',
          creator: item.creator || '',
          thumbnail_url: item.thumbnail_url || null,
          links: item.links || [],
          articleId: article.id,
          articleSlug: article.slug,
          articleTitle: article.title,
          item_index: index,
          created_at: item.created_at || article.created_at,
        });
      });
    });
    
    return flattened.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
};