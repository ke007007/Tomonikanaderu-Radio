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
  // サーバーが展開して返す場合に備えて
  guests?: Person[];
  navigators?: Person[];
  tags?: Tag[];
};

const safeString = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

const safeArray = <T>(v: unknown, fallback: T[] = []): T[] => {
  if (v == null) return fallback;
  if (Array.isArray(v)) return v as T[];
  if (typeof v === "string") {
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

// 相対パスで同一オリジンの /api/* を叩く
const base = "";

async function getJson<T>(url: string, fallback: T): Promise<T> {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    // 404などは空配列等で復帰
    return fallback;
  }
  try {
    const data = await res.json();
    return (data as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export const api = {
  // 記事一覧（安全な型に正規化）
  async getArticles(): Promise<Article[]> {
    const data = await getJson<any[]>(`${base}/api/articles`, []);
    return safeArray<any>(data, []).map(normalizeArticle);
  },

  // ライブラリー（フラット化されたアイテム一覧）
  // サーバーの /api/library-items を優先。無ければ記事からフラット化して返す。
  async getFlattenedLibraryItems(): Promise<any[]> {
    const items = await getJson<any[]>(`${base}/api/library-items`, []);
    if (Array.isArray(items) && items.length > 0) return items;

    // フォールバック: 記事からフラット化
    const articles = await this.getArticles();
    const flattened: any[] = [];
    for (const a of articles) {
      (a.library_items || []).forEach((it, idx) => {
        flattened.push({
          id: `${a.id}-${idx}`,
          type: it?.type ?? "",
          title: it?.title ?? "",
          url: it?.url ?? "",
          articleId: a.id,
          articleSlug: a.slug,
          articleTitle: a.title,
          item_index: idx,
        });
      });
    }
    return flattened;
  },

  // タクソノミー（管理画面用）。存在しない/失敗時は空配列で復帰
  async getGuests(): Promise<Person[]> {
    const data = await getJson<any[]>(`${base}/api/guests`, []);
    return safeArray<any>(data, []).map((g) => ({ id: Number(g?.id), name: safeString(g?.name) }));
  },
  async getNavigators(): Promise<Person[]> {
    const data = await getJson<any[]>(`${base}/api/navigators`, []);
    return safeArray<any>(data, []).map((n) => ({ id: Number(n?.id), name: safeString(n?.name) }));
  },
  async getTags(): Promise<Tag[]> {
    const data = await getJson<any[]>(`${base}/api/tags`, []);
    return safeArray<any>(data, []).map((t) => ({
      id: Number(t?.id),
      name: safeString(t?.name),
      slug: t?.slug ? String(t.slug) : undefined,
    }));
  },
};
