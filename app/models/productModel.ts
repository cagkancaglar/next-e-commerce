import { Document, Model, Schema, model, models } from "mongoose";
import categories from "../utils/categories";

interface ProductDocument extends Document {
  title: string;
  description: string;
  bulletPoints?: string[];
  thumbnail: { url: string; id: string };
  images?: { url: string; id: string }[];
  price: {
    base: number;
    discounted: number;
  };
  sale: number;
  quantity: number;
  category: string;
}

const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bulletPoints: { type: [String] },
    thumbnail: {
      type: Object,
      required: true,
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    price: {
      base: { type: Number, required: true },
      discounted: { type: Number, required: true },
    },
    category: {
      type: String,
      enum: [...categories],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.virtual("sale").get(function (this: ProductDocument) {
  return (this.price.base - this.price.discounted) / this.price.base;
});

const ProductModel =
  models.Product || model<ProductDocument>("Product", productSchema);

export default ProductModel as Model<ProductDocument>;
