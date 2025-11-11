import apiService from '../api/apiService';
import type { Article } from '../types/article';

export const articleService = {
  getAllArticles: async (publishedOnly: boolean = true): Promise<Article[]> => {
    try {
      const query = publishedOnly ? '?published=true' : '';
      const articles = await apiService.get(`/articles${query}`);
      return articles;
    } catch (error) {
      console.error('Error getting articles:', error);
      return [];
    }
  },

  getArticleById: async (id: string): Promise<Article | null> => {
    try {
      const article = await apiService.get(`/articles/${id}`);
      return article;
    } catch (error) {
      console.error('Error getting article by id:', error);
      return null;
    }
  }
};

