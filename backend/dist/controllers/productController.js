import asyncHandler from "express-async-handler";
import { Product } from "../models/Product";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import AppError from "../utils/appError";
import sharp from "sharp";
export const getAllProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.category) {
        query.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) {
            query.price.$gte = parseFloat(req.query.minPrice);
        }
        if (req.query.maxPrice) {
            query.price.$lte = parseFloat(req.query.maxPrice);
        }
    }
    if (req.query.isAvailable) {
        query.isAvailable = req.query.isAvailable === "true";
    }
    if (req.query.stock) {
        query.stock = { $gt: 0 };
    }
    if (req.query.search) {
        query.$or = [
            { name: { $regex: req.query.search, $options: "i" } },
            { description: { $regex: req.query.search, $options: "i" } },
            { tags: { $in: [new RegExp(req.query.search, "i")] } },
        ];
    }
    const sortQuery = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sortQuery[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    else {
        sortQuery.createdAt = -1;
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
});
export const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) {
        throw new AppError("Produto não encontrado", 404);
    }
    res.status(200).json({
        status: "sucesso",
        data: product,
    });
});
export const createProduct = asyncHandler(async (req, res) => {
    const productData = {
        ...req.body,
        images: [],
    };
    let files = [];
    if (req.files && Array.isArray(req.files)) {
        files = req.files;
    }
    else if (req.files && !Array.isArray(req.files)) {
        files = Object.values(req.files).flat();
    }
    const uploadPromises = files.length > 0
        ? files.map(async (file) => {
            const optimizedBuffer = await sharp(file.buffer)
                .resize(800, 800, { fit: "inside", withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
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
});
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new AppError("Produto não encontrado", 404);
    }
    let files = [];
    if (req.files && Array.isArray(req.files)) {
        files = req.files;
    }
    else if (req.files && !Array.isArray(req.files)) {
        files = Object.values(req.files).flat();
    }
    const uploadPromises = files.length > 0
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
    if (req.body.imagesToDelete && Array.isArray(req.body.imagesToDelete)) {
        for (const imageUrl of req.body.imagesToDelete) {
            if (product.images.includes(imageUrl)) {
                const publicId = imageUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
                updatedImages.splice(updatedImages.indexOf(imageUrl), 1);
            }
        }
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { ...req.body, images: updatedImages }, { new: true, runValidators: true });
    res.status(200).json({
        status: "sucesso",
        data: updatedProduct,
    });
});
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new AppError("Produto não encontrado", 404);
    }
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
});
export const bulkCreateProducts = asyncHandler(async (req, res) => {
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
});
export const bulkUpdateProducts = asyncHandler(async (req, res) => {
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
});
export const getProductsByCategory = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
});
export const searchProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.q;
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
});
export const getTopProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const products = await Product.find({ rating: { $gte: 4 } })
        .sort("-rating -numReviews")
        .limit(limit)
        .populate("reviews");
    res.status(200).json({
        status: "sucesso",
        results: products.length,
        data: products,
    });
});
export const getRelatedProducts = asyncHandler(async (req, res) => {
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
});
export const getProductStats = asyncHandler(async (req, res) => {
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
});
export const uploadProductImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new AppError("Por favor, envie uma imagem", 400);
    }
    try {
        const optimizedBuffer = await sharp(req.file.buffer)
            .resize(800, 800, { fit: "inside", withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
        const result = await uploadToCloudinary(optimizedBuffer, "products");
        res.status(200).json({
            status: "sucesso",
            data: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });
    }
    catch (error) {
        throw new AppError(`Erro ao fazer upload: ${error.message}`, 500);
    }
});
export const deleteProductImage = asyncHandler(async (req, res) => {
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
    }
    catch (error) {
        throw new AppError(`Erro ao eliminar imagem: ${error.message}`, 500);
    }
});
export const uploadProductImages = asyncHandler(async (req, res, next) => {
    if (!req.files)
        return next();
    req.body.images = [];
    const files = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();
    await Promise.all(files.map(async (file, i) => {
        const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/img/products/${filename}`);
        req.body.images.push(filename);
    }));
    next();
});
//# sourceMappingURL=productController.js.map