// src/services/api.ts
type ID = number;

export type Tag = { id: ID; name: string; slug?: string };
export type Person = { id: ID; name: string };
export type LibraryItem = { type: string; title?: string; url?: string };

export type Article = {
  id: ID;
  title: string;
  slug: string;
  content: string;
  audio_links: string[];
  guest_ids: ID[];
  navigator_ids: ID[];
  tag_ids: ID[];
  library_items: LibraryItem[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // サーバー側で付けている展開済み配列（あれば使う）
  guests?: Person[];
  navigators?: Person[];
  tags?: Tag[];
};

const safeString = (v: unknown): string =>
  typeof v === 'string' ? v : v == null ? '' : String(v);

const safeArray = <T>(v: unknown, fallback: T[] = []): T[] => {
  if (v == null) return fallback;
  if (Array.isArray(v)) return v as T[];
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? (p as T[]) : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const normalizeArticle = (r: any): Article => {
  const library = r?.library_items ?? r?.library_json;
  const audio = r?.audio_links ?? r?.audio_json;

  const article: Article = {
    id: Number(r?.id),
    title: safeString(r?.title),
    slug: safeString(r?.slug),
    content: safeString(r?.content),
    audio_links: safeArray<string>(audio, []),
    guest_ids: safeArray<ID>(r?.guest_ids, []),
    navigator_ids: safeArray<ID>(r?.navigator_ids, []),
    tag_ids: safeArray<ID>(r?.tag_ids, []),
    library_items: safeArray<LibraryItem>(library, []),
    created_at: safeString(r?.created_at),
    updated_at: safeString(r?.updated_at),
    published_at: r?.published_at ?? null,
    guests: safeArray<Person>(r?.guests ?? [], []),
    navigators: safeArray<Person>(r?.navigators ?? [], []),
    tags: safeArray<Tag>(r?.tags ?? [], []),
  };

  return article;
};

const base = '';

export const api = {
  async getArticles(): Promise<Article[]> {
    const res = await fetch(`${base}/api/articles`, {
      headers: { 'accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`GET /api/articles ${res.status}`);
    const data = await res.json();
    // サーバーが返した値をフロントでも二重に正規化（undefined対策）
    return safeArray<any>(data, []).map(normalizeArticle);
  },

  // 必要になったら以下に POST/PUT/DELETE などを追記
};
