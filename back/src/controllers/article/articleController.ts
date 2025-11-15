import { Request, Response } from "express";
import * as ArticleService from "../../services/article/articleService";

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const publishedOnly = req.query.published === 'true';
    const articles = await ArticleService.getAllArticles(publishedOnly);
    res.json(articles);
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const article = await ArticleService.getArticleById(req.params.id);
    if (!article) {
      res.status(404).json({ message: "Article non trouvé" });
      return;
    }
    res.json(article);
  } catch (error: any) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getArticlesByCategory = async (req: Request, res: Response) => {
  try {
    const publishedOnly = req.query.published === 'true';
    const articles = await ArticleService.getArticlesByCategory(req.params.categoryId, publishedOnly);
    res.json(articles);
  } catch (error: any) {
    console.error('Error fetching articles by category:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getArticlesByGame = async (req: Request, res: Response) => {
  try {
    const publishedOnly = req.query.published === 'true';
    const articles = await ArticleService.getArticlesByGame(req.params.gameId, publishedOnly);
    res.json(articles);
  } catch (error: any) {
    console.error('Error fetching articles by game:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getArticlesByAuthor = async (req: Request, res: Response) => {
  try {
    const publishedOnly = req.query.published === 'true';
    const articles = await ArticleService.getArticlesByAuthor(req.params.authorId, publishedOnly);
    res.json(articles);
  } catch (error: any) {
    console.error('Error fetching articles by author:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      excerpt,
      image_url,
      id_category_article,
      id_game,
      id_author,
      published,
      published_at
    } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: "title et content sont requis" });
      return;
    }

    const userId = (req as any).user?.id;
    const authorId = id_author || userId;

    const newArticle = await ArticleService.createArticle({
      title,
      content,
      excerpt,
      image_url,
      id_category_article,
      id_game,
      id_author: authorId,
      published: published !== undefined ? Boolean(published) : false,
      published_at
    });

    res.status(201).json(newArticle);
  } catch (error: any) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      excerpt,
      image_url,
      id_category_article,
      id_game,
      published,
      published_at
    } = req.body;

    const updatedArticle = await ArticleService.updateArticle(req.params.id, {
      title,
      content,
      excerpt,
      image_url,
      id_category_article,
      id_game,
      published: published !== undefined ? Boolean(published) : undefined,
      published_at
    });

    if (!updatedArticle) {
      res.status(404).json({ message: "Article non trouvé" });
      return;
    }

    res.json(updatedArticle);
  } catch (error: any) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const deleted = await ArticleService.deleteArticle(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Article non trouvé" });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

