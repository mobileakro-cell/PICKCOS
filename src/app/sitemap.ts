import type { MetadataRoute } from 'next'
import { listAll } from '@/lib/db'

const SITE = 'https://pickcos.vercel.app'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/sourcing', '/about', '/news', '/exhibitions', '/register', '/request-matching', '/contact', '/privacy', '/terms']
    .map((p) => ({ url: `${SITE}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 }))

  const dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const [suppliers, articles, exhibitions] = await Promise.all([
      listAll<{ id: string }>('supplier'),
      listAll<{ slug?: string; id: string }>('article'),
      listAll<{ id: string }>('exhibition'),
    ])
    for (const s of suppliers) dynamicRoutes.push({ url: `${SITE}/suppliers/${s.id}`, changeFrequency: 'weekly', priority: 0.6 })
    for (const a of articles) dynamicRoutes.push({ url: `${SITE}/news/${a.slug || a.id}`, changeFrequency: 'monthly', priority: 0.5 })
    for (const e of exhibitions) dynamicRoutes.push({ url: `${SITE}/exhibitions/${e.id}`, changeFrequency: 'monthly', priority: 0.5 })
  } catch {
    // DB 미가용 시 정적 경로만 반환
  }

  return [...staticRoutes, ...dynamicRoutes]
}
