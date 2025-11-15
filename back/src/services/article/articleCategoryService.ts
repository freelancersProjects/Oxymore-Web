import { db } from "../../config/db";
import { ArticleCategory, ArticleCategoryData } from "../../interfaces/article/articleInterfaces";
import crypto from "crypto";

export const getAllArticleCategories = async (): Promise<ArticleCategory[]> => {
  const [rows] = await db.query("SELECT * FROM article_category ORDER BY category_name ASC");
  return rows as ArticleCategory[];
};

export const getArticleCategoryById = async (id_article_category: string): Promise<ArticleCategory | null> => {
  const [rows] = await db.query("SELECT * FROM article_category WHERE id_article_category = ?", [id_article_category]);
  const categories = rows as ArticleCategory[];
  return categories.length > 0 ? categories[0] : null;
};

export const createArticleCategory = async (data: { category_name: string }): Promise<ArticleCategoryData> => {
  const id_article_category = crypto.randomUUID();
  await db.query(
    "INSERT INTO article_category (id_article_category, category_name) VALUES (?, ?)",
    [id_article_category, data.category_name]
  );
  return {
    id_article_category,
    category_name: data.category_name
  };
};

export const updateArticleCategory = async (
  id_article_category: string,
  data: { category_name: string }
): Promise<ArticleCategory | null> => {
  const [result] = await db.query(
    "UPDATE article_category SET category_name = ? WHERE id_article_category = ?",
    [data.category_name, id_article_category]
  );

  if ((result as any).affectedRows === 0) {
    return null;
  }

  return getArticleCategoryById(id_article_category);
};

export const deleteArticleCategory = async (id_article_category: string): Promise<boolean> => {
  const [result] = await db.query("DELETE FROM article_category WHERE id_article_category = ?", [id_article_category]);
  return (result as any).affectedRows > 0;
};

