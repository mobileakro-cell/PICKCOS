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
      className="border-2 border-x-transparent border-y-[var(--color-border)] bg-surface flex flex-col group hover:border-y-[var(--color-hover-border)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-52 object-cover bg-neutral-50 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex gap-1.5">
          {verified && (
            <span className="px-2.5 py-1 bg-theme-400 text-white text-[11px] font-semibold uppercase tracking-wider">
              Verified
            </span>
          )}
          {ambassadorPick && (
            <span className="px-2.5 py-1 bg-[var(--foreground)] text-[var(--background)] text-[11px] font-semibold uppercase tracking-wider">
              Pick
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[22px] text-center leading-[1.3] mb-2 text-[var(--foreground)] group-hover:text-[var(--color-theme-600)] transition-colors">
          {name}
        </h3>
        <p className="text-[15px] text-neutral-400 mb-3 font-normal text-center">{supplierType}</p>
        <p className="text-[13px] text-[var(--color-sub-text)] mb-3 text-center">
          {location}, {country}
        </p>
        {!compact && (
          <p className="text-[15px] text-neutral-400 mb-4 line-clamp-2 flex-1 leading-[1.5] font-normal">
            {description}
          </p>
        )}
        <div className="text-[13px] text-[var(--color-sub-text)] space-y-1 mb-4">
          <div>MOQ: {moqRange}</div>
          <div>Lead Time: {leadTimeRange}</div>
        </div>
        {capabilities && capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {capabilities.slice(0, compact ? 2 : 3).map((cap, i) => (
              <span key={i} className="rounded-full border border-[var(--color-border)] bg-surface px-2 py-0.5 text-[13px] text-neutral-400 font-medium group-hover:border-theme-500/40 group-hover:text-[var(--foreground)] transition-colors">
                {cap}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
