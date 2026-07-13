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
    highlight: ({ children }) => (
      <mark className="bg-yellow-200 text-brand-blueDark px-1 rounded font-medium">
        {children}
      </mark>
    ),
  },
}

type CustomSection = {
  heading?: string
  content?: any[]
}

type CustomSectionsListProps = {
  sections?: CustomSection[]
}

// यह component जितने भी Title+Description बॉक्स Studio में जोड़े गए हों,
// सबको अलग-अलग बॉक्स के रूप में क्रम से दिखाता है (Multiple Boxes Support)
export default function CustomSectionsList({ sections }: CustomSectionsListProps) {
  if (!sections || sections.length === 0) return null

  const validSections = sections.filter((s) => s.heading && s.content && s.content.length > 0)
  if (validSections.length === 0) return null

  return (
    <>
      {validSections.map((section, idx) => (
        <section key={idx} className="my-6 border border-blue-200 rounded-lg overflow-hidden">
          <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold">{section.heading}</h2>
          <div className="p-4">
            <PortableText value={section.content!} components={richComponents} />
          </div>
        </section>
      ))}
    </>
  )
}
