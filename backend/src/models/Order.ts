import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    name: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: "card" | "cash" | "pix";
  paymentResult?: {
    id: string;
    status: string;
    updateTime: string;
    email: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: "pending" | "processing" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "La cantidad mínima es 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "El precio no puede ser negativo"],
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    shippingAddress: {
      street: {
        type: String,
        required: [true, "La dirección es requerida"],
      },
      city: {
        type: String,
        required: [true, "La ciudad es requerida"],
      },
      state: {
        type: String,
        required: [true, "El estado es requerido"],
      },
      zipCode: {
        type: String,
        required: [true, "El código postal es requerido"],
      },
    },
    paymentMethod: {
      type: String,
      required: [true, "El método de pago es requerido"],
      enum: ["card", "cash", "pix"],
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      email: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: [0, "El precio de los items no puede ser negativo"],
    },
    taxPrice: {
      type: Number,
      required: true,
      min: [0, "El impuesto no puede ser negativo"],
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: [0, "El costo de envío no puede ser negativo"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "El precio total no puede ser negativo"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Middleware para actualizar stock después de crear una orden
orderSchema.post("save", async function (doc) {
  const Product = mongoose.model("Product");

  for (const item of doc.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }
});

// Índices
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
