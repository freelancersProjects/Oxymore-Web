export interface Article {
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

