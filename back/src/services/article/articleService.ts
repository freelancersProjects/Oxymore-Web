import { db } from "../../config/db";
import { Article, ArticleData } from "../../interfaces/article/articleInterfaces";
import crypto from "crypto";

export const getAllArticles = async (publishedOnly: boolean = false): Promise<Article[]> => {
  let query = "SELECT * FROM articles";
  if (publishedOnly) {
    query += " WHERE published = TRUE ORDER BY published_at DESC";
  } else {
    query += " ORDER BY created_at DESC";
  }
  const [rows] = await db.query(query);
  return rows as Article[];
};

export const getArticleById = async (id_article: string): Promise<Article | null> => {
  const [rows] = await db.query("SELECT * FROM articles WHERE id_article = ?", [id_article]);
  const articles = rows as Article[];
  return articles.length > 0 ? articles[0] : null;
};

export const getArticlesByCategory = async (id_category_article: string, publishedOnly: boolean = false): Promise<Article[]> => {
  let query = "SELECT * FROM articles WHERE id_category_article = ?";
  if (publishedOnly) {
    query += " AND published = TRUE";
  }
  query += " ORDER BY created_at DESC";
  const [rows] = await db.query(query, [id_category_article]);
  return rows as Article[];
};

export const getArticlesByGame = async (id_game: string, publishedOnly: boolean = false): Promise<Article[]> => {
  let query = "SELECT * FROM articles WHERE id_game = ?";
  if (publishedOnly) {
    query += " AND published = TRUE";
  }
  query += " ORDER BY created_at DESC";
  const [rows] = await db.query(query, [id_game]);
  return rows as Article[];
};

export const getArticlesByAuthor = async (id_author: string, publishedOnly: boolean = false): Promise<Article[]> => {
  let query = "SELECT * FROM articles WHERE id_author = ?";
  if (publishedOnly) {
    query += " AND published = TRUE";
  }
  query += " ORDER BY created_at DESC";
  const [rows] = await db.query(query, [id_author]);
  return rows as Article[];
};

export const createArticle = async (data: {
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  id_category_article?: string;
  id_game?: string;
  id_author?: string;
  published?: boolean;
  published_at?: string;
}): Promise<ArticleData> => {
  const id_article = crypto.randomUUID();
  const published = data.published ?? false;
  const published_at = published && data.published_at ? data.published_at : (published ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null);

  await db.query(
    `INSERT INTO articles (
      id_article, title, content, excerpt, image_url, id_category_article, id_game, id_author, published, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_article,
      data.title,
      data.content,
      data.excerpt ?? null,
      data.image_url ?? null,
      data.id_category_article ?? null,
      data.id_game ?? null,
      data.id_author ?? null,
      published,
      published_at
    ]
  );
  return {
    id_article,
    ...data,
    published,
    published_at: published_at || undefined
  };
};

export const updateArticle = async (
  id_article: string,
  data: Partial<{
    title: string;
    content: string;
    excerpt?: string;
    image_url?: string;
    id_category_article?: string;
    id_game?: string;
    published?: boolean;
    published_at?: string;
  }>
): Promise<Article | null> => {
  const article = await getArticleById(id_article);
  if (!article) {
    return null;
  }

  const published = data.published !== undefined ? data.published : article.published;
  let published_at = data.published_at !== undefined ? data.published_at : article.published_at;

  // Si l'article passe de non publié à publié et qu'il n'y a pas de published_at, on le met à maintenant
  if (published && !article.published && !published_at) {
    published_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  // Si l'article passe de publié à non publié, on retire le published_at
  if (!published && article.published) {
    published_at = undefined;
  }

  const [result] = await db.query(
    `UPDATE articles SET
      title = ?, content = ?, excerpt = ?, image_url = ?, id_category_article = ?, id_game = ?, published = ?, published_at = ?
      WHERE id_article = ?`,
    [
      data.title ?? article.title,
      data.content ?? article.content,
      data.excerpt !== undefined ? data.excerpt : article.excerpt,
      data.image_url !== undefined ? data.image_url : article.image_url,
      data.id_category_article !== undefined ? data.id_category_article : article.id_category_article,
      data.id_game !== undefined ? data.id_game : article.id_game,
      published,
      published_at,
      id_article
    ]
  );

  if ((result as any).affectedRows === 0) {
    return null;
  }

  return getArticleById(id_article);
};

export const deleteArticle = async (id_article: string): Promise<boolean> => {
  const [result] = await db.query("DELETE FROM articles WHERE id_article = ?", [id_article]);
  return (result as any).affectedRows > 0;
};

