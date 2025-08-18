
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Person {
  id: number;
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
  id: number;
  type: 'book' | 'track';
  title: string;
  creator: string;
  thumbnail_url: string | null;
  links: LibraryLink[];
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  published_at: string | null;
  status: 'draft' | 'published';
  thumbnail_url: string | null;
  audio_links: AudioLink[];
  guestIds: number[];
  navigatorIds: number[];
  tagIds: number[];
  body_markdown: string;
  libraryItems: LibraryItem[]; // おすすめアイテムを記事に直接内包
  created_at: string;
  updated_at: string;
}

// ライブラリーページ表示用に、記事情報を付与したアイテムの型
export interface FlattenedLibraryItem extends LibraryItem {
  episodeId: number;
  episodeTitle: string;
  episodeSlug: string;
  recommendingGuestIds: number[];
}
