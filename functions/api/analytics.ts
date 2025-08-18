import { json, run } from './_utils';

export const onRequest: PagesFunction = async ({ env, request }) => {
  const url = new URL(request.url);
  const start = url.searchParams.get('start') || '1970-01-01';
  const end = url.searchParams.get('end') || new Date().toISOString().slice(0,10);

  const viewsRes = await run<any>(env as any, `SELECT * FROM page_views WHERE date BETWEEN ? AND ?`, [start, end]);
  const filtered = viewsRes.results || [];
  const totalViews = filtered.length;

  const counts: Record<number, number> = {};
  for (const v of filtered) {
    counts[v.article_id] = (counts[v.article_id] || 0) + 1;
  }

  const articlesRes = await run<any>(env as any, `SELECT id, title FROM articles`);
  const articles = new Map<number, string>();
  for (const a of (articlesRes.results || [])) articles.set(a.id, a.title);

  const topArticles = Object.entries(counts).map(([articleId, views]) => ({
    articleId: Number(articleId),
    articleTitle: articles.get(Number(articleId)) || '不明な記事',
    views: Number(views),
  })).sort((a,b) => b.views - a.views).slice(0, 10);

  return json({ totalViews, topArticles });
};
