export const onRequest: PagesFunction = async (ctx) => {
  const { request, env } = ctx;

  if (request.method === 'GET') {
    // 記事・タクソノミーをまとめて取得
    const [aRes, tRes, gRes, nRes] = await Promise.all([
      env.DB.prepare(
        "SELECT * FROM articles ORDER BY COALESCE(published_at, created_at) DESC"
      ).all(),
      env.DB.prepare("SELECT id, name, slug FROM tags ORDER BY id ASC").all(),
      env.DB.prepare("SELECT id, name FROM guests ORDER BY id ASC").all(),
      env.DB.prepare("SELECT id, name FROM navigators ORDER BY id ASC").all(),
    ]);

    const articles = (aRes.results ?? []).map(normalizeArticleRow);
    const tags = new Map<number, { id: number; name: string; slug?: string }>();
    const guests = new Map<number, { id: number; name: string }>();
    const navigators = new Map<number, { id: number; name: string }>();

    for (const t of tRes.results ?? []) tags.set(Number(t.id), { id: Number(t.id), name: String(t.name ?? ''), slug: t.slug ?? undefined });
    for (const g of gRes.results ?? []) guests.set(Number(g.id), { id: Number(g.id), name: String(g.name ?? '') });
    for (const n of nRes.results ?? []) navigators.set(Number(n.id), { id: Number(n.id), name: String(n.name ?? '') });

    // 記事ごとに guests / navigators / tags を展開（UIが扱いやすい形式に）
    const enriched = articles.map(a => ({
      ...a,
      guests: a.guest_ids.map((id: number) => guests.get(Number(id))).filter(Boolean),
      navigators: a.navigator_ids.map((id: number) => navigators.get(Number(id))).filter(Boolean),
      tags: a.tag_ids.map((id: number) => tags.get(Number(id))).filter(Boolean),
    }));

    return new Response(JSON.stringify(enriched), {
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
};

/* ===== 補助関数（そのまま使ってください）===== */

function safeString(v: unknown): string {
  return typeof v === 'string' ? v : (v == null ? '' : String(v));
}

function safeParseArray(v: unknown, def: any[] = []) {
  if (v == null) return def;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : def;
    } catch {
      return def;
    }
  }
  return Array.isArray(v) ? v : def;
}

function normalizeArticleRow(r: any) {
  // 列名の揺れ対策（library_json / audio_json 名の可能性に備える）
  const library = r.library_items ?? r.library_json;
  const audio   = r.audio_links ?? r.audio_json;

  return {
    id: r.id,
    title:        safeString(r.title),
    slug:         safeString(r.slug),
    content:      safeString(r.content),
    audio_links:   safeParseArray(audio, []),
    guest_ids:     safeParseArray(r.guest_ids, []),
    navigator_ids: safeParseArray(r.navigator_ids, []),
    tag_ids:       safeParseArray(r.tag_ids, []),
    library_items: safeParseArray(library, []),
    created_at:   safeString(r.created_at),
    updated_at:   safeString(r.updated_at),
    published_at: r.published_at ?? null
  };
}
