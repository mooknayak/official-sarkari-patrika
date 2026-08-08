// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/components/PostBottomBanner.tsx
// हर Post के नीचे दिखने वाला वैकल्पिक Banner - Sanity → Website Settings →
// "📌 Post के नीचे Banner / Discover More" से Control होता है। जब तक वहाँ कोई
// फ़ोटो अपलोड नहीं होगी, यह component कुछ भी नहीं दिखाएगा (कोई नुकसान नहीं)।
import Image from 'next/image'

type PostBottomBannerProps = {
  imageUrl?: string
  link?: string
  altText?: string
}

export default function PostBottomBanner({ imageUrl, link, altText }: PostBottomBannerProps) {
  if (!imageUrl) return null

  const banner = (
    <Image
      src={imageUrl}
      alt={altText || 'Advertisement'}
      width={1200}
      height={300}
      className="w-full h-auto rounded-md border border-blue-100"
    />
  )

  return (
    <div className="my-6">
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer sponsored">
          {banner}
        </a>
      ) : (
        banner
      )}
    </div>
  )
}
