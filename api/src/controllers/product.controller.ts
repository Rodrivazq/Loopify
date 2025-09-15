// api/src/controllers/product.controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";           // <- modelo Mongoose
import Category from "../models/Category";      // <- opcional si querés validar existencia

/** GET /api/products */
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ error: "No se pudieron obtener los productos" });
  }
};

/** POST /api/products */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, stock, categoryId } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "name y price son requeridos" });
    }

    // Validación simple de ObjectId para la categoría (si viene)
    let category: mongoose.Types.ObjectId | undefined;
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ error: "categoryId no es un ObjectId válido" });
      }
      category = new mongoose.Types.ObjectId(categoryId);
      // (Opcional) validar que exista la categoría:
      // const exists = await Category.exists({ _id: category });
      // if (!exists) return res.status(400).json({ error: "La categoría no existe" });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      imageUrl,
      stock: stock !== undefined ? Number(stock) : undefined,
      category, // guarda el ObjectId
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(400).json({ error: "No se pudo crear el producto" });
  }
};

/** GET /api/products/:id */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};
