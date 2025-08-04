import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware";
import * as reviewController from "../../src/controllers/reviewController";

const router = express.Router({ mergeParams: true });

// Obtener todas las reseñas de un producto (público)
router.get("/product/:productId", reviewController.getProductReviews);

// Rutas protegidas
router.use(protect);

// Rutas para usuarios autenticados
router.get("/user/:userId", reviewController.getUserReviews);
router.post(
  "/",
  reviewController.uploadReviewImages,
  reviewController.resizeReviewImages,
  reviewController.createReview,
);
router.get("/:id", reviewController.getReview);
router.put(
  "/:id",
  reviewController.uploadReviewImages,
  reviewController.resizeReviewImages,
  reviewController.updateReview,
);
router.delete("/:id", reviewController.deleteReview);
router.post("/:id/like", reviewController.likeReview);
router.delete("/:id/like", reviewController.unlikeReview);

// Ruta para administradores
router.use(restrictTo("admin"));
router.get("/", reviewController.getAllReviews);

export default router;
