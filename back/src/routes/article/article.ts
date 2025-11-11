import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  getArticlesByCategory,
  getArticlesByGame,
  getArticlesByAuthor,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../controllers/article/articleController";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Récupère tous les articles
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrer par statut de publication
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get("/", getAllArticles);

/**
 * @openapi
 * /api/articles/{id}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Récupère un article par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'article
 *       404:
 *         description: Article non trouvé
 */
router.get("/:id", getArticleById);

/**
 * @openapi
 * /api/articles/category/{categoryId}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Récupère les articles d'une catégorie
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: published
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrer par statut de publication
 *     responses:
 *       200:
 *         description: Liste des articles de la catégorie
 */
router.get("/category/:categoryId", getArticlesByCategory);

/**
 * @openapi
 * /api/articles/game/{gameId}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Récupère les articles d'un jeu
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: published
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrer par statut de publication
 *     responses:
 *       200:
 *         description: Liste des articles du jeu
 */
router.get("/game/:gameId", getArticlesByGame);

/**
 * @openapi
 * /api/articles/author/{authorId}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Récupère les articles d'un auteur
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: published
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrer par statut de publication
 *     responses:
 *       200:
 *         description: Liste des articles de l'auteur
 */
router.get("/author/:authorId", getArticlesByAuthor);

/**
 * @openapi
 * /api/articles:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Crée un article
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               image_url:
 *                 type: string
 *               id_category_article:
 *                 type: string
 *               id_game:
 *                 type: string
 *               id_author:
 *                 type: string
 *               published:
 *                 type: boolean
 *               published_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Article créé
 *       400:
 *         description: Données invalides
 */
router.post("/", authenticateToken, createArticle);

/**
 * @openapi
 * /api/articles/{id}:
 *   put:
 *     tags:
 *       - Articles
 *     summary: Met à jour un article
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               image_url:
 *                 type: string
 *               id_category_article:
 *                 type: string
 *               id_game:
 *                 type: string
 *               published:
 *                 type: boolean
 *               published_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       404:
 *         description: Article non trouvé
 */
router.put("/:id", authenticateToken, updateArticle);

/**
 * @openapi
 * /api/articles/{id}:
 *   delete:
 *     tags:
 *       - Articles
 *     summary: Supprime un article
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 */
router.delete("/:id", authenticateToken, deleteArticle);

export default router;

