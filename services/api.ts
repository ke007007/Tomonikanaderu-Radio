import type { Article, FlattenedLibraryItem, Person, Tag } from '../types';
import { api as mockApi } from './mockApi';

// Simple REST API client wrapper for persistence-ready implementation
// Backed by a configurable BASE_URL (e.g., Cloudflare/Netlify Functions, Fly.io, Supabase Edge Functions)

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? process.env.API_BASE_URL ?? '';
const MODE = (import.meta as any).env?.MODE || process.env.NODE_ENV || 'development';
const IS_PROD = MODE === 'production';
// In production, prefer calling real API at same-origin ('') unless explicitly overridden.
// In dev, fall back to mock when no BASE_URL provided.
const USE_MOCK = !IS_PROD && !BASE_URL;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return res.status === 204 ? (undefined as any) : await res.json();
}

export const api = USE_MOCK ? mockApi : {
  // Articles
  getArticles: () => http<Article[]>('/api/articles'),
  getArticleById: (id: number) => http<Article>(`/api/articles/${id}`),
  getArticleBySlug: (slug: string) => http<Article>(`/api/articles/slug/${encodeURIComponent(slug)}`),
  createArticle: (data: Omit<Article, 'id' | 'created_at' | 'updated_at'>) =>
    http<Article>('/api/articles', { method: 'POST', body: JSON.stringify(data) }),
  updateArticle: (id: number, data: Partial<Article>) =>
    http<Article>(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteArticle: (id: number) => http<{ success: true }>(`/api/articles/${id}`, { method: 'DELETE' }),

  // Flattened library items for listing
  getFlattenedLibraryItems: () => http<FlattenedLibraryItem[]>('/api/library-items'),

  // Taxonomies
  getGuests: () => http<Person[]>('/api/guests'),
  getNavigators: () => http<Person[]>('/api/navigators'),
  getTags: () => http<Tag[]>('/api/tags'),
  addTaxonomyItem: (type: 'guest' | 'navigator' | 'tag', name: string) =>
    http(`/api/${type}s`, { method: 'POST', body: JSON.stringify({ name }) }),
  updateTaxonomyItem: (type: 'guest' | 'navigator' | 'tag', id: number, name: string) =>
    http(`/api/${type}s/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
  deleteTaxonomyItem: (type: 'guest' | 'navigator' | 'tag', id: number) =>
    http(`/api/${type}s/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: (startDate: string, endDate: string) =>
    http<{ totalViews: number; topArticles: { articleId: number; articleTitle: string; views: number }[] }>(
      `/api/analytics?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`
    ),
};
