-- D1 / SQLite schema for persistence

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  published_at TEXT,
  status TEXT NOT NULL,
  thumbnail_url TEXT,
  audio_links TEXT NOT NULL DEFAULT '[]',
  guest_ids TEXT NOT NULL DEFAULT '[]',
  navigator_ids TEXT NOT NULL DEFAULT '[]',
  tag_ids TEXT NOT NULL DEFAULT '[]',
  body_markdown TEXT NOT NULL,
  library_items TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS guests (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS navigators (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS page_views (
  date TEXT NOT NULL,
  article_id INTEGER NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_views_date ON page_views(date);
CREATE INDEX IF NOT EXISTS idx_views_article ON page_views(article_id);
