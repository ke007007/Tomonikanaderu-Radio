import { json, readJson, error, run } from './_utils';

export const onRequest: PagesFunction = async ({ env, request }) => {
  if (request.method === 'GET') {
    const res = await run<any>(env as any, `SELECT id, name, 'navigator' as role FROM navigators ORDER BY name ASC`);
    return json(res.results || []);
  }
  if (request.method === 'POST') {
    const body = await readJson<{ name: string }>(request);
    if (!body.name?.trim()) return error('name is required');
    const id = Date.now();
    await run(env as any, `INSERT INTO navigators (id, name) VALUES (?, ?)`, [id, body.name.trim()]);
    return json({ id, name: body.name.trim(), role: 'navigator' });
  }
  return error(`Method ${request.method} not allowed`, 405);
};
