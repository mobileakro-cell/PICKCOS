import Link from 'next/link'

interface ExhibitionCardProps {
  id: string
  title: string
  dateRange: string
  location: string
  region: string
  image: string
  status: 'upcoming' | 'past'
  description: string
}

export default function ExhibitionCard({
  id,
  title,
  dateRange,
  location,
  region,
  image,
  status,
  description,
}: ExhibitionCardProps) {
  return (
    <Link
      href={`/exhibitions/${id}`}
      className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100"
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover bg-gray-50 group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full ${
          status === 'upcoming'
            ? 'bg-white text-gray-900'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {status === 'upcoming' ? 'Upcoming' : 'Past'}
        </span>
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-400 mb-2">{dateRange}</p>
        <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {location}
        </p>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  )
}
