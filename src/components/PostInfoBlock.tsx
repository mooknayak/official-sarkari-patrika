type PostInfoBlockProps = {
  title: string
  publishedAt?: string
  updatedAt?: string
  organizationName?: string
}

export default function PostInfoBlock({ title, publishedAt, updatedAt, organizationName }: PostInfoBlockProps) {
  const displayDate = updatedAt || publishedAt
  return (
    <table className="w-full text-sm border-collapse border border-blue-200 mb-6">
      <tbody>
        <tr className="border border-blue-200">
          <td className="border border-blue-200 bg-brand-blueLight px-3 py-2.5 font-semibold text-brand-blueDark w-1/3 align-top">
            Name of Post
          </td>
          <td className="border border-blue-200 px-3 py-2.5 font-bold text-brand-pinkAccent">
            {title}
          </td>
        </tr>
        {displayDate && (
          <tr className="border border-blue-200">
            <td className="border border-blue-200 bg-brand-blueLight px-3 py-2.5 font-semibold text-brand-blueDark align-top">
              Post Date / Update
            </td>
            <td className="border border-blue-200 px-3 py-2.5 text-slate-700">
              {new Date(displayDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </td>
          </tr>
        )}
        {organizationName && (
          <tr className="border border-blue-200">
            <td className="border border-blue-200 bg-brand-blueLight px-3 py-2.5 font-semibold text-brand-blueDark align-top">
              Organization
            </td>
            <td className="border border-blue-200 px-3 py-2.5 text-slate-700">
              {organizationName}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
