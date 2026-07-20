import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-6xl font-extrabold text-brand-blue mb-3">404</div>
      <h1 className="text-xl font-bold text-brand-blueDark mb-2">यह पेज नहीं मिला</h1>
      <p className="text-slate-500 mb-6 max-w-sm">
        जो पोस्ट या पेज आप ढूंढ रहे हैं, वह या तो हटा दी गई है या लिंक गलत है। नीचे खोजकर देखें:
      </p>

      <form action="/search" method="GET" className="flex w-full max-w-sm mb-6">
        <input
          type="text"
          name="q"
          placeholder="यहाँ खोजें... जैसे SSC, Railway"
          className="flex-1 border border-slate-300 rounded-l-md px-3 py-2.5 text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-brand-blue text-white px-5 rounded-r-md hover:bg-brand-blueDark transition"
        >
          🔍
        </button>
      </form>

      <Link
        href="/"
        className="bg-brand-blue text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-brand-blueDark transition"
      >
        होमपेज पर जाएँ
      </Link>
    </div>
  )
}
