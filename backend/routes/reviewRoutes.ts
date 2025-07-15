import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getProductReviews,
  getUserReviews,
  likeReview,
  unlikeReview,
  uploadReviewImages,
  resizeReviewImages
} from '../controllers/reviewController';

const router = express.Router({ mergeParams: true });

// Obtener todas las reseñas de un producto (público)
router.get('/product/:productId', getProductReviews);

// Rutas protegidas
router.use(protect);

// Rutas para usuarios autenticados
router.get('/user/:userId', getUserReviews);
router.post('/', uploadReviewImages, resizeReviewImages, createReview);
router.get('/:id', getReview);
router.put('/:id', uploadReviewImages, resizeReviewImages, updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/like', likeReview);
router.delete('/:id/like', unlikeReview);

// Ruta para administradores
router.use(restrictTo('admin'));
router.get('/', getAllReviews);

export default router;
