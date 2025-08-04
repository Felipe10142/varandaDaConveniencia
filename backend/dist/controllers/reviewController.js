import asyncHandler from "express-async-handler";
import { Review } from "../models/Review";
export const createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user?._id;
    const review = await Review.create({
        rating,
        comment,
        product: productId,
        user: userId,
    });
    res.status(201).json({
        status: "sucesso",
        data: review,
    });
});
export const getReview = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Obtener review (dummy)" });
});
export const updateReview = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Review actualizada (dummy)" });
});
export const deleteReview = asyncHandler(async (req, res) => {
    res.status(204).json({ message: "Review eliminada (dummy)" });
});
export const getAllReviews = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Obtener todas las reviews (dummy)" });
});
export const getProductReviews = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Obtener reviews de producto (dummy)" });
});
export const getUserReviews = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Obtener reviews de usuario (dummy)" });
});
export const likeReview = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Like a review (dummy)" });
});
export const unlikeReview = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Unlike a review (dummy)" });
});
export const uploadReviewImages = (req, res, next) => next();
export const resizeReviewImages = (req, res, next) => next();
//# sourceMappingURL=reviewController.js.map