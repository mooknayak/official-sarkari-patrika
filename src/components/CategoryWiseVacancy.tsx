type CategoryWiseVacancyProps = {
  data?: {
    ur?: number
    ews?: number
    obc?: number
    sc?: number
    st?: number
    total?: number
  }
}

const COLUMNS: { key: keyof NonNullable<CategoryWiseVacancyProps['data']>; label: string }[] = [
  { key: 'ur', label: 'UR' },
  { key: 'ews', label: 'EWS' },
  { key: 'obc', label: 'OBC' },
  { key: 'sc', label: 'SC' },
  { key: 'st', label: 'ST' },
  { key: 'total', label: 'Total' },
]

export default function CategoryWiseVacancy({ data }: CategoryWiseVacancyProps) {
  if (!data) return null
  const hasAnyValue = COLUMNS.some((col) => data[col.key] !== undefined && data[col.key] !== null)
  if (!hasAnyValue) return null

  return (
    <section className="my-6 border border-blue-200 rounded-lg overflow-hidden">
      <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold text-center">
        Category Wise Vacancy Details
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse text-center min-w-[400px]">
          <thead>
            <tr className="bg-brand-blueLight">
              {COLUMNS.map((col) => (
                <th key={col.key} className="border border-blue-200 px-3 py-2 font-bold text-brand-blueDark">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={`border border-blue-200 px-3 py-2.5 ${
                    col.key === 'total' ? 'font-bold text-brand-pinkAccent' : 'text-slate-700'
                  }`}
                >
                  {data[col.key] ?? '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
