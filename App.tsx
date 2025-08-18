
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { api } from './services/mockApi';
import type { Article, LibraryItem, Person, Tag, AudioLink, LibraryLink, FlattenedLibraryItem } from './types';
import { TOP_ARTICLE_COUNT, ARTICLES_PER_PAGE, LIBRARY_ITEMS_PER_PAGE } from './constants';
import RadioIcon from './components/icons/RadioIcon';
import ArticleCard from './components/ArticleCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- ICONS ---
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

// --- DATA PROVIDER ---
const useData = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [flattenedLibraryItems, setFlattenedLibraryItems] = useState<FlattenedLibraryItem[]>([]);
    const [guests, setGuests] = useState<Person[]>([]);
    const [navigators, setNavigators] = useState<Person[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const [articlesRes, libItemsRes, guestsRes, navigatorsRes, tagsRes] = await Promise.all([
            api.getArticles(),
            api.getFlattenedLibraryItems(),
            api.getGuests(),
            api.getNavigators(),
            api.getTags(),
        ]);
        setArticles(articlesRes);
        setFlattenedLibraryItems(libItemsRes);
        setGuests(guestsRes);
        setNavigators(navigatorsRes);
        setTags(tagsRes);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { articles, flattenedLibraryItems, guests, navigators, tags, loading, refreshData: fetchData };
};


// --- LAYOUTS ---
const PublicLayout: React.FC = () => (
    <div className="min-h-screen bg-gray-50 font-sans text-ink">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
);

// --- GLOBAL COMPONENTS ---
const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return(
      <header className="sticky top-0 z-20 bg-white/80 shadow-sm backdrop-blur-md">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="text-xl font-bold text-brand-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v6H7v-6Z"></path><path d="M9 12a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v5h-6v-5Z"></path><path d="M12 18v2"></path><path d="M10 20h4"></path></svg>
            ともに奏でるラジオ
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/articles" className={({ isActive }) => `transition-colors hover:text-brand-2 ${isActive ? 'text-brand-2 font-bold' : ''}`}>記事</NavLink>
            <NavLink to="/library" className={({ isActive }) => `transition-colors hover:text-brand-2 ${isActive ? 'text-brand-2 font-bold' : ''}`}>ライブラリー</NavLink>
            <Link to="/admin" className="rounded-full bg-brand-2 px-4 py-2 text-sm text-white shadow-soft transition-transform hover:scale-105">管理ログイン</Link>
          </div>
          <div className="md:hidden">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)}><MenuIcon /></button>
          </div>
        </nav>
        {isMenuOpen && (
            <div className="md:hidden bg-white p-4 space-y-2">
                 <NavLink to="/articles" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `block py-2 text-center rounded-lg ${isActive ? 'bg-tint-2 text-brand-2 font-bold' : 'hover:bg-gray-100'}`}>記事</NavLink>
                 <NavLink to="/library" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `block py-2 text-center rounded-lg ${isActive ? 'bg-tint-2 text-brand-2 font-bold' : 'hover:bg-gray-100'}`}>ライブラリー</NavLink>
                 <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-center rounded-lg bg-brand-2 text-white mt-2">管理ログイン</Link>
            </div>
        )}
      </header>
)};

const Footer: React.FC = () => (
  <footer className="bg-tint-1 mt-12 py-6 text-center text-gray-500">
    <p>&copy; {new Date().getFullYear()} JamSessionz. All rights reserved.</p>
  </footer>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-1"></div>
    </div>
);

const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <div className="mt-8 flex justify-center items-center space-x-2">
            {currentPage > 1 && <button onClick={() => onPageChange(currentPage - 1)} className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100">&laquo;</button>}
            {pages.map(page => (
                <button 
                    key={page} 
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg shadow-sm ${page === currentPage ? 'bg-brand-1 text-white' : 'bg-white hover:bg-gray-100'}`}
                >
                    {page}
                </button>
            ))}
             {currentPage < totalPages && <button onClick={() => onPageChange(currentPage + 1)} className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100">&raquo;</button>}
        </div>
    );
};


// --- PUBLIC PAGES ---
const HomePage: React.FC = () => {
  const { articles, guests, tags, loading } = useData();
  if (loading) return <div className="h-screen"><LoadingSpinner/></div>;
  
  const latestArticles = articles.filter(a => a.status === 'published').slice(0, TOP_ARTICLE_COUNT);

  return (
    <>
      <div className="relative h-96 bg-gray-300">
        <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
            alt="Radio headphones" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white p-4">
                <h1 className="text-4xl md:text-5xl font-bold">言葉と、音と、出会う場所。</h1>
                <p className="mt-4 text-lg md:text-xl">対談の中から生まれた、心に残る一冊と一曲。</p>
            </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">最新記事一覧</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {latestArticles.map(article => (
            <ArticleCard key={article.id} article={article} guests={guests} tags={tags} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/articles" className="inline-block rounded-full bg-brand-1 px-8 py-3 font-bold text-white shadow-soft transition-transform hover:scale-105">
            すべての記事を見る
          </Link>
        </div>
      </div>
    </>
  );
};

const ArticleListItem: React.FC<{ article: Article, guests: Person[], tags: Tag[] }> = ({ article, guests, tags }) => {
    const articleGuests = guests.filter(g => article.guestIds.includes(g.id));
    const articleTags = tags.filter(t => article.tagIds.includes(t.id));
    return (
        <Link to={`/articles/${article.slug}`} className="group block p-4 bg-white rounded-lg shadow-soft hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0 w-full sm:w-24 h-24 rounded-md overflow-hidden bg-tint-1 flex items-center justify-center">
                {article.thumbnail_url ? <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover"/> : <RadioIcon className="w-10 h-10 text-brand-1/50"/>}
            </div>
            <div className="flex-grow text-center sm:text-left">
                <p className="text-xs text-gray-400">{article.published_at}</p>
                <h3 className="font-bold text-lg text-ink group-hover:text-brand-2">{article.title}</h3>
                {articleGuests.length > 0 && <p className="text-sm text-gray-600 mt-1 truncate">ゲスト: {articleGuests.map(g => g.name).join(', ')}</p>}
                 <div className="mt-2 flex flex-wrap gap-1 justify-center sm:justify-start">
                    {articleTags.slice(0, 3).map(tag => (
                        <span key={tag.id} className="inline-block rounded-full bg-tint-2 px-2 py-0.5 text-xs font-medium text-brand-2">{tag.name}</span>
                    ))}
                </div>
            </div>
        </Link>
    );
};


const ArticlesPage: React.FC = () => {
    const { articles, guests, navigators, tags, loading } = useData();
    const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [selectedNavigator, setSelectedNavigator] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    const filteredArticles = useMemo(() => {
        let results = articles.filter(a => a.status === 'published');
        
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            results = results.filter(a => {
                const guestNames = a.guestIds.map(gid => guests.find(g => g.id === gid)?.name || '').join(' ').toLowerCase();
                return a.title.toLowerCase().includes(lowerCaseSearch) ||
                       a.body_markdown.toLowerCase().includes(lowerCaseSearch) ||
                       guestNames.includes(lowerCaseSearch);
            });
        }

        if (selectedNavigator) {
            results = results.filter(a => a.navigatorIds.includes(Number(selectedNavigator)));
        }
        if (selectedTag) {
            results = results.filter(a => a.tagIds.includes(Number(selectedTag)));
        }

        results.sort((a, b) => {
            const dateA = new Date(a.published_at!.replace(/\./g, '-')).getTime();
            const dateB = new Date(b.published_at!.replace(/\./g, '-')).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return results;
    }, [articles, searchTerm, sortOrder, selectedNavigator, selectedTag, guests]);
    
    const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
    const paginatedArticles = filteredArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, sortOrder, selectedNavigator, selectedTag]);

    if (loading) return <div className="container mx-auto px-4 py-8"><LoadingSpinner /></div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center md:text-left">記事一覧・検索</h1>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-soft mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2 lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">キーワード検索 (タイトル, 本文, ゲスト名)</label>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="キーワードを入力" className="w-full rounded-full border-gray-300 shadow-sm focus:border-brand-2 focus:ring-brand-2" />
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">ナビゲーター</label><select value={selectedNavigator} onChange={e => setSelectedNavigator(e.target.value)} className="w-full rounded-full border-gray-300 shadow-sm focus:border-brand-2 focus:ring-brand-2"><option value="">すべて</option>{navigators.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">タグ</label><select value={selectedTag} onChange={e => setSelectedTag(e.target.value)} className="w-full rounded-full border-gray-300 shadow-sm focus:border-brand-2 focus:ring-brand-2"><option value="">すべて</option>{tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                    <div className="col-span-2 lg:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">並び替え</label><select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')} className="w-full rounded-full border-gray-300 shadow-sm focus:border-brand-2 focus:ring-brand-2"><option value="newest">新着順</option><option value="oldest">古い順</option></select></div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">{filteredArticles.length}件の記事が見つかりました</p>
                <div className="flex items-center gap-2 rounded-full bg-gray-200 p-1">
                    <button onClick={() => setViewMode('grid')} className={`p-1 rounded-full ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}><GridIcon/></button>
                    <button onClick={() => setViewMode('list')} className={`p-1 rounded-full ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><ListIcon/></button>
                </div>
            </div>
            
            {paginatedArticles.length > 0 ? (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {paginatedArticles.map(article => <ArticleCard key={article.id} article={article} guests={guests} tags={tags} />)}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paginatedArticles.map(article => <ArticleListItem key={article.id} article={article} guests={guests} tags={tags} />)}
                        </div>
                    )}
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            ) : (
                <p className="text-center text-gray-500 py-12">該当する記事が見つかりませんでした。</p>
            )}
        </div>
    );
};

const ArticleDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { articles, guests, navigators, tags, loading } = useData();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const article = useMemo(() => articles.find(a => a.slug === slug), [slug, articles]);

    if (loading) return <div className="container mx-auto px-4 py-8"><LoadingSpinner /></div>;
    if (!article) return <div className="text-center py-20">記事が見つかりません。</div>;

    const articleGuests = guests.filter(g => article.guestIds.includes(g.id));
    const articleNavigators = navigators.filter(n => article.navigatorIds.includes(n.id));
    const articleTags = tags.filter(t => article.tagIds.includes(t.id));
    
    const relatedArticles = articles
        .filter(a => a.id !== article.id && a.status === 'published' && (a.guestIds.some(id => article.guestIds.includes(id)) || a.tagIds.some(id => article.tagIds.includes(id))) )
        .slice(0, 6);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl bg-white rounded-xl shadow-soft overflow-hidden my-8">
            <header className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-ink">{article.title}</h1>
                <div className="mt-4 text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span>{article.published_at}</span>
                    {articleGuests.length > 0 && <span><strong>ゲスト:</strong> {articleGuests.map(g => g.name).join(', ')}</span>}
                    {articleNavigators.length > 0 && <span><strong>ナビゲーター:</strong> {articleNavigators.map(n => n.name).join(', ')}</span>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {articleTags.map(tag => ( <span key={tag.id} className="inline-block rounded-full bg-tint-2 px-3 py-1 text-xs font-medium text-brand-2">{tag.name}</span> ))}
                </div>
            </header>
            
            <div className="relative aspect-video w-full">
                {article.thumbnail_url ? <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-tint-1"><RadioIcon className="h-24 w-24 text-brand-1/50" /></div>}
            </div>
            
            <div className="p-6 md:p-8">
                 {article.audio_links.length > 0 && <div className="mb-8 p-4 bg-tint-2 rounded-lg flex items-center gap-4">
                     <h3 className="font-bold">試聴:</h3>
                     {article.audio_links.map((link, index) => ( <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="capitalize font-semibold text-brand-1 hover:underline">{link.platform}</a> ))}
                 </div>}
                <article className="prose max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body_markdown}</ReactMarkdown></article>
            </div>
            
            {article.libraryItems.length > 0 && (
                <div className="bg-tint-2 p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">このエピソードのおすすめ</h2>
                    
                    {/* Layout for a single recommended item */}
                    {article.libraryItems.length === 1 && (() => {
                        const item = article.libraryItems[0];
                        const recommendingGuests = guests.filter(g => article.guestIds.includes(g.id));

                        return (
                            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-soft overflow-hidden md:flex group">
                                <div className="md:flex-shrink-0 md:w-1/2 lg:w-5/12">
                                    <div className="relative h-full aspect-[4/5] md:aspect-auto">
                                       {item.thumbnail_url ? 
                                            <img src={item.thumbnail_url} alt={item.title} className="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> 
                                            : 
                                            <div className="absolute h-full w-full bg-tint-1 flex items-center justify-center p-2 text-center">
                                                <span className="text-brand-1 text-6xl">{item.type === 'book' ? '📖' : '🎵'}</span>
                                            </div> 
                                        }
                                    </div>
                                </div>
                                <div className="p-6 lg:p-8 flex flex-col">
                                    <span className="text-sm font-bold uppercase tracking-wider" style={{color: item.type === 'book' ? '#8B9BCB' : '#84CCC9'}}>{item.type}</span>
                                    <h3 className="font-bold text-2xl mt-1 leading-tight text-ink">{item.title}</h3>
                                    <p className="text-lg text-gray-600 mt-2">{item.creator}</p>
                                    <div className="mt-auto pt-4 text-sm">
                                        {recommendingGuests.length > 0 && <p className="text-gray-500 mb-4">推薦者: {recommendingGuests.map(g=>g.name).join(', ')}</p>}
                                        <div className="flex flex-wrap gap-2">
                                            {item.links.map((link, i) => <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-gray-200 px-3 py-1 rounded-full capitalize hover:bg-brand-2 hover:text-white transition-colors text-xs font-semibold">{link.kind}</a>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Layout for multiple recommended items */}
                    {article.libraryItems.length > 1 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {article.libraryItems.map(item => (
                                 <LibraryCard 
                                    key={item.id} 
                                    item={{
                                        ...item,
                                        episodeId: article.id,
                                        episodeTitle: article.title,
                                        episodeSlug: article.slug,
                                        recommendingGuestIds: article.guestIds
                                    }} 
                                    recommendingGuests={articleGuests} 
                                    simplified 
                                 />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {relatedArticles.length > 0 && (
                <div className="bg-tint-1 p-6 md:p-8 mt-8">
                    <h2 className="text-2xl font-bold mb-4">関連記事</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {relatedArticles.map(rel => (
                            <Link to={`/articles/${rel.slug}`} key={rel.id} className="group block text-sm bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold truncate group-hover:text-brand-2">{rel.title}</h4>
                                <p className="text-xs text-gray-500">{rel.published_at}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const LibraryCard: React.FC<{ item: FlattenedLibraryItem, recommendingGuests: Person[], simplified?: boolean }> = ({ item, recommendingGuests, simplified }) => (
    <div className="group bg-white rounded-lg shadow-soft overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
        <div className="aspect-[2/3] bg-tint-1 flex items-center justify-center overflow-hidden">
             {item.thumbnail_url ? <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" /> : <div className="p-2 text-center"><span className="text-brand-1 text-2xl">{item.type === 'book' ? '📖' : '🎵'}</span></div> }
        </div>
        <div className="p-4 flex-grow flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider" style={{color: item.type === 'book' ? '#8B9BCB' : '#84CCC9'}}>{item.type}</span>
            <h3 className="font-bold mt-1 leading-tight">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.creator}</p>
            <div className="mt-auto pt-4 text-xs">
                {recommendingGuests.length > 0 && <p className="text-gray-500 truncate" title={recommendingGuests.map(g=>g.name).join(', ')}>推薦者: {recommendingGuests.map(g=>g.name).join(', ')}</p>}
                {!simplified && item.episodeTitle && <p className="text-gray-500 mt-1">記事: <Link to={`/articles/${item.episodeSlug}`} className="hover:underline text-brand-2">{item.episodeTitle}</Link></p>}
                <div className="flex flex-wrap gap-2 mt-2">
                    {item.links.map((link, i) => <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-gray-200 px-2 py-1 rounded capitalize hover:bg-brand-2 hover:text-white">{link.kind}</a>)}
                </div>
            </div>
        </div>
    </div>
);

const LibraryListItem: React.FC<{ item: FlattenedLibraryItem, recommendingGuests: Person[] }> = ({ item, recommendingGuests }) => (
    <div className="group bg-white rounded-lg shadow-soft hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-center gap-4 p-4">
        <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-tint-1 flex items-center justify-center">
            {item.thumbnail_url ? <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover"/> : <span className="text-brand-1 text-2xl">{item.type === 'book' ? '📖' : '🎵'}</span>}
        </div>
        <div className="flex-grow text-center sm:text-left">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.creator}</p>
            {recommendingGuests.length > 0 && <p className="text-xs mt-1 text-gray-500 truncate" title={recommendingGuests.map(g => g.name).join(', ')}>推薦者: {recommendingGuests.map(g => g.name).join(', ')}</p>}
        </div>
        <div className="text-center sm:text-right flex-shrink-0 mt-4 sm:mt-0">
             <span className="text-xs font-bold uppercase tracking-wider" style={{color: item.type === 'book' ? '#8B9BCB' : '#84CCC9'}}>{item.type}</span>
             <p className="text-xs text-gray-500 mt-1">記事: <Link to={`/articles/${item.episodeSlug}`} className="hover:underline text-brand-2">{item.episodeTitle}</Link></p>
             <div className="flex gap-2 mt-2 justify-center sm:justify-end">
                {item.links.map((link, i) => <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 px-2 py-1 rounded capitalize hover:bg-brand-2 hover:text-white">{link.kind}</a>)}
            </div>
        </div>
    </div>
);


const LibraryPage: React.FC = () => {
    const { flattenedLibraryItems, guests, loading } = useData();
    const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all'|'book'|'track'>('all');
    const [sortOrder, setSortOrder] = useState<'newest'|'title'>('newest');
    
    const filteredItems = useMemo(() => {
        let results = [...flattenedLibraryItems];
        if (typeFilter !== 'all') {
            results = results.filter(item => item.type === typeFilter);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            results = results.filter(item => item.title.toLowerCase().includes(lower) || item.creator.toLowerCase().includes(lower));
        }
        results.sort((a,b) => {
            if (sortOrder === 'newest') return new Date(b.created_at.replace(/\./g, '-')).getTime() - new Date(a.created_at.replace(/\./g, '-')).getTime();
            if (sortOrder === 'title') return a.title.localeCompare(b.title);
            return 0;
        });
        return results;
    }, [flattenedLibraryItems, searchTerm, typeFilter, sortOrder]);

    const totalPages = Math.ceil(filteredItems.length / LIBRARY_ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice((currentPage - 1) * LIBRARY_ITEMS_PER_PAGE, currentPage * LIBRARY_ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, typeFilter, sortOrder]);

    if (loading) return <div className="container mx-auto px-4 py-8"><LoadingSpinner /></div>;
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">ライブラリー</h1>
                <p className="text-gray-600 mt-2">エピソードで紹介された本や音楽</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-soft mb-8 flex flex-col md:flex-row gap-4">
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="作品名, 作者/アーティストで検索" className="w-full md:w-1/2 rounded-full border-gray-300 shadow-sm focus:border-brand-2 focus:ring-brand-2" />
                <div className="flex-grow grid grid-cols-2 gap-4">
                    <select onChange={e => setTypeFilter(e.target.value as any)} value={typeFilter} className="w-full rounded-full border-gray-300 shadow-sm focus:border-brand-2 focus:ring-brand-2"><option value="all">すべて</option><option value="book">本</option><option value="track">曲</option></select>
                    <select onChange={e => setSortOrder(e.target.value as any)} value={sortOrder} className="w-full rounded-full border-gray-300 shadow-sm focus:border-brand-2 focus:ring-brand-2"><option value="newest">新着順</option><option value="title">タイトル順</option></select>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">{filteredItems.length}件のアイテムが見つかりました</p>
                <div className="flex items-center gap-2 rounded-full bg-gray-200 p-1">
                    <button onClick={() => setViewMode('grid')} className={`p-1 rounded-full ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}><GridIcon/></button>
                    <button onClick={() => setViewMode('list')} className={`p-1 rounded-full ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><ListIcon/></button>
                </div>
            </div>
            
             {paginatedItems.length > 0 ? (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                            {paginatedItems.map(item => <LibraryCard key={item.id} item={item} recommendingGuests={guests.filter(g => item.recommendingGuestIds.includes(g.id))} />)}
                        </div>
                    ) : (
                         <div className="space-y-4">
                            {paginatedItems.map(item => <LibraryListItem key={item.id} item={item} recommendingGuests={guests.filter(g => item.recommendingGuestIds.includes(g.id))} />)}
                        </div>
                    )}
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            ) : (
                <p className="text-center text-gray-500 py-12">該当するアイテムが見つかりませんでした。</p>
            )}
        </div>
    );
};

const NotFoundPage: React.FC = () => (
    <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-brand-1">404</h1>
        <p className="text-xl mt-4">ページが見つかりません</p>
        <Link to="/" className="mt-8 inline-block rounded-full bg-brand-2 px-6 py-3 text-white">ホームに戻る</Link>
    </div>
);

// --- ADMIN PAGES ---
const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === 'admin' && password === 'password') {
            localStorage.setItem('is_admin_logged_in', 'true');
            navigate('/admin');
        } else {
            setError('IDまたはパスワードが正しくありません。');
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-tint-1">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-soft">
                <h1 className="text-2xl font-bold text-center mb-6">管理画面ログイン</h1>
                 {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium" htmlFor="id">ログインID</label>
                        <input type="text" id="id" value={id} onChange={e => setId(e.target.value)} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-2" />
                    </div>
                    <div className="mb-6">
                         <label className="block mb-1 font-medium" htmlFor="password">パスワード</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-2" />
                    </div>
                    <button type="submit" className="w-full bg-brand-1 text-white py-2 rounded-full font-bold hover:bg-opacity-90 transition">ログイン</button>
                </form>
            </div>
        </div>
    );
}

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        if (localStorage.getItem('is_admin_logged_in') !== 'true') navigate('/login');
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('is_admin_logged_in');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 text-xl font-bold">
                    <span>管理パネル</span>
                    <button className="md:hidden text-2xl" onClick={() => setIsSidebarOpen(false)}>&times;</button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <NavLink to="/" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2 rounded hover:bg-gray-700">トップページへ</NavLink>
                    <hr className="border-gray-600 my-2"/>
                    <NavLink to="/admin" end onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-brand-2' : 'hover:bg-gray-700'}`}>ダッシュボード</NavLink>
                    <NavLink to="/admin/articles" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-brand-2' : 'hover:bg-gray-700'}`}>記事管理</NavLink>
                    <NavLink to="/admin/taxonomies" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-brand-2' : 'hover:bg-gray-700'}`}>タクソノミー管理</NavLink>
                </nav>
                <div className="p-4"><button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">ログアウト</button></div>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="md:hidden bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
                     <Link to="/" className="text-gray-600 hover:text-brand-1">サイトを表示</Link>
                    <button onClick={() => setIsSidebarOpen(true)}><MenuIcon/></button>
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-y-auto"><Outlet /></main>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const { articles } = useData();
    const getISODateString = (date: Date) => date.toISOString().slice(0, 10);
    const today = new Date();

    const [filterMode, setFilterMode] = useState<'all' | 'year' | 'custom'>('all');
    const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));
    const [customStartDate, setCustomStartDate] = useState(getISODateString(new Date(new Date().setDate(today.getDate() - 30))));
    const [customEndDate, setCustomEndDate] = useState(getISODateString(today));
    
    const [analyticsData, setAnalyticsData] = useState<{ totalViews: number; topArticles: any[] } | null>(null);
    const [loading, setLoading] = useState(false);

    const availableYears = useMemo(() => {
        const years = new Set(articles.filter(a => a.published_at).map(a => a.published_at!.substring(0, 4)));
        return Array.from(years).sort((a,b) => b.localeCompare(a));
    }, [articles]);

    const fetchAnalytics = async () => {
        setLoading(true);
        let startDate, endDate;
        switch (filterMode) {
            case 'all':
                startDate = '1970-01-01';
                endDate = getISODateString(today);
                break;
            case 'year':
                startDate = `${selectedYear}-01-01`;
                endDate = `${selectedYear}-12-31`;
                break;
            case 'custom':
                startDate = customStartDate;
                endDate = customEndDate;
                break;
        }
        const data = await api.getAnalytics(startDate, endDate);
        setAnalyticsData(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAnalytics();
    }, [filterMode, selectedYear, customStartDate, customEndDate]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">ダッシュボード</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm bg-white p-2 rounded-lg shadow-sm">
                    <select value={filterMode} onChange={e => setFilterMode(e.target.value as any)} className="p-2 border rounded-lg">
                        <option value="all">すべて</option>
                        <option value="year">年ごと</option>
                        <option value="custom">期間指定</option>
                    </select>
                    {filterMode === 'year' && (
                        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="p-2 border rounded-lg">
                            {availableYears.map(year => <option key={year} value={year}>{year}年</option>)}
                        </select>
                    )}
                    {filterMode === 'custom' && (
                        <>
                           <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="p-2 border rounded-lg" />
                           <span>~</span>
                           <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="p-2 border rounded-lg" />
                        </>
                    )}
                </div>
            </div>

            {loading ? <LoadingSpinner /> : !analyticsData ? <p>データを取得できませんでした。</p> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3 bg-white p-6 rounded-lg shadow">
                         <h2 className="font-bold text-lg text-gray-600">合計ページビュー</h2>
                         <p className="text-5xl font-bold mt-2 text-brand-1">{analyticsData.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="md:col-span-3 bg-white p-6 rounded-lg shadow">
                         <h2 className="font-bold text-lg text-gray-600">記事別ページビューランキング</h2>
                         <ul className="mt-4 space-y-3">
                            {analyticsData.topArticles.map((article, index) => (
                                <li key={article.articleId} className="flex items-center justify-between text-sm border-b pb-2">
                                    <div className="flex items-center">
                                        <span className="font-bold w-6">{index + 1}.</span>
                                        <Link to={`/admin/articles/edit/${article.articleId}`} className="hover:underline">{article.articleTitle}</Link>
                                    </div>
                                    <span className="font-bold">{article.views.toLocaleString()} PV</span>
                                </li>
                            ))}
                         </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminArticlesPage: React.FC = () => {
    const { articles, guests, loading, refreshData } = useData();
    const navigate = useNavigate();

    const handleDelete = async (id: number) => {
        if (window.confirm("この記事を削除しますか？関連するおすすめアイテムもすべて削除されます。")) {
            await api.deleteArticle(id);
            refreshData();
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">記事管理</h1>
                <Link to="/admin/articles/new" className="bg-brand-1 text-white px-4 py-2 rounded-full font-bold">新規作成</Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                {loading ? <p className="p-4">読み込み中...</p> : (
                    <table className="w-full text-left">
                        <thead><tr className="border-b bg-gray-50"><th className="p-3">タイトル</th><th className="p-3">ステータス</th><th className="p-3">公開日</th><th className="p-3">ゲスト</th><th className="p-3">操作</th></tr></thead>
                        <tbody>
                            {articles.map(article => {
                                const articleGuests = guests.filter(g => article.guestIds.includes(g.id)).map(g => g.name).join(', ');
                                return (
                                    <tr key={article.id} className="border-b hover:bg-gray-50 text-sm">
                                        <td className="p-3 font-semibold">{article.title}</td>
                                        <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{article.status}</span></td>
                                        <td className="p-3">{article.published_at || '---'}</td>
                                        <td className="p-3 max-w-xs truncate" title={articleGuests}>{articleGuests || '---'}</td>
                                        <td className="p-3 space-x-2 whitespace-nowrap">
                                            <button onClick={() => navigate(`/admin/articles/edit/${article.id}`)} className="text-blue-500 hover:underline">編集</button>
                                            <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:underline">削除</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// --- Library Item Sub-form for Admin ---
const LibraryItemAdminForm: React.FC<{ item: LibraryItem; onUpdate: (item: LibraryItem) => void; onRemove: () => void; }> = ({ item, onUpdate, onRemove }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onUpdate({ ...item, [e.target.name]: e.target.value });
    };

    const handleLinkChange = (index: number, field: 'kind'|'url', value: string) => {
        const newLinks = [...item.links];
        newLinks[index] = {...newLinks[index], [field]: value };
        onUpdate({ ...item, links: newLinks });
    };

    const addLink = () => {
        const newLinks: LibraryLink[] = [...item.links, { kind: 'amazon', url: '' }];
        onUpdate({ ...item, links: newLinks });
    };
    
    const removeLink = (index: number) => {
        const newLinks = item.links.filter((_, i) => i !== index);
        onUpdate({ ...item, links: newLinks });
    };

    return (
        <div className="bg-tint-2 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold">{item.title || '新規アイテム'}</h4>
                <button type="button" onClick={onRemove} className="text-red-500 font-bold text-xl">&times;</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select name="type" value={item.type} onChange={handleChange} className="w-full p-2 border rounded"><option value="book">本</option><option value="track">曲</option></select>
                <input type="text" name="title" value={item.title} onChange={handleChange} placeholder="作品名" className="w-full p-2 border rounded" />
                <input type="text" name="creator" value={item.creator} onChange={handleChange} placeholder="作者 / アーティスト" className="w-full p-2 border rounded" />
                <input type="text" name="thumbnail_url" value={item.thumbnail_url || ''} onChange={handleChange} placeholder="サムネイルURL" className="w-full p-2 border rounded" />
            </div>
            <div className="space-y-2">
                <h5 className="text-sm font-semibold">外部リンク</h5>
                {item.links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <select value={link.kind} onChange={e => handleLinkChange(index, 'kind', e.target.value)} className="p-2 border rounded text-sm"><option value="amazon">Amazon</option><option value="spotify">Spotify</option><option value="youtube">YouTube</option><option value="other">Other</option></select>
                        <input type="url" value={link.url} onChange={e => handleLinkChange(index, 'url', e.target.value)} className="flex-grow p-2 border rounded text-sm" placeholder="URL" />
                        <button type="button" onClick={() => removeLink(index)} className="text-red-500 font-bold">X</button>
                    </div>
                ))}
                <button type="button" onClick={addLink} className="text-sm text-blue-500 hover:underline">+ リンクを追加</button>
            </div>
        </div>
    );
};

// --- Article Preview Components ---
const PreviewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start p-4 overflow-y-auto"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-50 rounded-xl shadow-xl w-full max-w-4xl my-8 transform transition-transform duration-300"
                onClick={e => e.stopPropagation()}
            >
                 <div className="sticky top-0 bg-gray-100 p-2 text-right rounded-t-xl z-10">
                    <button 
                        onClick={onClose} 
                        className="text-gray-600 hover:text-gray-900 font-bold text-2xl px-3 py-1"
                        aria-label="Close preview"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-2 sm:p-4 md:p-6">
                   {children}
                </div>
            </div>
        </div>
    );
};

const ArticlePreview: React.FC<{
    article: Partial<Article>;
    guests: Person[];
    navigators: Person[];
    tags: Tag[];
}> = ({ article, guests, navigators, tags }) => {
    const articleGuests = guests.filter(g => article.guestIds?.includes(g.id));
    const articleNavigators = navigators.filter(n => article.navigatorIds?.includes(n.id));
    const articleTags = tags.filter(t => article.tagIds?.includes(t.id));
    const title = article.title || '（タイトル未入力）';
    
    return (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <header className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-ink">{title}</h1>
                <div className="mt-4 text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span>{article.published_at || '（下書きプレビュー）'}</span>
                    {articleGuests.length > 0 && <span><strong>ゲスト:</strong> {articleGuests.map(g => g.name).join(', ')}</span>}
                    {articleNavigators.length > 0 && <span><strong>ナビゲーター:</strong> {articleNavigators.map(n => n.name).join(', ')}</span>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {articleTags.map(tag => ( <span key={tag.id} className="inline-block rounded-full bg-tint-2 px-3 py-1 text-xs font-medium text-brand-2">{tag.name}</span> ))}
                </div>
            </header>
            
            <div className="relative aspect-video w-full">
                {article.thumbnail_url ? <img src={article.thumbnail_url} alt={title} className="w-full h-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-tint-1"><RadioIcon className="h-24 w-24 text-brand-1/50" /></div>}
            </div>
            
            <div className="p-6 md:p-8">
                 {article.audio_links && article.audio_links.length > 0 && <div className="mb-8 p-4 bg-tint-2 rounded-lg flex items-center gap-4">
                     <h3 className="font-bold">試聴:</h3>
                     {article.audio_links.map((link, index) => ( <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="capitalize font-semibold text-brand-1 hover:underline">{link.platform}</a> ))}
                 </div>}
                <article className="prose max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body_markdown || '（本文未入力）'}</ReactMarkdown></article>
            </div>
            
            {article.libraryItems && article.libraryItems.length > 0 && (
                 <div className="bg-tint-2 p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">このエピソードのおすすめ</h2>
                    {article.libraryItems.length === 1 && (() => {
                        const item = article.libraryItems![0];
                        const recommendingGuests = guests.filter(g => article.guestIds?.includes(g.id));

                        return (
                            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-soft overflow-hidden md:flex group">
                                <div className="md:flex-shrink-0 md:w-1/2 lg:w-5/12">
                                    <div className="relative h-full aspect-[4/5] md:aspect-auto">
                                       {item.thumbnail_url ? 
                                            <img src={item.thumbnail_url} alt={item.title} className="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> 
                                            : 
                                            <div className="absolute h-full w-full bg-tint-1 flex items-center justify-center p-2 text-center">
                                                <span className="text-brand-1 text-6xl">{item.type === 'book' ? '📖' : '🎵'}</span>
                                            </div> 
                                        }
                                    </div>
                                </div>
                                <div className="p-6 lg:p-8 flex flex-col">
                                    <span className="text-sm font-bold uppercase tracking-wider" style={{color: item.type === 'book' ? '#8B9BCB' : '#84CCC9'}}>{item.type}</span>
                                    <h3 className="font-bold text-2xl mt-1 leading-tight text-ink">{item.title}</h3>
                                    <p className="text-lg text-gray-600 mt-2">{item.creator}</p>
                                    <div className="mt-auto pt-4 text-sm">
                                        {recommendingGuests.length > 0 && <p className="text-gray-500 mb-4">推薦者: {recommendingGuests.map(g=>g.name).join(', ')}</p>}
                                        <div className="flex flex-wrap gap-2">
                                            {item.links.map((link, i) => <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-gray-200 px-3 py-1 rounded-full capitalize hover:bg-brand-2 hover:text-white transition-colors text-xs font-semibold">{link.kind}</a>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {article.libraryItems.length > 1 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {article.libraryItems.map((item, index) => (
                                 <LibraryCard 
                                    key={item.id || index} 
                                    item={{
                                        ...item,
                                        episodeId: article.id || 0,
                                        episodeTitle: article.title || '',
                                        episodeSlug: article.slug || '',
                                        recommendingGuestIds: article.guestIds || []
                                    }} 
                                    recommendingGuests={articleGuests} 
                                    simplified 
                                 />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const AdminArticleForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { guests, navigators, tags, refreshData } = useData();
    const [article, setArticle] = useState<Partial<Article>>({ title: '', slug: '', status: 'draft', body_markdown: '', guestIds: [], navigatorIds: [], tagIds: [], audio_links: [], libraryItems: [] });
    const [loading, setLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            api.getArticleById(Number(id)).then(data => {
                if (data) setArticle(data);
                setLoading(false);
            });
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setArticle(prev => ({ ...prev, [name]: value }));
        if (name === 'title' && !id) {
             setArticle(prev => ({...prev, slug: value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}));
        }
    };
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const value = Array.from(options).filter(o => o.selected).map(o => Number(o.value));
        setArticle(prev => ({ ...prev, [name]: value }));
    };

    const handleAudioLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
        const newLinks = [...(article.audio_links || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setArticle(prev => ({ ...prev, audio_links: newLinks }));
    };
    const addAudioLink = () => setArticle(prev => ({ ...prev, audio_links: [...(prev.audio_links || []), { platform: 'spotify', url: '' }] }));
    const removeAudioLink = (index: number) => setArticle(prev => ({ ...prev, audio_links: (prev.audio_links || []).filter((_, i) => i !== index) }));

    const handleLibraryItemUpdate = (index: number, updatedItem: LibraryItem) => {
        const newItems = [...(article.libraryItems || [])];
        newItems[index] = updatedItem;
        setArticle(prev => ({...prev, libraryItems: newItems}));
    };
    const addLibraryItem = () => {
        const newItem: LibraryItem = { id: Date.now(), type: 'book', title: '', creator: '', thumbnail_url: '', links: [], created_at: new Date().toISOString().slice(0,10) };
        setArticle(prev => ({ ...prev, libraryItems: [...(prev.libraryItems || []), newItem] }));
    };
    const removeLibraryItem = (index: number) => {
         setArticle(prev => ({ ...prev, libraryItems: (prev.libraryItems || []).filter((_, i) => i !== index) }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setArticle(prev => ({...prev, thumbnail_url: event.target?.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!article.title || !article.slug || !article.body_markdown) {
            alert("タイトル、スラッグ、本文は必須です。"); return;
        }
        if (article.status === 'published' && !article.published_at) {
            if (window.confirm("公開日を設定せずに公開しますか？本日の日付が自動設定されます。")) {
                article.published_at = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
            } else { return; }
        }
        setLoading(true);
        if (id) {
            await api.updateArticle(Number(id), article);
        } else {
            await api.createArticle(article as any);
        }
        await refreshData();
        setLoading(false);
        navigate('/admin/articles');
    };
    
    if (loading && id) return <LoadingSpinner />;

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/articles" className="text-gray-500 hover:text-brand-2 p-2 rounded-full hover:bg-gray-100" title="記事一覧に戻る">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
                    </Link>
                    <h1 className="text-3xl font-bold">{id ? '記事編集' : '記事作成'}</h1>
                </div>
                <div className="flex items-center gap-4">
                     <button type="button" onClick={() => setIsPreviewOpen(true)} className="bg-white text-brand-2 border border-brand-2 px-6 py-2 rounded-full font-bold hover:bg-tint-2 transition-colors">プレビュー</button>
                    <button type="submit" disabled={loading} className="bg-brand-1 text-white px-6 py-2 rounded-full font-bold disabled:bg-gray-400">{loading ? '保存中...' : '保存'}</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow"><label className="font-bold">タイトル</label><input type="text" name="title" value={article.title} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required /></div>
                    <div className="bg-white p-6 rounded-lg shadow">
                         <label className="font-bold">本文 (Markdown)</label>
                         <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] border rounded p-2">
                            <textarea name="body_markdown" value={article.body_markdown} onChange={handleChange} className="w-full h-full p-2 border rounded resize-none" required />
                            <div className="prose max-w-none h-full overflow-y-auto p-2 border rounded bg-gray-50"><ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body_markdown}</ReactMarkdown></div>
                         </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold">おすすめライブラリー</h3><button type="button" onClick={addLibraryItem} className="bg-brand-2 text-white px-3 py-1 rounded-full text-sm">+ アイテムを追加</button></div>
                        <div className="space-y-4">
                            {(article.libraryItems || []).map((item, index) => (
                                <LibraryItemAdminForm key={item.id || index} item={item} onUpdate={(updated) => handleLibraryItemUpdate(index, updated)} onRemove={() => removeLibraryItem(index)} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-start-3 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-bold border-b pb-2 mb-4">設定</h3>
                        <div className="space-y-4">
                            <div><label className="text-sm font-medium">スラッグ</label><input type="text" name="slug" value={article.slug} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required /></div>
                            <div><label className="text-sm font-medium">ステータス</label><select name="status" value={article.status} onChange={handleChange} className="w-full mt-1 p-2 border rounded"><option value="draft">下書き</option><option value="published">公開</option></select></div>
                            <div><label className="text-sm font-medium">公開日 (YYYY.MM.DD)</label><input type="text" name="published_at" value={article.published_at || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded" /></div>
                            <div>
                                <label className="text-sm font-medium">サムネイル</label>
                                {article.thumbnail_url && <img src={article.thumbnail_url} alt="preview" className="mt-2 rounded-lg max-h-40 w-auto"/>}
                                <input type="text" name="thumbnail_url" value={article.thumbnail_url || ''} onChange={handleChange} placeholder="URLを入力" className="w-full mt-2 p-2 border rounded" />
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full mt-2 text-sm"/>
                                <p className="text-xs text-gray-500 mt-1">推奨サイズ: 1200x630px (16:9比率)。未入力の場合はラジオアイコンが表示されます。</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-bold border-b pb-2 mb-4">関連情報</h3>
                         <div className="space-y-4">
                             <div><label className="text-sm font-medium">ゲスト</label><select name="guestIds" multiple value={article.guestIds?.map(String)} onChange={handleMultiSelectChange} className="w-full mt-1 p-2 border rounded h-24">{guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
                             <div><label className="text-sm font-medium">ナビゲーター</label><select name="navigatorIds" multiple value={article.navigatorIds?.map(String)} onChange={handleMultiSelectChange} className="w-full mt-1 p-2 border rounded h-24">{navigators.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}</select></div>
                             <div><label className="text-sm font-medium">タグ</label><select name="tagIds" multiple value={article.tagIds?.map(String)} onChange={handleMultiSelectChange} className="w-full mt-1 p-2 border rounded h-24">{tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-bold border-b pb-2 mb-4">音声リンク</h3>
                        <div className="space-y-2">
                        {(article.audio_links || []).map((link, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <select value={link.platform} onChange={e => handleAudioLinkChange(index, 'platform', e.target.value as any)} className="p-2 border rounded"><option value="spotify">Spotify</option><option value="listen">Listen</option><option value="other">Other</option></select>
                                <input type="text" value={link.url} onChange={e => handleAudioLinkChange(index, 'url', e.target.value)} className="flex-grow p-2 border rounded" placeholder="URL" />
                                <button type="button" onClick={() => removeAudioLink(index)} className="text-red-500 font-bold">X</button>
                            </div>
                        ))}
                        </div>
                        <button type="button" onClick={addAudioLink} className="mt-2 text-sm text-blue-500 hover:underline">+ リンクを追加</button>
                    </div>
                </div>
            </div>
            <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
                <ArticlePreview 
                    article={article} 
                    guests={guests} 
                    navigators={navigators} 
                    tags={tags}
                />
            </PreviewModal>
        </form>
    );
};


const AdminTaxonomyPage: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<'guest' | 'navigator' | 'tag'>('guest');
    const [items, setItems] = useState<(Person | Tag)[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortAsc, setSortAsc] = useState(true);
    const [newItemName, setNewItemName] = useState('');
    const [editingItem, setEditingItem] = useState<{ id: number; name: string } | null>(null);

    const fetchItems = async () => {
        setLoading(true);
        const data = await api.getTaxonomy(currentTab);
        setItems(data);
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, [currentTab]);

    const sortedItems = [...items].sort((a,b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim()) {
            await api.addTaxonomyItem(currentTab, newItemName.trim());
            setNewItemName('');
            fetchItems();
        }
    };

    const handleUpdateItem = async () => {
        if (editingItem) {
            await api.updateTaxonomyItem(currentTab, editingItem.id, editingItem.name);
            setEditingItem(null);
            fetchItems();
        }
    };
    
    const handleDelete = async (id: number) => {
        if (window.confirm('この項目を削除しますか？')) {
            const result = await api.deleteTaxonomyItem(currentTab, id);
            if (!result.success) alert(`削除に失敗しました: ${result.message}`);
            fetchItems();
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">タクソノミー管理</h1>
            <div className="flex border-b mb-6">
                <button onClick={() => setCurrentTab('guest')} className={`px-4 py-2 ${currentTab === 'guest' ? 'border-b-2 border-brand-2 font-bold' : ''}`}>ゲスト</button>
                <button onClick={() => setCurrentTab('navigator')} className={`px-4 py-2 ${currentTab === 'navigator' ? 'border-b-2 border-brand-2 font-bold' : ''}`}>ナビゲーター</button>
                <button onClick={() => setCurrentTab('tag')} className={`px-4 py-2 ${currentTab === 'tag' ? 'border-b-2 border-brand-2 font-bold' : ''}`}>タグ</button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder={`新規${{guest:'ゲスト',navigator:'ナビゲーター',tag:'タグ'}[currentTab]}名`} className="flex-grow px-4 py-2 border rounded-full" />
                    <button type="submit" className="bg-brand-1 text-white px-6 py-2 rounded-full font-bold">追加</button>
                </form>

                <div className="flex justify-end mb-4"><button onClick={() => setSortAsc(!sortAsc)} className="text-sm bg-gray-200 px-3 py-1 rounded-full">並び替え: {sortAsc ? 'A -> Z' : 'Z -> A'}</button></div>
                
                {loading ? <p>読み込み中...</p> : (
                    <ul className="space-y-2">
                        {sortedItems.map(item => (
                            <li key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-2 rounded hover:bg-gray-50 gap-2">
                                {editingItem?.id === item.id ? (
                                    <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="px-2 py-1 border rounded w-full sm:w-auto" />
                                ) : ( <span>{item.name}</span> )}
                                <div className="flex-shrink-0">
                                    {editingItem?.id === item.id ? (
                                        <>
                                            <button onClick={handleUpdateItem} className="text-green-500 hover:underline">保存</button>
                                            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:underline ml-2">キャンセル</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditingItem({id: item.id, name: item.name})} className="text-blue-500 hover:underline">改名</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline ml-4">削除</button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticlesPage />} />
            <Route path="articles/new" element={<AdminArticleForm />} />
            <Route path="articles/edit/:id" element={<AdminArticleForm />} />
            <Route path="taxonomies" element={<AdminTaxonomyPage />} />
        </Route>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:slug" element={<ArticleDetailPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
);

export default App;
