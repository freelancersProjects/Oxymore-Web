import { Request, Response } from "express";
import * as ArticleCategoryService from "../../services/article/articleCategoryService";

export const getAllArticleCategories = async (req: Request, res: Response) => {
  try {
    const categories = await ArticleCategoryService.getAllArticleCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching article categories:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getArticleCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await ArticleCategoryService.getArticleCategoryById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Catégorie d'article non trouvée" });
      return;
    }
    res.json(category);
  } catch (error: any) {
    console.error('Error fetching article category:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createArticleCategory = async (req: Request, res: Response) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      res.status(400).json({ message: "category_name est requis" });
      return;
    }

    const newCategory = await ArticleCategoryService.createArticleCategory({ category_name });
    res.status(201).json(newCategory);
  } catch (error: any) {
    console.error('Error creating article category:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateArticleCategory = async (req: Request, res: Response) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      res.status(400).json({ message: "category_name est requis" });
      return;
    }

    const updatedCategory = await ArticleCategoryService.updateArticleCategory(req.params.id, { category_name });
    if (!updatedCategory) {
      res.status(404).json({ message: "Catégorie d'article non trouvée" });
      return;
    }

    res.json(updatedCategory);
  } catch (error: any) {
    console.error('Error updating article category:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteArticleCategory = async (req: Request, res: Response) => {
  try {
    const deleted = await ArticleCategoryService.deleteArticleCategory(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Catégorie d'article non trouvée" });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting article category:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

