import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { message: 'AI Assistant अभी सेट नहीं है (GEMINI_API_KEY खाली है)' },
        { status: 503 }
      )
    }

    const { question, postTitle, postContext } = await req.json()

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ message: 'कृपया कोई सवाल लिखें।' }, { status: 400 })
    }

    const hasSpecificPost = postTitle && postTitle.trim().length > 0

    const prompt = hasSpecificPost
      ? `तुम Official Sarkari Patrika नाम के एक सरकारी नौकरी सूचना पोर्टल के सहायक हो। नीचे एक पोस्ट की जानकारी दी गई है, उसी के आधार पर यूज़र के सवाल का सीधा, सटीक और हिंदी में जवाब दो। अगर जानकारी पोस्ट में मौजूद नहीं है, तो साफ़ बता दो कि "यह जानकारी उपलब्ध नहीं है, कृपया आधिकारिक अधिसूचना देखें" - कभी भी अंदाज़े से गलत जानकारी मत दो।

पोस्ट का शीर्षक: ${postTitle}

पोस्ट की जानकारी:
${postContext || 'कोई अतिरिक्त जानकारी उपलब्ध नहीं है।'}

यूज़र का सवाल: ${question}

जवाब सिर्फ 2-4 वाक्यों में, सीधा और साफ़ दो।`
      : `तुम Official Sarkari Patrika नाम के एक सरकारी नौकरी सूचना पोर्टल के सामान्य सहायक हो। यूज़र सरकारी नौकरी, प्रवेश पत्र, परिणाम, आवेदन प्रक्रिया, पात्रता जैसे सामान्य विषयों पर सवाल पूछ सकता है। सामान्य, उपयोगी जानकारी हिंदी में दो। अगर सवाल किसी खास भर्ती की तारीख/जानकारी के बारे में हो जो तुम्हें पता नहीं, तो कहो "कृपया इस वेबसाइट पर संबंधित पोस्ट खोलकर देखें या Search का इस्तेमाल करें" - कभी भी अंदाज़े से गलत तारीख/आँकड़े मत दो।

यूज़र का सवाल: ${question}

जवाब सिर्फ 2-4 वाक्यों में, सीधा और साफ़ दो।`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.3 },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { message: `AI से जवाब नहीं मिल पाया: ${errorData?.error?.message || response.status}` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'माफ़ कीजिए, अभी जवाब नहीं मिल पाया। कृपया दोबारा कोशिश करें।'

    return NextResponse.json({ answer })
  } catch (err) {
    return NextResponse.json(
      { message: `कुछ गड़बड़ हो गई: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}
