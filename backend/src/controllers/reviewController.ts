import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ message: 'Review creada (dummy)' });
});

export const getReview = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Obtener review (dummy)' });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Review actualizada (dummy)' });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  res.status(204).json({ message: 'Review eliminada (dummy)' });
});

export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Obtener todas las reviews (dummy)' });
});

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Obtener reviews de producto (dummy)' });
});

export const getUserReviews = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Obtener reviews de usuario (dummy)' });
});

export const likeReview = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Like a review (dummy)' });
});

export const unlikeReview = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Unlike a review (dummy)' });
});

export const uploadReviewImages = (req: Request, res: Response, next: Function) => next();
export const resizeReviewImages = (req: Request, res: Response, next: Function) => next(); 