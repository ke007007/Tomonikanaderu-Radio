import { json, readJson, error, run } from './_utils';

export const onRequest: PagesFunction = async ({ env, request }) => {
  if (request.method === 'GET') {
    const res = await run<any>(env as any, `SELECT id, name, slug FROM tags ORDER BY name ASC`);
    return json(res.results || []);
  }
  if (request.method === 'POST') {
    const body = await readJson<{ name: string }>(request);
    if (!body.name?.trim()) return error('name is required');
    const id = Date.now();
    const slug = body.name.trim().toLowerCase().replace(/\s+/g, '-');
    await run(env as any, `INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)`, [id, body.name.trim(), slug]);
    return json({ id, name: body.name.trim(), slug });
  }
  return error(`Method ${request.method} not allowed`, 405);
};
