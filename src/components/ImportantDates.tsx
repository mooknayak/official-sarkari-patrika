type ImportantDatesProps = {
  dates?: {
    applicationStart?: string
    applicationEnd?: string
    admitCardDate?: string
    examDate?: string
    resultDate?: string
  }
}

const LABELS: Record<string, string> = {
  applicationStart: 'आवेदन शुरू',
  applicationEnd: 'आवेदन की अंतिम तिथि',
  admitCardDate: 'प्रवेश पत्र जारी होने की तिथि',
  examDate: 'परीक्षा तिथि',
  resultDate: 'परिणाम तिथि',
}

const URGENT_KEYS = ['applicationEnd']

export default function ImportantDates({ dates }: ImportantDatesProps) {
  if (!dates) return null
  const entries = Object.entries(dates).filter(([, value]) => value)
  if (entries.length === 0) return null

  return (
    <div className="border border-blue-200 rounded-md overflow-hidden">
      <h3 className="bg-brand-blue text-white text-center font-bold py-2 text-sm">
        Important Dates
      </h3>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {entries.map(([key, value]) => {
            const isUrgent = URGENT_KEYS.includes(key)
            return (
              <tr key={key} className={isUrgent ? 'bg-red-50' : ''}>
                <td
                  className={`border border-blue-200 px-3 py-2 w-1/2 ${
                    isUrgent ? 'text-red-700 font-semibold' : 'text-slate-600'
                  }`}
                >
                  {isUrgent && <span className="mr-1">⏰</span>}
                  {LABELS[key] || key}
                </td>
                <td
                  className={`border border-blue-200 px-3 py-2 font-semibold ${
                    isUrgent ? 'text-red-700 font-bold' : 'text-slate-800'
                  }`}
                >
                  {new Date(value as string).toLocaleDateString('hi-IN')}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
