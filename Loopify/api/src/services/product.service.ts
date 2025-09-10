// src/services/product.service.ts
import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

// 🔹 Listar todos los productos con su categoría
export async function listProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { id: 'asc' },
  });
}

// 🔹 Obtener un producto por ID
export async function getProduct(id: number): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

// 🔹 Crear un producto
export async function createProduct(data: {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  stock?: number;
  categoryId?: number | null;
}): Promise<Product> {
  return prisma.product.create({
    data,
    include: { category: true },
  });
}

// 🔹 Actualizar un producto
export async function updateProduct(
  id: number,
  data: Partial<{
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    stock?: number;
    categoryId?: number | null;
  }>
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data,
    include: { category: true },
  });
}

// 🔹 Eliminar un producto
export async function deleteProduct(id: number): Promise<Product> {
  return prisma.product.delete({
    where: { id },
  });
}
