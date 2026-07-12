import { PortableText, type PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h2 className="text-xl font-bold text-brand-blueDark mt-6 mb-3">{children}</h2>
    ),
    h2: ({ children }) => (
      <h3 className="text-lg font-bold text-brand-blueDark mt-5 mb-2">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-base font-bold text-brand-blueDark mt-4 mb-2">{children}</h4>
    ),
    h4: ({ children }) => (
      <h5 className="text-sm font-bold text-brand-blueDark mt-3 mb-1">{children}</h5>
    ),
    normal: ({ children }) => (
      <p className="text-slate-700 leading-relaxed mb-3">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-pinkAccent bg-brand-pink/30 px-4 py-2 my-3 text-slate-700 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-3 space-y-1 text-slate-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-3 space-y-1 text-slate-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
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

export default function PostDescription({ value }: { value: any[] }) {
  if (!value || value.length === 0) return null
  return (
    <section className="my-6">
      <PortableText value={value} components={components} />
    </section>
  )
}
