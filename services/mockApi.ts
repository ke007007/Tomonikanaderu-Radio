import type { Article, LibraryItem, Person, Tag, FlattenedLibraryItem } from '../types';

// --- 初期データ（日本語化＆データ構造変更） ---
let articles: Article[] = [
  { 
    id: 1, title: "モダンフロントエンド開発の深掘り", slug: "modern-frontend-deep-dive", published_at: "2023.10.26", status: 'published', thumbnail_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60", 
    audio_links: [{ platform: 'spotify', url: '#' }], guestIds: [1], navigatorIds: [101], tagIds: [1, 2], 
    body_markdown: `
# ようこそ、モダンフロントエンド開発の世界へ

初回へようこそ！このエピソードでは、ReactからVue、そしてSvelteに至るまで、モダンなフロントエンド開発のすべてについて語ります。ゲストには、大手テック企業で活躍する**佐藤健一さん**をお迎えしました。

## なぜフロントエンドは複雑化したのか？

かつてのWebサイトは、HTMLとCSS、そして少しのJavaScriptがあれば十分でした。しかし、Webアプリケーションがリッチになるにつれ、状態管理やコンポーネント設計、ビルドプロセスなど、考慮すべき点が爆発的に増えました。

> 「重要なのは、ツールの変遷を追うことではなく、その背景にある『何を解決しようとしているのか』を理解することです」と佐藤さんは語ります。

現代のフレームワークは、この複雑性を管理するための強力なツールを提供してくれます。

### 主要なフレームワークの特徴

それぞれのフレームワークには、独自の哲学と強みがあります。

- **React**: コンポーネントベース設計の先駆者。JSXによる宣言的なUI記述が特徴。エコシステムが非常に大きく、多くの企業で採用されています。
- **Vue.js**: プログレッシブフレームワークを標榜し、学習コストが低いのが魅力。小規模なプロジェクトから大規模なSPAまで柔軟に対応可能です。
- **Svelte**: *仮想DOMを使わない*というユニークなアプローチ。コンパイル時に最適化された素のJavaScriptを生成するため、バンドルサイズが小さく、パフォーマンスに優れています。

**コード例：Svelteのシンプルなカウンター**
\`\`\`javascript
<script>
  let count = 0;
  function handleClick() {
    count += 1;
  }
</script>

<button on:click={handleClick}>
  Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
\`\`\`

## 今後のトレンド予測

番組の後半では、今後のフロントエンド開発のトレンドについても議論しました。いくつか注目すべき点をリストアップします。

1.  **サーバーサイドレンダリング (SSR) の進化**: Next.jsやNuxt.jsに代表されるSSRフレームワークは、パフォーマンスとSEOの両面で引き続き重要性を増すでしょう。特に、React Server Componentsのような新しいパラダイムが登場しています。
2.  **WebAssembly (WASM) の活用**: C++やRustで書かれたコードをブラウザで実行する技術。計算量の多い処理（画像編集、ビデオエンコーディング、3D描画など）を高速化する切り札として期待されています。
3.  **AIの統合**: GitHub CopilotのようなAIコーディングアシスタントが、開発者の生産性をさらに向上させる可能性があります。コードの自動生成だけでなく、テストの作成やデバッグの補助まで、その応用範囲は広がりつつあります。
4.  **型の重要性**: TypeScriptの採用はもはや標準となり、より堅牢でメンテナンス性の高いアプリケーション開発が求められます。

このエピソードが、あなたのフロントエンド開発の旅の一助となれば幸いです。次回もどうぞお楽しみに！
`, 
    libraryItems: [
      { id: 1, type: 'book', title: "JavaScript本格入門", creator: "山田 祥寛", thumbnail_url: "https://picsum.photos/200/300?random=101", links: [{ kind: 'amazon', url: '#' }], created_at: "2023.10.26" },
      { id: 4, type: 'track', title: "Digital Love", creator: "Daft Punk", thumbnail_url: "https://picsum.photos/200/200?random=104", links: [{ kind: 'spotify', url: '#' }, {kind: 'youtube', url: '#'}], created_at: "2023.10.26" },
    ],
    created_at: "2023.10.25", updated_at: "2023.10.26" 
  },
  { 
    id: 2, title: "心に響くストーリーテリングの技術", slug: "art-of-storytelling", published_at: "2023.10.20", status: 'published', thumbnail_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60", 
    audio_links: [{ platform: 'listen', url: '#' }], guestIds: [2], navigatorIds: [102], tagIds: [3], 
    body_markdown: "このエピソードでは、人を惹きつける物語の条件を探求します。ゲストには著名な小説家をお迎えしました。", 
    libraryItems: [
      { id: 2, type: 'book', title: "理科系の作文技術", creator: "木下 是雄", thumbnail_url: "https://picsum.photos/200/300?random=102", links: [{ kind: 'amazon', url: '#' }], created_at: "2023.10.20" },
    ],
    created_at: "2023.10.19", updated_at: "2023.10.20" 
  },
  { 
    id: 3, title: "音楽制作マスタークラス", slug: "music-production-masterclass", published_at: "2023.10.15", status: 'published', thumbnail_url: null, 
    audio_links: [{ platform: 'spotify', url: '#' }, { platform: 'listen', url: '#' }], guestIds: [3], navigatorIds: [101], tagIds: [4, 2], 
    body_markdown: "著名なプロデューサーと共に音楽制作の世界を覗きます。業界のヒントやテクニックを学びましょう。", 
    libraryItems: [
      { id: 3, type: 'track', title: "Bohemian Rhapsody", creator: "Queen", thumbnail_url: "https://picsum.photos/200/200?random=103", links: [{ kind: 'spotify', url: '#' }], created_at: "2023.10.15" },
    ],
    created_at: "2023.10.14", updated_at: "2023.10.15" 
  },
   { 
    id: 50, title: "ジャムセッションズメンバー回", slug: "jam-sessions-member-talk", published_at: "2023.09.01", status: 'published', thumbnail_url: null, 
    audio_links: [{ platform: 'spotify', url: '#' }], guestIds: [], navigatorIds: [101, 102], tagIds: [2], 
    body_markdown: "今回はゲストなしで、ナビゲーターの二人だけで最近気になっていることについて話します。", 
    libraryItems: [],
    created_at: "2023.09.01", updated_at: "2023.09.01" 
  },
  { 
    id: 4, title: "下書き状態の記事", slug: "draft-article-example", published_at: null, status: 'draft', thumbnail_url: null, audio_links: [], guestIds: [], navigatorIds: [], tagIds: [], 
    body_markdown: "これは下書きとして保存されている記事です。まだ公開されていません。", 
    libraryItems: [], 
    created_at: "2023.11.01", updated_at: "2023.11.01" 
  },
];

for (let i = 5; i <= 45; i++) {
  const date = new Date(2023, 8, 30 - (i % 30));
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  articles.push({
    id: i,
    title: `エピソード${i}: トピック #${i % 5 + 1} を探る`,
    slug: `episode-${i}-exploring-topic-${i % 5 + 1}`,
    published_at: dateStr,
    status: 'published',
    thumbnail_url: `https://picsum.photos/400/300?random=${i}`,
    audio_links: [{ platform: 'spotify', url: '#' }],
    guestIds: [i % 4 + 1],
    navigatorIds: [101 + (i % 2)],
    tagIds: [i % 5 + 1],
    body_markdown: `エピソード${i}の本文です。ここではトピック #${i % 5 + 1}に関する様々な興味深い点を取り上げます。`,
    libraryItems: i % 3 === 0 ? [
        { id: 100 + i, type: i % 2 === 0 ? 'book' : 'track', title: `推薦アイテム ${i}`, creator: `クリエイター ${i}`, thumbnail_url: `https://picsum.photos/200/300?random=${100+i}`, links: [], created_at: dateStr }
    ] : [],
    created_at: dateStr,
    updated_at: dateStr,
  });
}

let guests: Person[] = [
  { id: 1, name: "佐藤 健一", role: 'guest' },
  { id: 2, name: "鈴木 杏奈", role: 'guest' },
  { id: 3, name: "高橋 大輔", role: 'guest' },
  { id: 4, name: "田中 真理子", role: 'guest' },
];

let navigators: Person[] = [
  { id: 101, name: "渡辺 健", role: 'navigator' },
  { id: 102, name: "伊藤 静香", role: 'navigator' },
];

let tags: Tag[] = [
  { id: 1, name: "テクノロジー", slug: 'technology' },
  { id: 2, name: "深掘り", slug: 'deep-dive' },
  { id: 3, name: "クリエイティブ", slug: 'creative' },
  { id: 4, name: "音楽", slug: 'music' },
  { id: 5, name: "インタビュー", slug: 'interview' },
];


// --- Analytics Data Generation ---
interface PageView {
  date: string; // YYYY-MM-DD
  articleId: number;
}
let pageViews: PageView[] = [];
if (typeof window !== 'undefined') { 
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);

    const publishedArticles = articles.filter(a => a.status === 'published' && a.published_at);
    if (publishedArticles.length > 0) {
        for (let d = new Date(ninetyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
            // 記事の公開日に基づいてビューを生成
            const articlesPublishedBeforeDate = publishedArticles.filter(a => new Date(a.published_at!.replace(/\./g, '-')) <= d);
            if (articlesPublishedBeforeDate.length === 0) continue;

            const dateStr = d.toISOString().slice(0, 10);
            const dailyViews = Math.floor(Math.random() * 200) + 50; 
            for (let i = 0; i < dailyViews; i++) {
                // 新しい記事ほど閲覧されやすいように重み付け
                const articleIndex = Math.floor(Math.pow(Math.random(), 2) * articlesPublishedBeforeDate.length);
                const article = articlesPublishedBeforeDate[articleIndex];
                if (article) {
                     pageViews.push({ date: dateStr, articleId: article.id });
                }
            }
        }
    }
}


// --- 共通ヘルパー ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const getCurrentTimestamp = () => new Date().toISOString().slice(0, 10).replace(/-/g, '.');

// --- API実装 ---
export const api = {
  // --- Read operations ---
  getArticles: async (): Promise<Article[]> => {
    await delay(200);
    return JSON.parse(JSON.stringify(articles)).sort((a: Article, b: Article) => {
        if (!a.published_at) return 1;
        if (!b.published_at) return -1;
        return new Date(b.published_at.replace(/\./g, '-')).getTime() - new Date(a.published_at.replace(/\./g, '-')).getTime()
    });
  },
  getArticleById: async (id: number): Promise<Article | null> => {
    await delay(100);
    const article = articles.find(a => a.id === id);
    return article ? JSON.parse(JSON.stringify(article)) : null;
  },
  getArticleBySlug: async (slug: string): Promise<Article | null> => {
    await delay(200);
    const article = articles.find(a => a.slug === slug);
    return article ? JSON.parse(JSON.stringify(article)) : null;
  },
  getFlattenedLibraryItems: async (): Promise<FlattenedLibraryItem[]> => {
    await delay(200);
    const flattened: FlattenedLibraryItem[] = [];
    articles.forEach(article => {
      if(article.libraryItems) {
        article.libraryItems.forEach(item => {
          flattened.push({
            ...item,
            episodeId: article.id,
            episodeTitle: article.title,
            episodeSlug: article.slug,
            recommendingGuestIds: article.guestIds,
          });
        });
      }
    });
    return flattened.sort((a, b) => new Date(b.created_at.replace(/\./g, '-')).getTime() - new Date(a.created_at.replace(/\./g, '-')).getTime());
  },
  getGuests: async () => { await delay(100); return [...guests].sort((a, b) => a.name.localeCompare(b.name)); },
  getNavigators: async () => { await delay(100); return [...navigators].sort((a, b) => a.name.localeCompare(b.name)); },
  getTags: async () => { await delay(100); return [...tags].sort((a, b) => a.name.localeCompare(b.name)); },
  
  // --- Article CUD (includes LibraryItems) ---
  createArticle: async (data: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> => {
    await delay(300);
    const newId = Date.now();
    const now = getCurrentTimestamp();
    const newArticle: Article = {
        ...data,
        id: newId,
        libraryItems: data.libraryItems.map(item => ({...item, id: Date.now() + Math.random()})),
        created_at: now,
        updated_at: now,
    };
    articles.push(newArticle);
    return newArticle;
  },
  updateArticle: async (id: number, data: Partial<Article>): Promise<Article | null> => {
    await delay(300);
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
        const existingArticle = articles[index];
        const updatedArticle = { 
          ...existingArticle, 
          ...data,
          libraryItems: (data.libraryItems || []).map(item => item.id ? item : {...item, id: Date.now() + Math.random()}),
          updated_at: getCurrentTimestamp() 
        };
        articles[index] = updatedArticle;
        return updatedArticle;
    }
    return null;
  },
  deleteArticle: async (id: number): Promise<{ success: true }> => {
      await delay(300);
      articles = articles.filter(a => a.id !== id);
      return { success: true };
  },

  // --- Taxonomy CUD ---
  getTaxonomy: async (type: 'guest' | 'navigator' | 'tag') => {
    await delay(100);
    if(type === 'guest') return [...guests].sort((a, b) => a.name.localeCompare(b.name));
    if(type === 'navigator') return [...navigators].sort((a, b) => a.name.localeCompare(b.name));
    if(type === 'tag') return [...tags].sort((a, b) => a.name.localeCompare(b.name));
    return [];
  },
  addTaxonomyItem: async (type: 'guest' | 'navigator' | 'tag', name: string) => {
    await delay(300);
    if (!name.trim()) return null;
    const newId = Date.now();
    if (type === 'guest') {
      const newItem: Person = { id: newId, name, role: 'guest' };
      guests.push(newItem);
      return newItem;
    }
    if (type === 'navigator') {
      const newItem: Person = { id: newId, name, role: 'navigator' };
      navigators.push(newItem);
      return newItem;
    }
    if (type === 'tag') {
      const newItem: Tag = { id: newId, name, slug: name.toLowerCase().replace(/\s+/g, '-') };
      tags.push(newItem);
      return newItem;
    }
    return null;
  },
  updateTaxonomyItem: async(type: 'guest' | 'navigator' | 'tag', id: number, name: string) => {
     await delay(300);
     if (!name.trim()) return false;
     let item: Person | Tag | undefined;
     if (type === 'guest') item = guests.find(i => i.id === id);
     if (type === 'navigator') item = navigators.find(i => i.id === id);
     if (type === 'tag') item = tags.find(i => i.id === id);

     if (item) {
        item.name = name;
        if ('slug' in item) {
           item.slug = name.toLowerCase().replace(/\s+/g, '-');
        }
        return true;
     }
     return false;
  },
  deleteTaxonomyItem: async(type: 'guest' | 'navigator' | 'tag', id: number) => {
     await delay(300);
     if (type === 'guest' && articles.some(a => a.guestIds?.includes?.(id))) return { success: false, message: 'この記事で使用されているため削除できません。' };
     if (type === 'navigator' && articles.some(a => a.navigatorIds.includes(id))) return { success: false, message: 'この記事で使用されているため削除できません。' };
     if (type === 'tag' && articles.some(a => a.tagIds.includes(id))) return { success: false, message: 'この記事で使用されているため削除できません。' };

     if (type === 'guest') guests = guests.filter(i => i.id !== id);
     if (type === 'navigator') navigators = navigators.filter(i => i.id !== id);
     if (type === 'tag') tags = tags.filter(i => i.id !== id);

     return { success: true };
  },

  // --- Analytics ---
  getAnalytics: async (startDate: string, endDate: string): Promise<{ totalViews: number; topArticles: { articleId: number; articleTitle: string; views: number }[] }> => {
    await delay(500);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredViews = pageViews.filter(view => {
        const viewDate = new Date(view.date);
        return viewDate >= start && viewDate <= end;
    });

    const totalViews = filteredViews.length;
    
    const articleViewCounts = filteredViews.reduce((acc, view) => {
        acc[view.articleId] = (acc[view.articleId] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const topArticles = Object.entries(articleViewCounts)
        .map(([articleId, views]) => {
            const article = articles.find(a => a.id === Number(articleId));
            return {
                articleId: Number(articleId),
                articleTitle: article ? article.title : '不明な記事',
                views,
            };
        })
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

    return { totalViews, topArticles };
  },
};