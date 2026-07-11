import StatusBadge from './StatusBadge'

type TimelineEntry = {
  status: string
  date: string
  note?: string
}

export default function StatusTimeline({ timeline }: { timeline?: TimelineEntry[] }) {
  if (!timeline || timeline.length === 0) return null

  return (
    <section className="my-6 border border-slate-200 rounded-lg overflow-hidden">
      <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold">
        अपडेट हिस्ट्री (Status Timeline)
      </h2>
      <ul className="divide-y divide-slate-100">
        {timeline.map((entry, idx) => (
          <li key={idx} className="flex items-start gap-3 px-4 py-3">
            <StatusBadge status={entry.status} />
            <div>
              <p className="text-sm text-slate-500">
                {new Date(entry.date).toLocaleDateString('hi-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              {entry.note && <p className="text-sm text-slate-700 mt-1">{entry.note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
