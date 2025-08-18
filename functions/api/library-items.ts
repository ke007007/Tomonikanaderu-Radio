// functions/api/library-items.ts
export const onRequest: PagesFunction = async (ctx) => {
  const { request, env } = ctx;

  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { results } = await env.DB
    .prepare("SELECT id, slug, title, library_items FROM articles")
    .all();

  const rows = (results ?? []).map((r: any) => ({
    id: Number(r?.id),
    slug: String(r?.slug ?? ''),
    title: String(r?.title ?? ''),
    library_items: parseArray(r?.library_items),
  }));

  const flattened: any[] = [];
  for (const a of rows) {
    (a.library_items ?? []).forEach((it: any, idx: number) => {
      flattened.push({
        id: `${a.id}-${idx}`,
        type: String(it?.type ?? ''),
        title: String(it?.title ?? ''),
        url: String(it?.url ?? ''),
        articleId: a.id,
        articleSlug: a.slug,
        articleTitle: a.title,
        item_index: idx,
      });
    });
  }

  return new Response(JSON.stringify(flattened), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
};

function parseArray(v: unknown): any[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; }
    catch { return []; }
  }
  return [];
}
