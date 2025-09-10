import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/** GET /api/products?q=&categoryId=&order=price-asc|price-desc|name */
router.get("/", async (req, res) => {
  try {
    const { q, categoryId, order } = req.query as any;

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (categoryId) where.categoryId = Number(categoryId);

    let orderBy: any = { createdAt: "desc" };
    if (order === "price-asc") orderBy = { price: "asc" };
    if (order === "price-desc") orderBy = { price: "desc" };
    if (order === "name") orderBy = { name: "asc" };

    const data = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

/** GET /api/products/:id */
router.get("/:id", async (req, res) => {
  try {
    const data = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true },
    });

    if (!data) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

/** POST /api/products */
router.post("/", async (req, res) => {
  try {
    const { name, description, price, imageUrl, stock = 0, categoryId } = req.body;

    const p = await prisma.product.create({
      data: {
        name,
        description: description ?? null,
        price: Number(price),
        imageUrl: imageUrl ?? null,
        stock: Number(stock ?? 0),
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });

    res.status(201).json(p);
  } catch (error) {
    res.status(400).json({ error: "No se pudo crear el producto" });
  }
});

/** PATCH /api/products/:id */
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, imageUrl, stock, categoryId } = req.body;

    const p = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price === undefined ? undefined : Number(price),
        imageUrl,
        stock: stock === undefined ? undefined : Number(stock),
        categoryId:
          categoryId === undefined
            ? undefined
            : categoryId
            ? Number(categoryId)
            : null,
      },
    });

    res.json(p);
  } catch (error) {
    res.status(400).json({ error: "No se pudo actualizar el producto" });
  }
});

/** DELETE /api/products/:id */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: "No se pudo eliminar el producto" });
  }
});

export default router;
