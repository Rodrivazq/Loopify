import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [{ name: 'Micrófonos' }, { name: 'Auriculares' }, { name: 'Teclados' }],
    skipDuplicates: true,
  });

  const cats = await prisma.category.findMany();
  const byName = Object.fromEntries(cats.map(c => [c.name, c.id])) as Record<string, number>;

  await prisma.product.createMany({
    data: [
      { name: 'Micrófono de Estudio', price: 7200, imageUrl: '/mic.jpg',  stock: 8,  categoryId: byName['Micrófonos'] },
      { name: 'Auriculares Pro',      price: 2500, imageUrl: '/hp.jpg',   stock: 15, categoryId: byName['Auriculares'] },
      { name: 'Controlador MIDI',     price: 5400, imageUrl: '/midi.jpg', stock: 5,  categoryId: byName['Teclados'] },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed done');
}

main().catch(e => { console.error(e); process.exit(1); })
       .finally(() => prisma.$disconnect());
