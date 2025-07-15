-import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  getProductsByCategory,
  searchProducts,
  getTopProducts,
  getRelatedProducts
} from '../controllers/productController';

const router = express.Router();

// Rutas públicas
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/top', getTopProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// Rutas protegidas para administradores
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', uploadProductImages, resizeProductImages, createProduct);
router.put('/:id', uploadProductImages, resizeProductImages, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
