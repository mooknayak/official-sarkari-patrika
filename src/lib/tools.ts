// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/lib/tools.ts
export type ToolMeta = {
  slug: string
  title: string
  description: string
  icon: string
}

// 🛠️ यहाँ कोई नया Tool List में जोड़ना हो तो बस एक नई Entry जोड़ दें -
// Homepage Widget और /tools वाला पूरा पेज, दोनों अपने-आप Update हो जाएँगे
export const TOOLS: ToolMeta[] = [
  {
    slug: 'photo-signature-resizer',
    title: 'Photo & Signature Resizer',
    description: 'फोटो और हस्ताक्षर को फॉर्म के हिसाब से सही KB Size और Pixel Dimension में बदलें',
    icon: '🖼️',
  },
  {
    slug: 'age-calculator',
    title: 'Age Calculator',
    description: 'किसी भी Cut-off Date के हिसाब से सटीक उम्र (वर्ष-महीना-दिन) निकालें - पात्रता जाँचने के लिए',
    icon: '📅',
  },
  {
    slug: 'percentage-calculator',
    title: 'Percentage / CGPA Calculator',
    description: 'Marks से Percentage, या CGPA से Percentage तुरंत निकालें',
    icon: '📊',
  },
  {
    slug: 'jpg-to-pdf',
    title: 'JPG to PDF Converter',
    description: 'फॉर्म में Upload करने के लिए Photo/Document की Image को PDF में बदलें',
    icon: '📄',
  },
  {
    slug: 'resume-builder',
    title: 'Resume / CV Builder',
    description: 'अपनी जानकारी भरिए, प्रोफेशनल Resume तुरंत बन जाएगा - सीधे PDF में Download कीजिए',
    icon: '📝',
  },
]
