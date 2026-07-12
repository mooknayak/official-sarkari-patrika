import { PortableText, type PortableTextComponents } from '@portabletext/react'

const richComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h3 className="text-lg font-bold text-brand-blueDark mt-4 mb-2">{children}</h3>,
    h2: ({ children }) => <h4 className="text-base font-bold text-brand-blueDark mt-3 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="text-slate-700 leading-relaxed mb-3">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-pinkAccent bg-brand-pink/30 px-4 py-2 my-3 text-slate-700 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1 text-slate-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1 text-slate-700">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-brand-blueDark">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-brand-pinkAccent underline hover:text-brand-blue"
      >
        {children}
      </a>
    ),
  },
}

type CustomBlockSimpleProps = {
  data?: { heading?: string; content?: string }
}

type CustomBlockRichProps = {
  data?: { heading?: string; content?: any[] }
}

export function CustomBlockSimple({ data }: CustomBlockSimpleProps) {
  if (!data?.heading || !data?.content) return null
  return (
    <section className="my-6 border border-blue-200 rounded-lg overflow-hidden">
      <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold">{data.heading}</h2>
      <p className="p-4 text-slate-700 whitespace-pre-line leading-relaxed">{data.content}</p>
    </section>
  )
}

export function CustomBlockRich({ data }: CustomBlockRichProps) {
  if (!data?.heading || !data?.content || data.content.length === 0) return null
  return (
    <section className="my-6 border border-blue-200 rounded-lg overflow-hidden">
      <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold">{data.heading}</h2>
      <div className="p-4">
        <PortableText value={data.content} components={richComponents} />
      </div>
    </section>
  )
}
