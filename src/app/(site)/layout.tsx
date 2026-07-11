import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen max-w-5xl mx-auto px-4 py-6">{children}</main>
      <Footer />
    </>
  )
}
