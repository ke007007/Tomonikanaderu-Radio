// functions/api/articles.ts
export const onRequest: PagesFunction = async (ctx) => {
  const { request, env } = ctx;

  if (request.method === 'GET') {
    // 記事＋タクソノミーをまとめて取得
    const [aRes, tRes, gRes, nRes] = await Promise.all([
      env.DB.prepare(
        "SELECT * FROM articles ORDER BY COALESCE(published_at, created_at) DESC"
      ).all(),
      env.DB.prepare("SELECT id, name, slug FROM tags ORDER BY id ASC").all(),
      env.DB.prepare("SELECT id, name FROM guests ORDER BY id ASC").all(),
      env.DB.prepare("SELECT id, name FROM navigators ORDER BY id ASC").all(),
    ]);

    const articles = (aRes.results ?? []).map(normalizeArticleRow);

    const tagMap = new Map<number, { id: number; name: string; slug?: string }>();
    const guestMap = new Map<number, { id: number; name: string }>();
    const navMap = new Map<number, { id: number; name: string }>();
    for (const t of tRes.results ?? []) tagMap.set(Number(t.id), { id: Number(t.id), name: String(t.name ?? ''), slug: t.slug ?? undefined });
    for (const g of gRes.results ?? []) guestMap.set(Number(g.id), { id: Number(g.id), name: String(g.name ?? '') });
    for (const n of nRes.results ?? []) navMap.set(Number(n.id), { id: Number(n.id), name: String(n.name ?? '') });

    const enriched = articles.map(a => {
      const guests = a.guest_ids.map((id: number) => guestMap.get(Number(id))).filter(Boolean) as any[];
      const navigators = a.navigator_ids.map((id: number) => navMap.get(Number(id))).filter(Boolean) as any[];
      const tags = a.tag_ids.map((id: number) => tagMap.get(Number(id))).filter(Boolean) as any[];

      // UIが includes で参照しがちな派生配列を追加
      const guest_names = guests.map(g => g?.name ?? '');
      const navigator_names = navigators.map(n => n?.name ?? '');
      const tag_slugs = tags.map(t => t?.slug ?? '').filter(Boolean);
      const tag_names = tags.map(t => t?.name ?? '');

      // library_items の title/url/type を配列で補助
      const library_titles = (a.library_items ?? []).map((it: any) => it?.title ?? '');
      const library_urls = (a.library_items ?? []).map((it: any) => it?.url ?? '');
      const library_types = (a.library_items ?? []).map((it: any) => it?.type ?? '');

      return {
        ...a,
        guests, navigators, tags,
        guest_names, navigator_names, tag_slugs, tag_names,
        library_titles, library_urls, library_types,
      };
    });

    return new Response(JSON.stringify(enriched), {
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
};

// 安全化ユーティリティ
function safeString(v: unknown): string {
  return typeof v === 'string' ? v : (v == null ? '' : String(v));
}
function safeParseArray(v: unknown, def: any[] = []) {
  if (v == null) return def;
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : def; }
    catch { return def; }
  }
  return Array.isArray(v) ? v : def;
}
function normalizeArticleRow(r: any) {
  const library = r?.library_items ?? r?.library_json;
  const audio   = r?.audio_links ?? r?.audio_json;
  return {
    id: r.id,
    title:        safeString(r?.title),
    slug:         safeString(r?.slug),
    content:      safeString(r?.content),
    audio_links:   safeParseArray(audio, []),
    guest_ids:     safeParseArray(r?.guest_ids, []),
    navigator_ids: safeParseArray(r?.navigator_ids, []),
    tag_ids:       safeParseArray(r?.tag_ids, []),
    library_items: safeParseArray(library, []),
    created_at:   safeString(r?.created_at),
    updated_at:   safeString(r?.updated_at),
    published_at: r?.published_at ?? null
  };
}
