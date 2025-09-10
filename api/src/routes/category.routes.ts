import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(cats);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const cat = await prisma.category.create({ data: { name } });
  res.status(201).json(cat);
});

export default router;

