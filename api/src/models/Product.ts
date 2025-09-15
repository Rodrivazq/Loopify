import mongoose, { Schema, Document, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  category?: mongoose.Types.ObjectId; // ref a Category
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export default model<IProduct>("Product", ProductSchema);
