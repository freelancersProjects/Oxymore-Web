import { RowDataPacket } from 'mysql2';

export interface ArticleCategory extends RowDataPacket {
  id_article_category: string;
  category_name: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleCategoryData {
  id_article_category: string;
  category_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleCategoryInput {
  category_name: string;
}

export interface Article extends RowDataPacket {
  id_article: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  id_category_article?: string;
  id_game?: string;
  id_author?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleData {
  id_article: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  id_category_article?: string;
  id_game?: string;
  id_author?: string;
  published: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleInput {
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  id_category_article?: string;
  id_game?: string;
  id_author?: string;
  published?: boolean;
  published_at?: string;
}

