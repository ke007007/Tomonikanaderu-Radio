import { json, error, parseJsonColumns, run, notFound } from '../../_utils';
import type { Article } from '../../../../types';

export const onRequest: PagesFunction = async ({ env, params }) => {
  const slug = String(params?.slug || '');
  if (!slug) return error('Invalid slug', 400);

  const res = await run<any>(env as any, `SELECT * FROM articles WHERE slug = ?`, [slug]);
  const row = res.results?.[0];
  if (!row) return notFound('Article not found');
  return json(parseJsonColumns(row, ['audio_links','guest_ids','navigator_ids','tag_ids','library_items']) as Article);
};
