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
      className="border-2 border-x-transparent border-y-[var(--color-border)] bg-surface group hover:border-y-[var(--color-hover-border)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover bg-neutral-50 group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
          status === 'upcoming'
            ? 'bg-theme-400 text-white'
            : 'bg-neutral-50 text-neutral-400'
        }`}>
          {status === 'upcoming' ? 'Upcoming' : 'Past'}
        </span>
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[var(--foreground)]/80 text-[var(--background)] text-[11px] font-semibold uppercase tracking-wider">
          {region}
        </span>
      </div>
      <div className="p-5">
        <p className="text-[13px] text-[var(--color-sub-text)] mb-2">{dateRange}</p>
        <h3 className="font-semibold text-[18px] mb-3 text-[var(--foreground)] group-hover:text-[var(--color-theme-600)] transition-colors line-clamp-2 leading-[1.35]">
          {title}
        </h3>
        <p className="text-[15px] text-neutral-400 mb-4 font-medium">
          {location}
        </p>
        <p className="text-[15px] text-neutral-400 line-clamp-2 leading-[1.5] font-normal">
          {description}
        </p>
      </div>
    </Link>
  )
}
