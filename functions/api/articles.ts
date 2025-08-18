export const onRequest: PagesFunction = async (ctx) => {
  const { request, env } = ctx;

  if (request.method === 'GET') {
    // 記事一覧を取得（公開日があれば優先、無ければ作成日）
    const { results } = await env.DB
      .prepare("SELECT * FROM articles ORDER BY COALESCE(published_at, created_at) DESC")
      .all();

    // 受け取った行を「安全な型」に正規化してから返す
    const rows = (results ?? []).map(normalizeArticleRow);

    return new Response(JSON.stringify(rows), {
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
};

// ===== 補助関数（そのまま使ってください）=====

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
  // 列名の揺れに予防（環境によって library_json / audio_json の場合も想定）
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
