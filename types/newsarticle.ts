/**
 * Types of articles that can be posted
 */
export type ArticleType =
  | 'news'
  | 'match_report'
  | 'announcement'
  | 'press_release';

/**
 * Represents a single news article
 */
export interface Article {
  id: number;
  team_id: string;
  title: string;
  date_posted: string;
  date_formatted?: string;
  type: ArticleType;
  text: string;
  image: string;
  guid: string;
  meta_description?: string;
  meta_tags?: string;
  status?: 'draft' | 'published';
}

/**
 * API response when creating an article
 */
export interface CreateArticleResponse {
  message: string;
  article: Article;
}

/**
 * API response for fetching multiple articles
 */
export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  per_page: number;
}
