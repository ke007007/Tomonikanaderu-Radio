import { json, readJson, error, run } from './_utils';

export const onRequest: PagesFunction = async ({ env, request }) => {
  if (request.method === 'GET') {
    const res = await run<any>(env as any, `SELECT id, name, 'guest' as role FROM guests ORDER BY name ASC`);
    return json(res.results || []);
  }
  if (request.method === 'POST') {
    const body = await readJson<{ name: string }>(request);
    if (!body.name?.trim()) return error('name is required');
    const id = Date.now();
    await run(env as any, `INSERT INTO guests (id, name) VALUES (?, ?)`, [id, body.name.trim()]);
    return json({ id, name: body.name.trim(), role: 'guest' });
  }
  return error(`Method ${request.method} not allowed`, 405);
};
