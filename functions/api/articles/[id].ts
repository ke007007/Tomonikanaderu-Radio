import { json, readJson, error, parseJsonColumns, run, notFound } from '../_utils';
import type { Article } from '../../../types';

function now() { return new Date().toISOString().slice(0,10).replace(/-/g, '.'); }

export const onRequest: PagesFunction = async ({ env, request, params }) => {
  const id = Number(params?.id);
  if (!id) return error('Invalid id', 400);

  if (request.method === 'GET') {
    const res = await run<any>(env as any, `SELECT * FROM articles WHERE id = ?`, [id]);
    const row = res.results?.[0];
    if (!row) return notFound('Article not found');
    return json(parseJsonColumns(row, ['audio_links','guest_ids','navigator_ids','tag_ids','library_items']) as Article);
  }
  if (request.method === 'PUT') {
    const body = await readJson<Partial<Article>>(request);
    const updated_at = now();
    await run(env as any, `UPDATE articles SET title=?, slug=?, published_at=?, status=?, thumbnail_url=?, audio_links=?, guest_ids=?, navigator_ids=?, tag_ids=?, body_markdown=?, library_items=?, updated_at=? WHERE id=?`, [
      body.title,
      body.slug,
      body.published_at ?? null,
      body.status ?? 'draft',
      body.thumbnail_url ?? null,
      JSON.stringify(body.audio_links ?? []),
      JSON.stringify(body.guestIds ?? []),
      JSON.stringify(body.navigatorIds ?? []),
      JSON.stringify(body.tagIds ?? []),
      body.body_markdown ?? '',
      JSON.stringify(body.libraryItems ?? []),
      updated_at,
      id,
    ]);
    const res = await run<any>(env as any, `SELECT * FROM articles WHERE id = ?`, [id]);
    return json(parseJsonColumns(res.results?.[0], ['audio_links','guest_ids','navigator_ids','tag_ids','library_items']) as Article);
  }
  if (request.method === 'DELETE') {
    await run(env as any, `DELETE FROM articles WHERE id = ?`, [id]);
    return json({ success: true });
  }
  return error(`Method ${request.method} not allowed`, 405);
};
