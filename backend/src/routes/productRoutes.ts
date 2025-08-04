import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { createProductSchema, updateProductSchema } from "../validations/productValidation";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getProductsByCategory,
  searchProducts,
  getTopProducts,
  getRelatedProducts,
  bulkCreateProducts,
  bulkUpdateProducts,
  getProductStats,
  uploadProductImage,
  deleteProductImage,
} from "../controllers/productController";

const router = express.Router();

// Rutas públicas
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/top", getTopProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProduct);
router.get("/:id/related", getRelatedProducts);

// Rutas protegidas para administradores
router.use(protect);
router.use(restrictTo("admin"));

// CRUD básico
router.post("/", uploadArray("images", 5), validate(createProductSchema), createProduct);
router.put("/:id", uploadArray("images", 5), validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

// Operaciones bulk
router.post("/bulk", bulkCreateProducts);
router.put("/bulk", bulkUpdateProducts);

// Estadísticas
router.get("/stats", getProductStats);

// Upload de imágenes individuales
router.post("/upload-image", uploadSingle("image"), uploadProductImage);
router.delete("/delete-image", deleteProductImage);

export default router;
