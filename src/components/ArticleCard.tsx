import Link from 'next/link'

interface ArticleCardProps {
  slug: string
  title: string
  summary: string
  category: string
  region: string
  image: string
  author: string
  publishedAt: string
}

export default function ArticleCard({
  slug,
  title,
  summary,
  category,
  region,
  image,
  author,
  publishedAt,
}: ArticleCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).replace(/\//g, '.')

  return (
    <Link
      href={`/news/${slug}`}
      className="border-2 border-x-transparent border-y-[var(--color-border)] bg-surface group hover:border-y-[var(--color-hover-border)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      <div className="h-48 bg-neutral-50 overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-theme-400 text-white text-[11px] font-semibold uppercase tracking-wider">
          {category}
        </span>
      </div>
      <div className="p-5">
        <p className="text-[13px] text-[var(--color-sub-text)] font-medium mb-3">
          {formattedDate}
        </p>
        <h3 className="text-[18px] font-semibold mb-3 text-[var(--foreground)] group-hover:text-theme-600 transition-colors line-clamp-2 leading-[1.35]">
          {title}
        </h3>
        <p className="text-[15px] text-neutral-400 mb-4 line-clamp-3 leading-[1.5] font-normal">
          {summary}
        </p>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[var(--color-border)] bg-surface px-2 py-0.5 text-[13px] text-neutral-400 font-medium">
            {region}
          </span>
        </div>
      </div>
    </Link>
  )
}
