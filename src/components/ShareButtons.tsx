'use client'

import { useState } from 'react'

type ShareButtonsProps = {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="my-6 border border-blue-200 rounded-lg overflow-hidden">
      <h2 className="bg-brand-blue text-white px-4 py-2 font-semibold">📤 Share This Post</h2>
      <div className="p-4 flex flex-wrap gap-3">
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.004 2C6.478 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.003L2 22l5.13-1.346A9.955 9.955 0 0012.004 22C17.53 22 22 17.523 22 12S17.53 2 12.004 2zm0 18.129a8.1 8.1 0 01-4.13-1.13l-.296-.176-3.048.8.813-2.969-.192-.305a8.106 8.106 0 01-1.24-4.35c0-4.482 3.646-8.128 8.096-8.128 2.163 0 4.196.842 5.723 2.372a8.04 8.04 0 012.372 5.727c0 4.482-3.646 8.159-8.098 8.159z" />
          </svg>
          WhatsApp
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
          Facebook
        </a>

        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#26A5E4] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.905 2.379a1.75 1.75 0 00-1.79-.276L2.6 9.24c-1.207.481-1.196 2.19.017 2.654l4.71 1.8 2.02 6.29c.234.729 1.174.938 1.7.383l2.499-2.632 4.552 3.355c.72.531 1.755.14 1.94-.735l3.11-15.53a1.75 1.75 0 00-.243-1.446zM9.06 13.42l9.2-6.62c.19-.137.42.11.257.28l-7.5 7.86a1 1 0 00-.263.51l-.36 2.02-1.334-3.98a.55.55 0 01-.001-.07z" />
          </svg>
          Telegram
        </a>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 border border-brand-blue text-brand-blue px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-blueLight transition"
        >
          {copied ? '✅ Copied!' : '🔗 Copy Link'}
        </button>
      </div>
    </div>
  )
}
