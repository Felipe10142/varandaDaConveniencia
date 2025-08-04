import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Product } from "../models/Product";
import { IProduct } from "../models/Product";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import AppError from "../utils/appError";
import sharp from "sharp";
import { FilterQuery } from "mongoose";

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: FilterQuery<IProduct> = {};

    // Filtros
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }

    if (req.query.isAvailable) {
      query.isAvailable = req.query.isAvailable === "true";
    }

    if (req.query.stock) {
      query.stock = { $gt: 0 };
    }

    // Búsqueda por texto
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { tags: { $in: [new RegExp(req.query.search as string, "i")] } },
      ];
    }

    // Ordenamento
    const sortQuery: any = {};
    if (req.query.sortBy) {
      const parts = (req.query.sortBy as string).split(":");
      sortQuery[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sortQuery.createdAt = -1; // Por defecto, os mais novos primeiro
    }

    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate("reviews");

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      status: "sucesso",
      results: products.length,
      pagination: {
        current: page,
        pages,
        total,
      },
      data: products,
    });
  },
);

// @desc    Obter um produto por ID
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("reviews");

  if (!product) {
    throw new AppError("Produto não encontrado", 404);
  }

  res.status(200).json({
    status: "sucesso",
    data: product,
  });
});

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productData = {
      ...req.body,
      images: [], // Se llenarán con las URLs de Cloudinary
    };

    // Procesar imágenes si existen
    let files: Express.Multer.File[] = [];
    if (req.files && Array.isArray(req.files)) {
      files = req.files as Express.Multer.File[];
    } else if (req.files && !Array.isArray(req.files)) {
      files = Object.values(req.files).flat();
    }

    const uploadPromises =
      files.length > 0
        ? files.map(async (file) => {
            // Optimizar imagen
            const optimizedBuffer = await sharp(file.buffer)
              .resize(800, 800, { fit: "inside", withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toBuffer();

            // Subir a Cloudinary
            const result = await uploadToCloudinary(optimizedBuffer, "products");
            return result.secure_url;
          })
        : [];

    productData.images = await Promise.all(uploadPromises);

    const product = await Product.create(productData);

    res.status(201).json({
      status: "sucesso",
      data: product,
    });
  },
);

// @desc    Atualizar um produto
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    // Procesar nuevas imágenes si existen
    let files: Express.Multer.File[] = [];
    if (req.files && Array.isArray(req.files)) {
      files = req.files as Express.Multer.File[];
    } else if (req.files && !Array.isArray(req.files)) {
      files = Object.values(req.files).flat();
    }

    const uploadPromises =
      files.length > 0
        ? files.map(async (file) => {
            const optimizedBuffer = await sharp(file.buffer)
              .resize(800, 800, { fit: "inside", withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toBuffer();

            const result = await uploadToCloudinary(optimizedBuffer, "products");
            return result.secure_url;
          })
        : [];

    const newImages = await Promise.all(uploadPromises);
    const updatedImages = [...product.images, ...newImages];

    // Eliminar imágenes antiguas si se especifica
    if (req.body.imagesToDelete && Array.isArray(req.body.imagesToDelete)) {
      for (const imageUrl of req.body.imagesToDelete) {
        if (product.images.includes(imageUrl)) {
          // Extraer public_id de la URL de Cloudinary
          const publicId = imageUrl.split('/').pop()?.split('.')[0];
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
          updatedImages.splice(updatedImages.indexOf(imageUrl), 1);
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: updatedImages },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      status: "sucesso",
      data: updatedProduct,
    });
  },
);

// @desc    Eliminar um produto
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    // Eliminar imágenes de Cloudinary
    for (const imageUrl of product.images) {
      const publicId = imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await Product.findByIdAndDelete(product._id);

    res.status(204).json({
      status: "sucesso",
      data: null,
    });
  },
);

// @desc    Bulk create products
// @route   POST /api/products/bulk
// @access  Private/Admin
export const bulkCreateProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      throw new AppError("Lista de produtos é obrigatória", 400);
    }

    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      status: "sucesso",
      results: createdProducts.length,
      data: createdProducts,
    });
  },
);

// @desc    Bulk update products
// @route   PUT /api/products/bulk
// @access  Private/Admin
export const bulkUpdateProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      throw new AppError("Lista de atualizações é obrigatória", 400);
    }

    const updatePromises = updates.map(async (update) => {
      const { id, ...updateData } = update;
      return Product.findByIdAndUpdate(id, updateData, { new: true });
    });

    const updatedProducts = await Promise.all(updatePromises);

    res.status(200).json({
      status: "sucesso",
      results: updatedProducts.length,
      data: updatedProducts,
    });
  },
);

// @desc    Obter produtos por categoria
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category: req.params.category })
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");

    const total = await Product.countDocuments({
      category: req.params.category,
    });
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      status: "sucesso",
      results: products.length,
      pagination: {
        current: page,
        pages,
        total,
      },
      data: products,
    });
  },
);

// @desc    Buscar produtos
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.q as string;
    const query = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { tags: { $in: [new RegExp(searchQuery, "i")] } },
      ],
    };

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      status: "sucesso",
      results: products.length,
      pagination: {
        current: page,
        pages,
        total,
      },
      data: products,
    });
  },
);

// @desc    Obter produtos melhor valorados
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;

    const products = await Product.find({ rating: { $gte: 4 } })
      .sort("-rating -numReviews")
      .limit(limit)
      .populate("reviews");

    res.status(200).json({
      status: "sucesso",
      results: products.length,
      data: products,
    });
  },
);

// @desc    Obter produtos relacionados
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(4)
      .populate("reviews");

    res.status(200).json({
      status: "sucesso",
      results: relatedProducts.length,
      data: relatedProducts,
    });
  },
);

// @desc    Obter estatísticas de produtos
// @route   GET /api/products/stats
// @access  Private/Admin
export const getProductStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: "$price" },
          avgPrice: { $avg: "$price" },
          avgRating: { $avg: "$rating" },
          totalStock: { $sum: "$stock" },
          availableProducts: {
            $sum: { $cond: ["$isAvailable", 1, 0] },
          },
        },
      },
    ]);

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          totalStock: { $sum: "$stock" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      status: "sucesso",
      data: {
        general: stats[0] || {
          totalProducts: 0,
          totalValue: 0,
          avgPrice: 0,
          avgRating: 0,
          totalStock: 0,
          availableProducts: 0,
        },
        byCategory: categoryStats,
      },
    });
  },
);

// @desc    Upload de imagem única
// @route   POST /api/products/upload-image
// @access  Private/Admin
export const uploadProductImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("Por favor, envie uma imagem", 400);
    }

    try {
      // Optimizar imagen
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Subir a Cloudinary
      const result = await uploadToCloudinary(optimizedBuffer, "products");

      res.status(200).json({
        status: "sucesso",
        data: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      });
    } catch (error: any) {
      throw new AppError(`Erro ao fazer upload: ${error.message}`, 500);
    }
  },
);

// @desc    Eliminar imagem de produto
// @route   DELETE /api/products/delete-image
// @access  Private/Admin
export const deleteProductImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { publicId } = req.body;

    if (!publicId) {
      throw new AppError("Public ID é obrigatório", 400);
    }

    try {
      await deleteFromCloudinary(publicId);

      res.status(200).json({
        status: "sucesso",
        message: "Imagem eliminada com sucesso",
      });
    } catch (error: any) {
      throw new AppError(`Erro ao eliminar imagem: ${error.message}`, 500);
    }
  },
);

// Middleware para procesar imágenes
export const uploadProductImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) return next();

    req.body.images = [];

    // Verificar si req.files es un array o un objeto
    const files = Array.isArray(req.files) 
      ? req.files 
      : Object.values(req.files).flat();

    await Promise.all(
      files.map(async (file: Express.Multer.File, i: number) => {
        const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/products/${filename}`);

        req.body.images.push(filename);
      }),
    );

    next();
  },
);
