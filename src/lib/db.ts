import type { Supplier } from './types'
import { mockSuppliers, mockArticles, mockExhibitions } from './mock'

// ── Data layer ──
// If DATABASE_URL is set (production / Supabase) → use Postgres via Prisma.
// If not (local dev with no DB) → fall back to an in-memory store seeded from
// the mock data, so the site works out of the box without any setup.
const USE_DB = !!process.env.DATABASE_URL

// Lazy import so Prisma is only touched when a database is configured
async function client() {
  return (await import('./prisma')).prisma
}

// ── In-memory fallback ──
const mem: Record<string, Map<string, any>> = {}
function memCol(collection: string): Map<string, any> {
  if (!mem[collection]) {
    const seed: Record<string, any[]> = {
      supplier: mockSuppliers,
      article: mockArticles,
      exhibition: mockExhibitions,
    }
    const m = new Map<string, any>()
    for (const item of seed[collection] || []) m.set(item.id, item)
    mem[collection] = m
  }
  return mem[collection]
}

// ── Generic collection API ──
export async function listAll<T = any>(collection: string): Promise<T[]> {
  if (!USE_DB) return [...memCol(collection).values()] as T[]
  const prisma = await client()
  const rows = await prisma.entity.findMany({ where: { collection }, orderBy: { createdAt: 'asc' } })
  return rows.map((r: { data: unknown }) => r.data as T)
}

export async function getOne<T = any>(collection: string, id: string): Promise<T | null> {
  if (!USE_DB) return (memCol(collection).get(id) as T) ?? null
  const prisma = await client()
  const row = await prisma.entity.findUnique({ where: { collection_id: { collection, id } } })
  return (row?.data as T) ?? null
}

export async function insertOne<T extends Record<string, any>>(
  collection: string,
  data: T,
  id: string = Date.now().toString(),
): Promise<T & { id: string }> {
  const full = { ...data, id }
  if (!USE_DB) {
    memCol(collection).set(id, full)
    return full
  }
  const prisma = await client()
  await prisma.entity.create({ data: { collection, id, data: full as any } })
  return full
}

export async function patchOne<T extends Record<string, any>>(
  collection: string,
  id: string,
  data: Partial<T>,
): Promise<(T & { id: string }) | null> {
  const cur = await getOne<T>(collection, id)
  if (!cur) return null
  const next = { ...cur, ...data, id } as T & { id: string }
  if (!USE_DB) {
    memCol(collection).set(id, next)
    return next
  }
  const prisma = await client()
  await prisma.entity.update({ where: { collection_id: { collection, id } }, data: { data: next as any } })
  return next
}

export async function upsertOne(collection: string, id: string, data: any): Promise<void> {
  if (!USE_DB) {
    memCol(collection).set(id, data)
    return
  }
  const prisma = await client()
  await prisma.entity.upsert({
    where: { collection_id: { collection, id } },
    create: { collection, id, data },
    update: { data },
  })
}

export async function removeOne(collection: string, id: string): Promise<boolean> {
  if (!USE_DB) return memCol(collection).delete(id)
  const prisma = await client()
  try {
    await prisma.entity.delete({ where: { collection_id: { collection, id } } })
    return true
  } catch {
    return false
  }
}

// Delete every sample-flagged record across all collections. Returns the count.
export async function clearSamples(): Promise<number> {
  if (!USE_DB) {
    let n = 0
    for (const col of Object.keys(mem)) {
      for (const [id, v] of mem[col]) {
        if (v?.sample) { mem[col].delete(id); n++ }
      }
    }
    return n
  }
  const prisma = await client()
  const res = await prisma.entity.deleteMany({ where: { data: { path: ['sample'], equals: true } } })
  return res.count
}

// ── Supplier wrappers (used by existing routes) ──
export const getSuppliers = () => listAll<Supplier>('supplier')
export const getSupplier = (id: string) => getOne<Supplier>('supplier', id)
export const createSupplier = (data: Omit<Supplier, 'id'>) => insertOne('supplier', data as any)
export const editSupplier = (id: string, data: Partial<Supplier>) => patchOne<Supplier>('supplier', id, data)
export const removeSupplier = (id: string) => removeOne('supplier', id)
