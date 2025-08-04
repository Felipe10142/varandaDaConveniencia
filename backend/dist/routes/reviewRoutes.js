import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware";
import * as reviewController from "../../src/controllers/reviewController";
const router = express.Router({ mergeParams: true });
router.get("/product/:productId", reviewController.getProductReviews);
router.use(protect);
router.get("/user/:userId", reviewController.getUserReviews);
import { validate } from "../middleware/validationMiddleware";
import { createReviewSchema } from "../validations/reviewValidation";
router.post("/", validate(createReviewSchema), reviewController.uploadReviewImages, reviewController.resizeReviewImages, reviewController.createReview);
router.get("/:id", reviewController.getReview);
router.put("/:id", reviewController.uploadReviewImages, reviewController.resizeReviewImages, reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
router.post("/:id/like", reviewController.likeReview);
router.delete("/:id/like", reviewController.unlikeReview);
router.use(restrictTo("admin"));
router.get("/", reviewController.getAllReviews);
export default router;
//# sourceMappingURL=reviewRoutes.js.map