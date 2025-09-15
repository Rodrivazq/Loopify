// api/src/services/product.service.ts
import mongoose from "mongoose";
import Product, { IProduct } from "../models/Product";

// 🔹 Listar todos los productos con su categoría
export async function listProducts(): Promise<IProduct[]> {
  return Product.find().populate("category").sort({ _id: 1 });
}

// 🔹 Obtener un producto por ID (Mongo ObjectId)
export async function getProduct(id: string): Promise<IProduct | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Product.findById(id).populate("category");
}

// Types para crear/actualizar
type CreateProductInput = {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  stock?: number;
  categoryId?: string | null; // ObjectId como string
};

type UpdateProductInput = Partial<CreateProductInput>;

// 🔹 Crear un producto
export async function createProduct(data: CreateProductInput): Promise<IProduct> {
  const doc: any = {
    name: data.name,
    description: data.description ?? undefined,
    price: Number(data.price),
    imageUrl: data.imageUrl ?? undefined,
    stock: data.stock !== undefined ? Number(data.stock) : 0,
  };

  if (data.categoryId !== undefined) {
    if (!data.categoryId || data.categoryId === "") doc.category = null;
    else if (mongoose.Types.ObjectId.isValid(data.categoryId)) {
      doc.category = new mongoose.Types.ObjectId(data.categoryId);
    } else {
      throw new Error("categoryId inválido");
    }
  }

  const created = await Product.create(doc);
  return created;
}

// 🔹 Actualizar un producto
export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<IProduct | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const patch: any = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.description !== undefined) patch.description = data.description;
  if (data.price !== undefined) patch.price = Number(data.price);
  if (data.imageUrl !== undefined) patch.imageUrl = data.imageUrl;
  if (data.stock !== undefined) patch.stock = Number(data.stock);

  if (data.categoryId !== undefined) {
    if (!data.categoryId || data.categoryId === "") patch.category = null;
    else if (mongoose.Types.ObjectId.isValid(data.categoryId)) {
      patch.category = new mongoose.Types.ObjectId(data.categoryId);
    } else {
      throw new Error("categoryId inválido");
    }
  }

  return Product.findByIdAndUpdate(id, patch, { new: true });
}

// 🔹 Eliminar un producto
export async function deleteProduct(id: string): Promise<IProduct | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Product.findByIdAndDelete(id);
}
