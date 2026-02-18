import Link from 'next/link'

interface SupplierCardProps {
  id: string
  name: string
  supplierType: string
  image: string
  location: string
  country: string
  verified: boolean
  ambassadorPick: boolean
  description: string
  moqRange: string
  leadTimeRange: string
  capabilities?: string[]
  compact?: boolean
}

export default function SupplierCard({
  id,
  name,
  supplierType,
  image,
  location,
  country,
  verified,
  ambassadorPick,
  description,
  moqRange,
  leadTimeRange,
  capabilities,
  compact = false,
}: SupplierCardProps) {
  return (
    <Link
      href={`/suppliers/${id}`}
      className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col border border-gray-100"
    >
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-52 object-cover bg-gray-50 group-hover:scale-105 transition-transform duration-500"
        />
        {verified && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-white text-gray-900 text-xs font-medium rounded-full shadow-sm">
            Verified
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-gray-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{supplierType}</p>
        <p className="text-sm text-gray-400 mb-4">
          {location}, {country}
        </p>
        {!compact && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1 leading-relaxed">
            {description}
          </p>
        )}
        <div className="text-xs text-gray-400 space-y-1 mb-4">
          <div>MOQ: {moqRange}</div>
          <div>Lead Time: {leadTimeRange}</div>
        </div>
        {capabilities && capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {capabilities.slice(0, compact ? 2 : 3).map((cap, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {cap}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
