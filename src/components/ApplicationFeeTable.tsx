type ApplicationFeeProps = {
  fee?: {
    general?: string
    scst?: string
    paymentMode?: string
  }
}

export default function ApplicationFeeTable({ fee }: ApplicationFeeProps) {
  if (!fee || (!fee.general && !fee.scst && !fee.paymentMode)) return null

  return (
    <div className="border border-blue-200 rounded-md overflow-hidden">
      <h3 className="bg-brand-pinkAccent text-white text-center font-bold py-2 text-sm">
        Application Fee
      </h3>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {fee.general && (
            <tr>
              <td className="border border-blue-200 px-3 py-2 text-slate-600 w-1/2">General / OBC</td>
              <td className="border border-blue-200 px-3 py-2 font-semibold text-slate-800">{fee.general}</td>
            </tr>
          )}
          {fee.scst && (
            <tr>
              <td className="border border-blue-200 px-3 py-2 text-slate-600">SC / ST / PH</td>
              <td className="border border-blue-200 px-3 py-2 font-semibold text-slate-800">{fee.scst}</td>
            </tr>
          )}
          {fee.paymentMode && (
            <tr>
              <td className="border border-blue-200 px-3 py-2 text-slate-600">Payment Mode</td>
              <td className="border border-blue-200 px-3 py-2 font-semibold text-slate-800">{fee.paymentMode}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
