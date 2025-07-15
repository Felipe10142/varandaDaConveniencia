import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  likes: mongoose.Types.ObjectId[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'El usuario es requerido'],
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    required: [true, 'El producto es requerido'],
    ref: 'Product'
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5']
  },
  comment: {
    type: String,
    required: [true, 'El comentario es requerido'],
    trim: true,
    maxlength: [500, 'El comentario no puede tener más de 500 caracteres']
  },
  images: [{
    type: String
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware para actualizar la calificación del producto después de una nueva reseña
reviewSchema.post('save', async function(doc) {
  const Product = mongoose.model('Product');
  
  const stats = await mongoose.model('Review').aggregate([
    { $match: { product: doc.product } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(doc.product, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await Product.findByIdAndUpdate(doc.product, {
      rating: 0,
      numReviews: 0
    });
  }
});

// Prevenir múltiples reseñas del mismo usuario para el mismo producto
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Otros índices útiles
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
