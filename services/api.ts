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
  // サーバー側で展開されていれば使う
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

  return {
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
};

// 同一オリジンの /api/* を叩く
const base = "";

async function getJson<T>(url: string, fallback: T): Promise<T> {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) return fallback;
  try {
    const data = await res.json();
    return (data as T) ?? fallback;
  } catch {
    return fallback;
  }
}

async function postJson<T>(url: string, body: any, fallback: T): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) return fallback;
  try {
    const data = await res.json();
    return (data as T) ?? fallback;
  } catch {
    return fallback;
  }
}

/* ========== API 実装（単体関数として定義） ========== */

async function getArticles(): Promise<Article[]> {
  const data = await getJson<any[]>(`${base}/api/articles`, []);
  return safeArray<any>(data, []).map(normalizeArticle);
}

async function getFlattenedLibraryItems(): Promise<any[]> {
  const items = await getJson<any[]>(`${base}/api/library-items`, []);
  if (Array.isArray(items) && items.length > 0) return items;

  // フォールバック: 記事からフラット化
  const articles = await getArticles();
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
}

async function getGuests(): Promise<Person[]> {
  const data = await getJson<any[]>(`${base}/api/guests`, []);
  return safeArray<any>(data, []).map((g) => ({
    id: Number(g?.id),
    name: safeString(g?.name),
  }));
}

async function getNavigators(): Promise<Person[]> {
  const data = await getJson<any[]>(`${base}/api/navigators`, []);
  return safeArray<any>(data, []).map((n) => ({
    id: Number(n?.id),
    name: safeString(n?.name),
  }));
}

async function getTags(): Promise<Tag[]> {
  const data = await getJson<any[]>(`${base}/api/tags`, []);
  return safeArray<any>(data, []).map((t) => ({
    id: Number(t?.id),
    name: safeString(t?.name),
    slug: t?.slug ? String(t.slug) : undefined,
  }));
}

// 期間指定が無い場合は「直近30日」
function defaultRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  const toIso = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toIso(start), end: toIso(end) };
}

async function getAnalytics(start?: string, end?: string): Promise<any> {
  const r = {
    start: start || defaultRange().start,
    end: end || defaultRange().end,
  };
  const qs = new URLSearchParams(r as any).toString();
  return getJson<any>(`${base}/api/analytics?${qs}`, {
    totalViews: 0,
    topArticles: [],
  });
}

async function trackAnalytics(articleId: number, date?: string): Promise<boolean> {
  const res = await fetch(`${base}/api/analytics/track`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(date ? { articleId, date } : { articleId }),
  });
  return res.ok;
}

/* ========== まとめて export ========== */

export const api = {
  getArticles,
  getFlattenedLibraryItems,
  getGuests,
  getNavigators,
  getTags,
  getAnalytics,
  analytics: getAnalytics,    // 互換用
  trackAnalytics,
};
