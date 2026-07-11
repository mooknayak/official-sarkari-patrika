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

export default function ImportantDates({ dates }: ImportantDatesProps) {
  if (!dates) return null
  const entries = Object.entries(dates).filter(([, value]) => value)
  if (entries.length === 0) return null

  return (
    <section className="my-6 border border-slate-200 rounded-lg overflow-hidden">
      <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold">महत्वपूर्ण तिथियाँ</h2>
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-t border-slate-100">
              <td className="px-4 py-2 text-slate-600">{LABELS[key] || key}</td>
              <td className="px-4 py-2 font-medium text-slate-800">
                {new Date(value as string).toLocaleDateString('hi-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
