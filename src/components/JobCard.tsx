import Link from 'next/link'
import StatusBadge from './StatusBadge'

type JobCardProps = {
  title: string
  slug: string
  category: string
  status: string
  organization?: string
  updatedAt?: string
  isNew?: boolean
}

export default function JobCard({ title, slug, category, status, organization, updatedAt, isNew }: JobCardProps) {
  return (
    <Link
      href={`/${category}/${slug}`}
      className="block border border-blue-100 rounded-lg p-4 hover:shadow-md hover:border-brand-blue transition bg-white h-full"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={status} />
          {isNew && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">
              NEW
            </span>
          )}
        </div>
        {updatedAt && (
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {new Date(updatedAt).toLocaleDateString('hi-IN')}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-brand-blueDark leading-snug">{title}</h3>
      {organization && <p className="text-sm text-slate-500 mt-1">{organization}</p>}
    </Link>
  )
}
