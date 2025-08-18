export const onRequest: PagesFunction = async (ctx) => { const { request, env } = ctx;

// 記事一覧: JSONカラムを配列に直してから返す
if (request.method === 'GET') { const { results } = await env.DB .prepare("SELECT * FROM articles ORDER BY COALESCE(published_at, created_at) DESC") .all();

const parsed = (results || []).map(parseJsonColumns);
return new Response(JSON.stringify(parsed), {
  headers: { 'content-type': 'application/json; charset=utf-8' }
});
}

// それ以外のメソッドは未対応（必要になったら後で足します）
return new Response('Method Not Allowed', { status: 405 }); };

// 文字列(JSON)として入っているカラムを配列に戻す
function parseJsonColumns(row: any) { const parse = (v: any, def: any) => { if (v == null) return def; if (typeof v === 'string') { try { return JSON.parse(v); } catch { return def; } } return v; };

return { ...row, audio_links: parse(row.audio_links, []), guest_ids: parse(row.guest_ids, []), navigator_ids: parse(row.navigator_ids, []), tag_ids: parse(row.tag_ids, []), library_items: parse(row.library_items, []) }; }
