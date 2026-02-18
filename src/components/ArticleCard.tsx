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
  }).replace(/\//g, ' - ')

  return (
    <Link
      href={`/news/${slug}`}
      className="bg-white rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="h-48 bg-gray-50 overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-400 font-medium mb-3 tracking-wide">
          {formattedDate}
        </p>
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 font-light leading-relaxed">
          {summary}
        </p>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
      </div>
    </Link>
  )
}
