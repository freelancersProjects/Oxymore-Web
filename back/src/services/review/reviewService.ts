import { Review, ReviewData, ReviewInput, ReviewStats } from '../../interfaces/review/reviewInterfaces';
import { db } from '../../config/db';
import crypto from 'crypto';

export const getAllReviews = async (): Promise<Review[]> => {
  const [rows] = await db.query('SELECT * FROM review ORDER BY created_at DESC');
  return rows as Review[];
};

export const getReviewById = async (id_review: string): Promise<Review | null> => {
  const [rows] = await db.query('SELECT * FROM review WHERE id_review = ?', [id_review]);
  const reviews = rows as Review[];
  return reviews.length > 0 ? reviews[0] : null;
};

export const getReviewsByUser = async (id_user: string): Promise<Review[]> => {
  const [rows] = await db.query('SELECT * FROM review WHERE id_user = ? ORDER BY created_at DESC', [id_user]);
  return rows as Review[];
};

export const getReviewsByTournament = async (id_tournament: string): Promise<Review[]> => {
  const [rows] = await db.query('SELECT * FROM review WHERE id_tournament = ? ORDER BY created_at DESC', [id_tournament]);
  return rows as Review[];
};

export const getGlobalReviews = async (): Promise<Review[]> => {
  const [rows] = await db.query('SELECT * FROM review WHERE id_tournament IS NULL ORDER BY created_at DESC');
  return rows as Review[];
};

export const createReview = async (data: ReviewInput): Promise<ReviewData> => {
  const id_review = crypto.randomUUID();
  
  await db.query(
    `INSERT INTO review (
      id_review, id_user, id_team, id_tournament, rating, comment
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id_review,
      data.id_user,
      data.id_team ?? null,
      data.id_tournament ?? null, // NULL = avis global, rempli = avis spécifique tournoi
      data.rating,
      data.comment ?? null
    ]
  );

  const review = await getReviewById(id_review);
  if (!review) {
    throw new Error('Failed to create review');
  }

  return {
    id_review: review.id_review,
    id_user: review.id_user,
    id_team: review.id_team,
    id_tournament: review.id_tournament,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    updated_at: review.updated_at
  };
};

export const updateReview = async (id_review: string, data: Partial<ReviewInput>): Promise<Review | null> => {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.rating !== undefined) {
    fields.push('rating = ?');
    values.push(data.rating);
  }
  if (data.comment !== undefined) {
    fields.push('comment = ?');
    values.push(data.comment);
  }

  if (fields.length === 0) {
    return getReviewById(id_review);
  }

  values.push(id_review);
  await db.query(`UPDATE review SET ${fields.join(', ')} WHERE id_review = ?`, values);

  return getReviewById(id_review);
};

export const deleteReview = async (id_review: string): Promise<boolean> => {
  const [result] = await db.query('DELETE FROM review WHERE id_review = ?', [id_review]);
  return (result as any).affectedRows > 0;
};

export const getReviewStats = async (): Promise<ReviewStats> => {
  const [totalRows] = await db.query('SELECT COUNT(*) as total FROM review');
  const total = (totalRows as any[])[0]?.total || 0;

  const [avgRows] = await db.query('SELECT AVG(rating) as avg FROM review');
  const average_rating = (avgRows as any[])[0]?.avg || 0;

  const [ratingRows] = await db.query(
    'SELECT rating, COUNT(*) as count FROM review GROUP BY rating ORDER BY rating'
  );
  const reviews_by_rating: Record<number, number> = {};
  (ratingRows as any[]).forEach((row: any) => {
    reviews_by_rating[row.rating] = row.count;
  });

  return {
    total_reviews: total,
    average_rating: parseFloat(average_rating.toFixed(2)),
    reviews_by_rating
  };
};

