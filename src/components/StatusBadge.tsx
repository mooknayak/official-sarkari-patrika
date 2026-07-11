const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  job: { label: '🟢 Notification Out', className: 'bg-green-100 text-green-800 border-green-300' },
  admit_card: { label: '🟡 Admit Card Released', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  answer_key: { label: '🔵 Answer Key Released', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  result: { label: '🔴 Result Declared', className: 'bg-red-100 text-red-800 border-red-300' },
  final_selection: { label: '⚫ Final Selection', className: 'bg-slate-200 text-slate-800 border-slate-400' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'bg-slate-100 text-slate-700 border-slate-300' }
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${config.className}`}>
      {config.label}
    </span>
  )
}
