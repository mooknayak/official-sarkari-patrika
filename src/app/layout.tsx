import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://officialsarkaripatrika.com'),
  title: {
    default: 'Official Sarkari Patrika - सरकारी नौकरी, प्रवेश पत्र और परिणाम',
    template: '%s | Official Sarkari Patrika',
  },
  description:
    'नवीनतम सरकारी नौकरी अधिसूचना, प्रवेश पत्र और परिणाम की सटीक व समय पर जानकारी।',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  )
}
