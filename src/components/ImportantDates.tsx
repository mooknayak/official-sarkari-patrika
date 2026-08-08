// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/components/ImportantDates.tsx
// 🆕 अब हर तारीख के लिए 2 विकल्प हैं:
//   1) असली Date चुनी हो तो वह सामान्य तरीके से दिखेगी
//   2) Date पक्की न हो तो सिर्फ़ "Note" (जैसे "जल्द जारी होगी") भरा जा सकता है -
//      वह पीले/एम्बर रंग में Highlight होकर दिखेगा, ताकि यूज़र समझ जाए कि यह
//      Tentative जानकारी है, पक्की Date नहीं।
// साथ ही "extraDates" के ज़रिए Editor अपनी मर्ज़ी से कोई भी Custom तारीख (जैसे
// Interview Date) भी इसी Table में जोड़ सकता है।

type FixedDates = {
  applicationStart?: string
  applicationStartNote?: string
  applicationEnd?: string
  applicationEndNote?: string
  admitCardDate?: string
  admitCardDateNote?: string
  examDate?: string
  examDateNote?: string
  resultDate?: string
  resultDateNote?: string
  extraDates?: { label?: string; date?: string; note?: string }[]
}

type ImportantDatesProps = { dates?: FixedDates }

const FIXED_KEYS: { dateKey: keyof FixedDates; noteKey: keyof FixedDates; label: string }[] = [
  { dateKey: 'applicationStart', noteKey: 'applicationStartNote', label: 'आवेदन शुरू' },
  { dateKey: 'applicationEnd', noteKey: 'applicationEndNote', label: 'आवेदन की अंतिम तिथि' },
  { dateKey: 'admitCardDate', noteKey: 'admitCardDateNote', label: 'प्रवेश पत्र जारी होने की तिथि' },
  { dateKey: 'examDate', noteKey: 'examDateNote', label: 'परीक्षा तिथि' },
  { dateKey: 'resultDate', noteKey: 'resultDateNote', label: 'परिणाम तिथि' },
]

const URGENT_KEYS = ['applicationEnd']

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('hi-IN')
}

// एक row बनाता है - चाहे वह Fixed field हो (जैसे Exam Date) या Custom (extraDates से)
function DateRow({
  rowKey,
  label,
  dateValue,
  noteValue,
  isUrgent,
}: {
  rowKey: string
  label: string
  dateValue?: string
  noteValue?: string
  isUrgent: boolean
}) {
  if (!dateValue && !noteValue) return null

  // Note मौजूद है (Date नहीं) → पीले/एम्बर रंग में Highlight, "Tentative" जैसा दिखेगा
  if (!dateValue && noteValue) {
    return (
      <tr key={rowKey} className="bg-amber-50">
        <td className="border border-blue-200 px-3 py-2 w-1/2 text-slate-600">
          <span className="mr-1">📌</span>
          {label}
        </td>
        <td className="border border-blue-200 px-3 py-2 font-bold text-amber-700">{noteValue}</td>
      </tr>
    )
  }

  // असली Date मौजूद है
  return (
    <tr key={rowKey} className={isUrgent ? 'bg-red-50' : ''}>
      <td
        className={`border border-blue-200 px-3 py-2 w-1/2 ${
          isUrgent ? 'text-red-700 font-semibold' : 'text-slate-600'
        }`}
      >
        {isUrgent && <span className="mr-1">⏰</span>}
        {label}
      </td>
      <td
        className={`border border-blue-200 px-3 py-2 font-semibold ${
          isUrgent ? 'text-red-700 font-bold' : 'text-slate-800'
        }`}
      >
        {formatDate(dateValue as string)}
      </td>
    </tr>
  )
}

export default function ImportantDates({ dates }: ImportantDatesProps) {
  if (!dates) return null

  const fixedRows = FIXED_KEYS.map(({ dateKey, noteKey, label }) => ({
    rowKey: dateKey,
    label,
    dateValue: dates[dateKey] as string | undefined,
    noteValue: dates[noteKey] as string | undefined,
    isUrgent: URGENT_KEYS.includes(dateKey),
  })).filter((row) => row.dateValue || row.noteValue)

  const extraRows = (dates.extraDates || [])
    .filter((item) => item?.label && (item.date || item.note))
    .map((item, idx) => ({
      rowKey: `extra-${idx}`,
      label: item.label as string,
      dateValue: item.date,
      noteValue: item.note,
      isUrgent: false,
    }))

  const allRows = [...fixedRows, ...extraRows]
  if (allRows.length === 0) return null

  return (
    <div className="border border-blue-200 rounded-md overflow-hidden">
      <h3 className="bg-brand-blue text-white text-center font-bold py-2 text-sm">
        Important Dates
      </h3>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {allRows.map((row) => (
            <DateRow key={row.rowKey} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
