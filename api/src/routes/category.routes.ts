import { Router, Request, Response } from "express";
import Category from "../models/Category";

const router = Router();

// GET /api/categories
router.get("/", async (_req: Request, res: Response) => {
  try {
    const cats = await Category.find().sort({ name: "asc" });
    res.json(cats);
  } catch (err) {
    console.error("list categories error:", err);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// POST /api/categories
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name es requerido" });
    }

    const cat = await Category.create({ name: name.trim() });
    res.status(201).json(cat);
  } catch (err: any) {
    console.error("create category error:", err);
    // Duplicado (índice unique)
    if (err?.code === 11000) {
      return res.status(409).json({ error: "La categoría ya existe" });
    }
    res.status(400).json({ error: "No se pudo crear la categoría" });
  }
});

export default router;
