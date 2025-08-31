
import React from 'react';
import type { Article, Person, Tag } from '../types';
import RadioIcon from './icons/RadioIcon';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  guests: Person[];
  tags: Tag[];
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, guests, tags }) => {
  const articleGuests = guests.filter(g => article.guestIds?.includes(g.id));
  const articleTags = tags.filter(t => article.tagIds.includes(t.id));

  return (
    <Link to={`/articles/${article.slug}`} className="group block overflow-hidden rounded-xl shadow-soft transition-shadow duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-2 focus-visible:ring-offset-2">
      <div className="relative aspect-[4/3] w-full">
        {article.thumbnail_url ? (
          <img src={article.thumbnail_url} alt={article.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-tint-1">
            <RadioIcon className="h-16 w-16 text-brand-1/50" />
          </div>
        )}
      </div>
      <div className="bg-white p-4">
        <h3 className="font-bold text-ink truncate group-hover:text-brand-2">{article.title}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{articleGuests.map(g => g.name).join(', ')}</p>
        <p className="text-xs text-gray-400 mt-2">{article.published_at}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {articleTags.slice(0, 3).map(tag => (
            <span key={tag.id} className="inline-block rounded-full bg-tint-2 px-3 py-1 text-xs font-medium text-brand-2">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
