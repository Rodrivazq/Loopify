import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";

const router = Router();

/** GET /api/products?q=&categoryId=&order=price-asc|price-desc|name */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { q, categoryId, order } = req.query as {
      q?: string;
      categoryId?: string;
      order?: "price-asc" | "price-desc" | "name";
    };

    // Filtro
    const where: any = {};
    if (q && q.trim()) {
      where.$or = [
        { name: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
      ];
    }
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      where.category = new mongoose.Types.ObjectId(categoryId);
    }

    // Orden
    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (order === "price-asc") sort = { price: 1 };
    if (order === "price-desc") sort = { price: -1 };
    if (order === "name") sort = { name: 1 };

    const data = await Product.find(where).populate("category").sort(sort);
    res.json(data);
  } catch (error) {
    console.error("GET /products error:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

/** GET /api/products/:id */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const data = await Product.findById(id).populate("category");
    if (!data) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(data);
  } catch (error) {
    console.error("GET /products/:id error:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

/** POST /api/products */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, stock = 0, categoryId } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "name y price son requeridos" });
    }

    let category: mongoose.Types.ObjectId | null | undefined = undefined;
    if (categoryId !== undefined) {
      if (categoryId === null || categoryId === "") {
        category = null; // limpiar categoría
      } else if (mongoose.Types.ObjectId.isValid(categoryId)) {
        category = new mongoose.Types.ObjectId(categoryId);
      } else {
        return res.status(400).json({ error: "categoryId no es un ObjectId válido" });
      }
    }

    const p = await Product.create({
      name,
      description: description ?? undefined,
      price: Number(price),
      imageUrl: imageUrl ?? undefined,
      stock: Number(stock ?? 0),
      category,
    });

    res.status(201).json(p);
  } catch (error) {
    console.error("POST /products error:", error);
    res.status(400).json({ error: "No se pudo crear el producto" });
  }
});

/** PATCH /api/products/:id */
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { name, description, price, imageUrl, stock, categoryId } = req.body;

    const update: any = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = Number(price);
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (stock !== undefined) update.stock = Number(stock);

    if (categoryId !== undefined) {
      if (categoryId === null || categoryId === "") {
        update.category = null;
      } else if (mongoose.Types.ObjectId.isValid(categoryId)) {
        update.category = new mongoose.Types.ObjectId(categoryId);
      } else {
        return res.status(400).json({ error: "categoryId no es un ObjectId válido" });
      }
    }

    const p = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!p) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(p);
  } catch (error) {
    console.error("PATCH /products/:id error:", error);
    res.status(400).json({ error: "No se pudo actualizar el producto" });
  }
});

/** DELETE /api/products/:id */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });

    res.sendStatus(204);
  } catch (error) {
    console.error("DELETE /products/:id error:", error);
    res.status(400).json({ error: "No se pudo eliminar el producto" });
  }
});

export default router;
