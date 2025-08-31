
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Person {
  id: string;
  name: string;
  role: 'guest' | 'navigator';
}

export interface AudioLink {
  platform: 'spotify' | 'listen' | 'other';
  url: string;
}

export interface LibraryLink {
  kind: 'amazon' | 'spotify' | 'youtube' | 'other';
  url: string;
}

export interface LibraryItem {
  id?: string;
  type: 'book' | 'track';
  title: string;
  creator: string;
  thumbnail_url: string | null;
  links: LibraryLink[];
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  published_at: string | null;
  status: 'draft' | 'published';
  thumbnail_url: string | null;
  audio_links: string[];
  guestIds: string[];
  navigatorIds: string[];
  tagIds: string[];
  body_markdown: string;
  libraryItems: LibraryItem[]; // おすすめアイテムを記事に直接内包
  library_items: LibraryItem[];
  created_at: string;
  updated_at: string;
}

// ライブラリーページ表示用に、記事情報を付与したアイテムの型
export interface FlattenedLibraryItem extends LibraryItem {
  episodeId: string;
  episodeTitle: string;
  episodeSlug: string;
  recommendingGuestIds: string[];
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  item_index: number;
}
