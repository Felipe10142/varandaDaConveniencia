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

    // Búsqueda por texto
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
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
            const result = await uploadToCloudinary(optimizedBuffer);
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
    }
    const uploadPromises =
      files.length > 0
        ? files.map(async (file) => {
            const optimizedBuffer = await sharp(file.buffer)
              .resize(800, 800, { fit: "inside", withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toBuffer();

            const result = await uploadToCloudinary(optimizedBuffer);
            return result.secure_url;
          })
        : [];

    const newImages = await Promise.all(uploadPromises);
    req.body.images = [...product.images, ...newImages];

    // Eliminar imágenes antiguas si se especifica
    if (req.body.imagesToDelete && Array.isArray(req.body.imagesToDelete)) {
      for (const imageUrl of req.body.imagesToDelete) {
        if (product.images.includes(imageUrl)) {
          await deleteFromCloudinary(imageUrl);
          product.images = product.images.filter((img) => img !== imageUrl);
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: product.images },
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
      await deleteFromCloudinary(imageUrl);
    }

    await Product.findByIdAndDelete(product._id);

    res.status(204).json({
      status: "sucesso",
      data: null,
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

// Middleware para procesar imágenes
export const uploadProductImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) return next();

    req.body.images = [];

    await Promise.all(
      req.files.map(async (file: Express.Multer.File, i: number) => {
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
