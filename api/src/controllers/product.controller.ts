import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // 👈 esto hace el join y te devuelve la categoría asociada
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los productos" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, stock, categoryId } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        stock,
        categoryId, 
      },
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "No se pudo crear el producto" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true }, // 👈 incluye la categoría
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

