import { json, readJson, error, run } from '../_utils';

export const onRequest: PagesFunction = async ({ env, request }) => {
  if (request.method === 'POST') {
    const body = await readJson<{ articleId: number; date?: string }>(request);
    if (!body.articleId) return error('articleId is required', 400);
    const date = body.date || new Date().toISOString().slice(0,10);
    await run(env as any, `INSERT INTO page_views (date, article_id) VALUES (?, ?)`, [date, body.articleId]);
    return json({ success: true });
  }
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
  return error(`Method ${request.method} not allowed`, 405);
};
