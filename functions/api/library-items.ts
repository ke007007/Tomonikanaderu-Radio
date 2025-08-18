import { json, run, parseJsonColumns } from './_utils';
import type { FlattenedLibraryItem } from '../../types';

export const onRequest: PagesFunction = async ({ env }) => {
  const res = await run<any>(env as any, `SELECT * FROM articles`);
  const rows = (res.results || []).map(r => parseJsonColumns(r, ['audio_links','guest_ids','navigator_ids','tag_ids','library_items']));
  const items: FlattenedLibraryItem[] = [];
  for (const a of rows) {
    if (Array.isArray(a.library_items)) {
      for (const item of a.library_items) {
        items.push({
          ...item,
          episodeId: a.id,
          episodeTitle: a.title,
          episodeSlug: a.slug,
          recommendingGuestIds: a.guest_ids || [],
        });
      }
    }
  }
  items.sort((x, y) => new Date(y.created_at.replace(/\./g, '-')).getTime() - new Date(x.created_at.replace(/\./g, '-')).getTime());
  return json(items);
};
