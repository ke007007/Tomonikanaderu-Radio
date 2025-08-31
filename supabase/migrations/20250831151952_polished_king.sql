/*
  # ラジオポータルサイトのデータベーススキーマ

  1. 新しいテーブル
    - `articles` - 記事の基本情報とメタデータ
      - `id` (uuid, 主キー)
      - `title` (text, 記事タイトル)
      - `slug` (text, URL用スラッグ、ユニーク)
      - `body_markdown` (text, マークダウン形式の本文)
      - `status` (text, 公開状態: draft/published)
      - `published_at` (timestamptz, 公開日時)
      - `thumbnail_url` (text, サムネイル画像URL)
      - `audio_links` (jsonb, 音声配信プラットフォームのリンク)
      - `guest_ids` (jsonb, ゲストIDの配列)
      - `navigator_ids` (jsonb, ナビゲーターIDの配列)
      - `tag_ids` (jsonb, タグIDの配列)
      - `library_items` (jsonb, おすすめアイテムの配列)
      - `created_at` (timestamptz, 作成日時)
      - `updated_at` (timestamptz, 更新日時)

    - `guests` - ゲスト情報
      - `id` (uuid, 主キー)
      - `name` (text, 名前)
      - `created_at` (timestamptz, 作成日時)

    - `navigators` - ナビゲーター情報
      - `id` (uuid, 主キー)
      - `name` (text, 名前)
      - `created_at` (timestamptz, 作成日時)

    - `tags` - タグ情報
      - `id` (uuid, 主キー)
      - `name` (text, タグ名)
      - `slug` (text, URL用スラッグ、ユニーク)
      - `created_at` (timestamptz, 作成日時)

    - `page_views` - ページビュー統計
      - `id` (uuid, 主キー)
      - `article_id` (uuid, 記事ID、外部キー)
      - `viewed_at` (timestamptz, 閲覧日時)
      - `date` (date, 集計用の日付)

  2. セキュリティ
    - 全テーブルでRLSを有効化
    - 認証済みユーザーのみが記事の作成・編集・削除が可能
    - 未認証ユーザーは公開記事の閲覧のみ可能
    - ページビューの記録は誰でも可能

  3. インデックス
    - 記事のスラッグ検索用
    - ページビューの日付・記事ID検索用
    - タグのスラッグ検索用
*/

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body_markdown text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  thumbnail_url text,
  audio_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  guest_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  navigator_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  tag_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  library_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Navigators table
CREATE TABLE IF NOT EXISTS navigators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Page views table for analytics
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  date date NOT NULL DEFAULT CURRENT_DATE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date);
CREATE INDEX IF NOT EXISTS idx_page_views_article_id ON page_views(article_id);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigators ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles
CREATE POLICY "Anyone can view published articles"
  ON articles
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can view all articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for guests
CREATE POLICY "Anyone can view guests"
  ON guests
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage guests"
  ON guests
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for navigators
CREATE POLICY "Anyone can view navigators"
  ON navigators
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage navigators"
  ON navigators
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for tags
CREATE POLICY "Anyone can view tags"
  ON tags
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON tags
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for page views
CREATE POLICY "Anyone can view page views"
  ON page_views
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert page views"
  ON page_views
  FOR INSERT
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for articles
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();