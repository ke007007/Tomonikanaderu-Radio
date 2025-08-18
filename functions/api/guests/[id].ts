import { json, readJson, error, run } from '../_utils';

export const onRequest: PagesFunction = async ({ env, request, params }) => {
  const id = Number(params?.id);
  if (!id) return error('Invalid id', 400);

  if (request.method === 'PUT') {
    const body = await readJson<{ name: string }>(request);
    await run(env as any, `UPDATE guests SET name=? WHERE id=?`, [body.name, id]);
    return json({ success: true });
  }
  if (request.method === 'DELETE') {
    // prevent delete if used by an article
    const used = await run<any>(env as any, `SELECT 1 FROM articles, json_each(guest_ids) AS g WHERE g.value = ? LIMIT 1`, [id]);
    if (used.results?.length) return error('Used by an article', 400);
    await run(env as any, `DELETE FROM guests WHERE id=?`, [id]);
    return json({ success: true });
  }
  return error(`Method ${request.method} not allowed`, 405);
};
