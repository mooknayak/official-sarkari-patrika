// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/components/PostInfoBlock.tsx
// 🆕 अब इसमें Job Location और Salary की rows भी जुड़ गई हैं - Google Jobs में
// जो जानकारी Structured Data (JSON-LD) में भेजी जाती है, वही पेज पर भी दिखनी
// चाहिए (Google इसे "hidden data" नहीं मानता, तभी भरोसा करता है)।

type PostInfoBlockProps = {
  title: string
  publishedAt?: string
  updatedAt?: string
  organizationName?: string
  jobLocation?: string
  salaryText?: string
}

export default function PostInfoBlock({
  title,
  publishedAt,
  updatedAt,
  organizationName,
  jobLocation,
  salaryText,
}: PostInfoBlockProps) {
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
        {jobLocation && (
          <tr className="border border-blue-200">
            <td className="border border-blue-200 bg-brand-blueLight px-3 py-2.5 font-semibold text-brand-blueDark align-top">
              Job Location
            </td>
            <td className="border border-blue-200 px-3 py-2.5 text-slate-700">
              {jobLocation}
            </td>
          </tr>
        )}
        {salaryText && (
          <tr className="border border-blue-200">
            <td className="border border-blue-200 bg-brand-blueLight px-3 py-2.5 font-semibold text-brand-blueDark align-top">
              Salary / Pay Scale
            </td>
            <td className="border border-blue-200 px-3 py-2.5 text-slate-700">
              {salaryText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
