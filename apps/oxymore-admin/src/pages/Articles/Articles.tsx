import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  FileText,
  Tag,
  Gamepad2,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import Dropdown from '../../components/Dropdown/Dropdown';

interface ArticleCategory {
  id_article_category: string;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface Article {
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

interface Game {
  id: string;
  name: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ArticleCategory | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'article'; id: string } | null>(null);

  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleImageUrl, setArticleImageUrl] = useState('');
  const [articleCategoryId, setArticleCategoryId] = useState('');
  const [articleGameId, setArticleGameId] = useState('');
  const [articlePublished, setArticlePublished] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData, gamesData] = await Promise.all([
        apiService.get<Article[]>('/articles'),
        apiService.get<ArticleCategory[]>('/article-categories'),
        apiService.get<Game[]>('/games')
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await apiService.put(`/article-categories/${editingCategory.id_article_category}`, {
          category_name: categoryName.trim()
        });
      } else {
        await apiService.post('/article-categories', {
          category_name: categoryName.trim()
        });
      }
      resetCategoryForm();
      await loadData();
    } catch (error: any) {
      console.error('Error saving category:', error);
      if (error.response?.status === 403) {
        alert('Erreur d\'authentification. Veuillez vous reconnecter.');
        window.location.href = '/login';
      } else {
        alert('Erreur lors de la sauvegarde de la catégorie: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) return;

    try {
      const articleData = {
        title: articleTitle.trim(),
        content: articleContent.trim(),
        excerpt: articleExcerpt.trim() || undefined,
        image_url: articleImageUrl.trim() || undefined,
        id_category_article: articleCategoryId || undefined,
        id_game: articleGameId || undefined,
        published: articlePublished
      };

      if (editingArticle) {
        await apiService.put(`/articles/${editingArticle.id_article}`, articleData);
      } else {
        await apiService.post('/articles', articleData);
      }
      resetArticleForm();
      await loadData();
    } catch (error: any) {
      console.error('Error saving article:', error);
      if (error.response?.status === 403) {
        alert('Erreur d\'authentification. Veuillez vous reconnecter.');
        window.location.href = '/login';
      } else {
        alert('Erreur lors de la sauvegarde de l\'article: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetCategoryForm = () => {
    setCategoryName('');
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const resetArticleForm = () => {
    setArticleTitle('');
    setArticleContent('');
    setArticleExcerpt('');
    setArticleImageUrl('');
    setArticleCategoryId('');
    setArticleGameId('');
    setArticlePublished(false);
    setEditingArticle(null);
    setShowArticleForm(false);
  };

  const handleEditCategory = (category: ArticleCategory) => {
    setEditingCategory(category);
    setCategoryName(category.category_name);
    setShowCategoryForm(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setArticleExcerpt(article.excerpt || '');
    setArticleImageUrl(article.image_url || '');
    setArticleCategoryId(article.id_category_article || '');
    setArticleGameId(article.id_game || '');
    setArticlePublished(article.published);
    setShowArticleForm(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'category') {
        await apiService.delete(`/article-categories/${itemToDelete.id}`);
      } else {
        await apiService.delete(`/articles/${itemToDelete.id}`);
      }
      setItemToDelete(null);
      await loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const getCategoryName = (id?: string) => {
    if (!id) return 'Aucune';
    return categories.find(c => c.id_article_category === id)?.category_name || 'Inconnue';
  };

  const getGameName = (id?: string) => {
    if (!id) return 'Aucun';
    return games.find(g => g.id === id)?.name || 'Inconnu';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-secondary)]">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Articles</h1>
          <p className="text-[var(--text-secondary)] mt-1">Gérer les articles et catégories</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetCategoryForm();
              setShowCategoryForm(true);
            }}
            className="button-secondary px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            Nouvelle catégorie
          </button>
          <button
            onClick={() => {
              resetArticleForm();
              setShowArticleForm(true);
            }}
            className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvel article
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="card-base p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Catégories ({categories.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div
              key={category.id_article_category}
              className="p-4 bg-[var(--overlay-hover)] rounded-xl flex items-center justify-between"
            >
              <span className="font-medium text-[var(--text-primary)]">{category.category_name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
                <button
                  onClick={() => setItemToDelete({ type: 'category', id: category.id_article_category })}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles Section */}
      <div className="card-base p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Articles ({articles.length})
        </h2>
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id_article}
              className="p-4 bg-[var(--overlay-hover)] rounded-xl flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">{article.title}</h3>
                  {article.published ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Publié
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-lg flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Brouillon
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {getCategoryName(article.id_category_article)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" />
                    {getGameName(article.id_game)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditArticle(article)}
                  className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
                <button
                  onClick={() => setItemToDelete({ type: 'article', id: article.id_article })}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Form Modal */}
      <AnimatePresence>
        {showCategoryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => resetCategoryForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-base p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h2>
                <button onClick={resetCategoryForm} className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Nom de la catégorie
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="input-base w-full"
                    placeholder="Ex: Actualités, Guides..."
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="button-secondary px-4 py-2 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingCategory ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article Form Modal */}
      <AnimatePresence>
        {showArticleForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => resetArticleForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-base p-6 w-full max-w-3xl my-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
                </h2>
                <button onClick={resetArticleForm} className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    className="input-base w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Contenu *
                  </label>
                  <textarea
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="input-base w-full min-h-[200px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Résumé (excerpt)
                  </label>
                  <textarea
                    value={articleExcerpt}
                    onChange={(e) => setArticleExcerpt(e.target.value)}
                    className="input-base w-full min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    value={articleImageUrl}
                    onChange={(e) => setArticleImageUrl(e.target.value)}
                    className="input-base w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Catégorie
                    </label>
                    <Dropdown
                      options={[
                        { value: '', label: 'Aucune' },
                        ...categories.map((cat) => ({
                          value: cat.id_article_category,
                          label: cat.category_name
                        }))
                      ]}
                      value={articleCategoryId}
                      onChange={(value) => setArticleCategoryId(value)}
                      placeholder="Sélectionner une catégorie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Jeu
                    </label>
                    <Dropdown
                      options={[
                        { value: '', label: 'Aucun' },
                        ...games.map((game) => ({
                          value: game.id,
                          label: game.name
                        }))
                      ]}
                      value={articleGameId}
                      onChange={(value) => setArticleGameId(value)}
                      placeholder="Sélectionner un jeu"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={articlePublished}
                    onChange={(e) => setArticlePublished(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-[var(--text-secondary)]">
                    Publier l'article
                  </label>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetArticleForm}
                    className="button-secondary px-4 py-2 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingArticle ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title={`Supprimer ${itemToDelete?.type === 'category' ? 'la catégorie' : 'l\'article'} ?`}
        message={`Êtes-vous sûr de vouloir supprimer ${itemToDelete?.type === 'category' ? 'cette catégorie' : 'cet article'} ? Cette action est irréversible.`}
      />
    </div>
  );
};

export default Articles;

