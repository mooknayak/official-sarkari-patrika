// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/ToolsSection.tsx
import Link from 'next/link'
import { TOOLS } from '@/lib/tools'

export default function ToolsSection() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-brand-blueDark border-l-4 border-brand-pinkAccent pl-3">
          🛠️ Official Tools
        </h2>
        <Link href="/tools" className="text-sm font-semibold text-brand-blue hover:underline shrink-0">
          सभी देखें →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="bg-white border border-blue-100 rounded-lg p-3 text-center hover:border-brand-blue hover:shadow-md transition"
          >
            <div className="text-2xl mb-1">{tool.icon}</div>
            <div className="text-xs font-semibold text-slate-700 leading-snug">{tool.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
