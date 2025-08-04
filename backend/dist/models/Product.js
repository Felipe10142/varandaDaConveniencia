import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Por favor ingrese el nombre del producto"],
        trim: true,
        maxlength: [100, "El nombre no puede tener más de 100 caracteres"],
    },
    description: {
        type: String,
        required: [true, "Por favor ingrese la descripción del producto"],
        trim: true,
        maxlength: [1000, "La descripción no puede tener más de 1000 caracteres"],
    },
    price: {
        type: Number,
        required: [true, "Por favor ingrese el precio del producto"],
        min: [0, "El precio no puede ser negativo"],
    },
    category: {
        type: String,
        required: [true, "Por favor seleccione una categoría"],
        enum: ["Bebidas", "Snacks", "Comidas", "Postres", "Panadería", "Otros"],
    },
    images: [
        {
            type: String,
            required: [true, "Por favor agregue al menos una imagen"],
        },
    ],
    stock: {
        type: Number,
        required: [true, "Por favor ingrese la cantidad en stock"],
        min: [0, "El stock no puede ser negativo"],
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, "La calificación mínima es 0"],
        max: [5, "La calificación máxima es 5"],
    },
    numReviews: {
        type: Number,
        default: 0,
        min: [0, "El número de reseñas no puede ser negativo"],
    },
    discount: {
        percentage: {
            type: Number,
            min: [0, "El descuento no puede ser negativo"],
            max: [100, "El descuento no puede ser mayor a 100%"],
        },
        validUntil: Date,
    },
    nutritionalInfo: {
        calories: {
            type: Number,
            min: [0, "Las calorías no pueden ser negativas"],
        },
        proteins: {
            type: Number,
            min: [0, "Las proteínas no pueden ser negativas"],
        },
        carbs: {
            type: Number,
            min: [0, "Los carbohidratos no pueden ser negativos"],
        },
        fats: {
            type: Number,
            min: [0, "Las grasas no pueden ser negativas"],
        },
        ingredients: [String],
        allergens: [String],
    },
    preparation: {
        time: {
            type: Number,
            min: [0, "El tiempo de preparación no puede ser negativo"],
        },
        instructions: [String],
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
productSchema.virtual("finalPrice").get(function () {
    if (!this.discount ||
        !this.discount.validUntil ||
        this.discount.validUntil < new Date()) {
        return this.price;
    }
    return this.price * (1 - this.discount.percentage / 100);
});
productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
});
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
export const Product = mongoose.model("Product", productSchema);
//# sourceMappingURL=Product.js.map