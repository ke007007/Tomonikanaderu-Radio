import { json, readJson, error, run } from '../_utils';

export const onRequest: PagesFunction = async ({ env, request, params }) => {
  const id = Number(params?.id);
  if (!id) return error('Invalid id', 400);

  if (request.method === 'PUT') {
    const body = await readJson<{ name: string }>(request);
    const slug = body.name.trim().toLowerCase().replace(/\s+/g, '-');
    await run(env as any, `UPDATE tags SET name=?, slug=? WHERE id=?`, [body.name, slug, id]);
    return json({ success: true });
  }
  if (request.method === 'DELETE') {
    const used = await run<any>(env as any, `SELECT 1 FROM articles WHERE json_contains(tag_ids, json(?)) LIMIT 1`, [id]);
    if (used.results?.length) return error('Used by an article', 400);
    await run(env as any, `DELETE FROM tags WHERE id=?`, [id]);
    return json({ success: true });
  }
  return error(`Method ${request.method} not allowed`, 405);
};
