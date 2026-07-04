import { PrismaClient } from '@prisma/client'
import { mockSuppliers, mockArticles, mockExhibitions } from '../src/lib/mock'

const prisma = new PrismaClient()

async function seedCollection(collection: string, items: any[]) {
  for (const item of items) {
    await prisma.entity.upsert({
      where: { collection_id: { collection, id: item.id } },
      create: { collection, id: item.id, data: item },
      update: { data: item },
    })
  }
  console.log(`seeded ${items.length} ${collection}(s)`)
}

async function main() {
  await seedCollection('supplier', mockSuppliers)
  await seedCollection('article', mockArticles)
  await seedCollection('exhibition', mockExhibitions)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
