/*
  # 初期データの投入

  1. 基本データ
    - ゲスト、ナビゲーター、タグの初期データ
    - サンプル記事の作成

  2. 注意事項
    - UUIDを使用するため、gen_random_uuid()で生成
    - 既存データとの重複を避けるためIF NOT EXISTSを使用
*/

-- Insert initial guests
INSERT INTO guests (id, name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', '佐藤 健一'),
  ('550e8400-e29b-41d4-a716-446655440002', '鈴木 杏奈'),
  ('550e8400-e29b-41d4-a716-446655440003', '高橋 大輔'),
  ('550e8400-e29b-41d4-a716-446655440004', '田中 真理子')
ON CONFLICT (id) DO NOTHING;

-- Insert initial navigators
INSERT INTO navigators (id, name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440101', '渡辺 健'),
  ('550e8400-e29b-41d4-a716-446655440102', '伊藤 静香')
ON CONFLICT (id) DO NOTHING;

-- Insert initial tags
INSERT INTO tags (id, name, slug) VALUES 
  ('550e8400-e29b-41d4-a716-446655440201', 'テクノロジー', 'technology'),
  ('550e8400-e29b-41d4-a716-446655440202', '深掘り', 'deep-dive'),
  ('550e8400-e29b-41d4-a716-446655440203', 'クリエイティブ', 'creative'),
  ('550e8400-e29b-41d4-a716-446655440204', '音楽', 'music'),
  ('550e8400-e29b-41d4-a716-446655440205', 'インタビュー', 'interview')
ON CONFLICT (id) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (
  id, title, slug, body_markdown, status, published_at, thumbnail_url,
  audio_links, guest_ids, navigator_ids, tag_ids, library_items
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440301',
  'モダンフロントエンド開発の深掘り',
  'modern-frontend-deep-dive',
  '# ようこそ、モダンフロントエンド開発の世界へ

初回へようこそ！このエピソードでは、ReactからVue、そしてSvelteに至るまで、モダンなフロントエンド開発のすべてについて語ります。ゲストには、大手テック企業で活躍する**佐藤健一さん**をお迎えしました。

## なぜフロントエンドは複雑化したのか？

かつてのWebサイトは、HTMLとCSS、そして少しのJavaScriptがあれば十分でした。しかし、Webアプリケーションがリッチになるにつれ、状態管理やコンポーネント設計、ビルドプロセスなど、考慮すべき点が爆発的に増えました。

> 「重要なのは、ツールの変遷を追うことではなく、その背景にある『何を解決しようとしているのか』を理解することです」と佐藤さんは語ります。

現代のフレームワークは、この複雑性を管理するための強力なツールを提供してくれます。',
  'published',
  '2023-10-26 09:00:00+00',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  '[{"platform": "spotify", "url": "#"}]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440001"]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440101"]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440201", "550e8400-e29b-41d4-a716-446655440202"]'::jsonb,
  '[{"type": "book", "title": "JavaScript本格入門", "creator": "山田 祥寛", "thumbnail_url": "https://picsum.photos/200/300?random=101", "links": [{"kind": "amazon", "url": "#"}]}]'::jsonb
),
(
  '550e8400-e29b-41d4-a716-446655440302',
  '心に響くストーリーテリングの技術',
  'art-of-storytelling',
  'このエピソードでは、人を惹きつける物語の条件を探求します。ゲストには著名な小説家をお迎えしました。

## ストーリーテリングの基本原則

良いストーリーには必ず以下の要素が含まれています：

1. **魅力的なキャラクター** - 読者が感情移入できる人物
2. **明確な目標** - 主人公が達成したいこと
3. **障害と葛藤** - 目標達成を阻む要因
4. **成長と変化** - キャラクターの内面的な変化

これらの要素を巧みに組み合わせることで、読者の心に残る物語を創造できます。',
  'published',
  '2023-10-20 09:00:00+00',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  '[{"platform": "listen", "url": "#"}]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440002"]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440102"]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440203"]'::jsonb,
  '[{"type": "book", "title": "理科系の作文技術", "creator": "木下 是雄", "thumbnail_url": "https://picsum.photos/200/300?random=102", "links": [{"kind": "amazon", "url": "#"}]}]'::jsonb
),
(
  '550e8400-e29b-41d4-a716-446655440303',
  '音楽制作マスタークラス',
  'music-production-masterclass',
  '著名なプロデューサーと共に音楽制作の世界を覗きます。業界のヒントやテクニックを学びましょう。

## 音楽制作の基礎

現代の音楽制作では、以下のツールが欠かせません：

- **DAW (Digital Audio Workstation)** - 音楽制作の中核となるソフトウェア
- **プラグイン** - エフェクトや音源を追加するツール
- **ハードウェア** - オーディオインターフェースやモニタースピーカー

技術の進歩により、自宅でもプロレベルの音楽制作が可能になりました。',
  'published',
  '2023-10-15 09:00:00+00',
  null,
  '[{"platform": "spotify", "url": "#"}, {"platform": "listen", "url": "#"}]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440003"]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440101"]'::jsonb,
  '["550e8400-e29b-41d4-a716-446655440204", "550e8400-e29b-41d4-a716-446655440202"]'::jsonb,
  '[{"type": "track", "title": "Bohemian Rhapsody", "creator": "Queen", "thumbnail_url": "https://picsum.photos/200/200?random=103", "links": [{"kind": "spotify", "url": "#"}]}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;