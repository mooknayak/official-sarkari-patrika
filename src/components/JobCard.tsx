import Link from 'next/link'
import StatusBadge from './StatusBadge'

type JobCardProps = {
  title: string
  slug: string
  category: string
  status: string
  organization?: string
  updatedAt?: string
}

export default function JobCard({ title, slug, category, status, organization, updatedAt }: JobCardProps) {
  return (
    <Link
      href={`/${category}/${slug}`}
      className="block border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-brand-saffron transition bg-white"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <StatusBadge status={status} />
        {updatedAt && (
          <span className="text-xs text-slate-400">
            {new Date(updatedAt).toLocaleDateString('hi-IN')}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-slate-800 leading-snug">{title}</h3>
      {organization && <p className="text-sm text-slate-500 mt-1">{organization}</p>}
    </Link>
  )
}
