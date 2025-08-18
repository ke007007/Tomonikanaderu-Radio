import { json, readJson, error, parseJsonColumns, run } from './_utils';
import type { Article } from '../../types';

function now() { return new Date().toISOString().slice(0,10).replace(/-/g, '.'); }

export const onRequest: PagesFunction = async ({ env, request }) => {
  const url = new URL(request.url);
  if (request.method === 'GET') {
    const res = await run<any>(env as any, `SELECT * FROM articles ORDER BY CASE WHEN published_at IS NULL THEN 1 ELSE 0 END, published_at DESC`);
    const rows = (res.results || []).map(r => parseJsonColumns(r, ['audio_links','guest_ids','navigator_ids','tag_ids','library_items'])) as Article[];
    return json(rows);
  }
  if (request.method === 'POST') {
    const body = await readJson<Partial<Article>>(request);
    if (!body.title || !body.slug || !body.body_markdown) return error('title, slug, body_markdown are required', 400);
    const id = body.id ?? Date.now();
    const created_at = now();
    const updated_at = created_at;
    const published_at = body.published_at ?? null;
    const status = body.status ?? 'draft';

    await run(env as any, `INSERT INTO articles (id, title, slug, published_at, status, thumbnail_url, audio_links, guest_ids, navigator_ids, tag_ids, body_markdown, library_items, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      id,
      body.title,
      body.slug,
      published_at,
      status,
      body.thumbnail_url ?? null,
      JSON.stringify(body.audio_links ?? []),
      JSON.stringify(body.guestIds ?? []),
      JSON.stringify(body.navigatorIds ?? []),
      JSON.stringify(body.tagIds ?? []),
      body.body_markdown,
      JSON.stringify(body.libraryItems ?? []),
      created_at,
      updated_at,
    ]);
    const res = await run<any>(env as any, `SELECT * FROM articles WHERE id = ?`, [id]);
    const row = res.results?.[0];
    return json(parseJsonColumns(row, ['audio_links','guest_ids','navigator_ids','tag_ids','library_items']));
  }
  return error(`Method ${request.method} not allowed`, 405);
};
