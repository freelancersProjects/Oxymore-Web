import { Router } from "express";
import {
  getAllArticleCategories,
  getArticleCategoryById,
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
} from "../../controllers/article/articleCategoryController";

const router = Router();

/**
 * @openapi
 * /api/article-categories:
 *   get:
 *     tags:
 *       - Article Categories
 *     summary: Récupère toutes les catégories d'articles
 *     responses:
 *       200:
 *         description: Liste des catégories d'articles
 */
router.get("/", getAllArticleCategories);

/**
 * @openapi
 * /api/article-categories/{id}:
 *   get:
 *     tags:
 *       - Article Categories
 *     summary: Récupère une catégorie d'article par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la catégorie d'article
 *       404:
 *         description: Catégorie d'article non trouvée
 */
router.get("/:id", getArticleCategoryById);

/**
 * @openapi
 * /api/article-categories:
 *   post:
 *     tags:
 *       - Article Categories
 *     summary: Crée une catégorie d'article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *             properties:
 *               category_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catégorie d'article créée
 *       400:
 *         description: Données invalides
 */
router.post("/", createArticleCategory);

/**
 * @openapi
 * /api/article-categories/{id}:
 *   put:
 *     tags:
 *       - Article Categories
 *     summary: Met à jour une catégorie d'article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *             properties:
 *               category_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catégorie d'article mise à jour
 *       404:
 *         description: Catégorie d'article non trouvée
 */
router.put("/:id", updateArticleCategory);

/**
 * @openapi
 * /api/article-categories/{id}:
 *   delete:
 *     tags:
 *       - Article Categories
 *     summary: Supprime une catégorie d'article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Catégorie d'article supprimée
 *       404:
 *         description: Catégorie d'article non trouvée
 */
router.delete("/:id", deleteArticleCategory);

export default router;

