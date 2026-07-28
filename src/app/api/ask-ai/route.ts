import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Google समय-समय पर मॉडल के नाम बदलता/बंद करता रहता है, और मुफ़्त plan में हर
// मॉडल की अपनी अलग "प्रति-मिनट सीमा" (rate limit) भी होती है। इसलिए यहाँ सिर्फ
// एक मॉडल चुनने की बजाय, कई उपलब्ध मॉडलों की एक क्रमबद्ध लिस्ट बनाई जाती है -
// अगर पहला मॉडल व्यस्त/बंद मिले, तो अपने-आप अगले पर कोशिश हो जाती है।

let cachedModels: string[] | null = null
let cachedAt = 0
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000 // 6 घंटे

async function getCandidateModels(): Promise<string[]> {
  const now = Date.now()
  if (cachedModels && now - cachedAt < CACHE_DURATION_MS) {
    return cachedModels
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
  )
  if (!res.ok) {
    throw new Error(`मॉडल लिस्ट नहीं मिल पाई (status ${res.status})`)
  }

  const data = await res.json()
  const models: any[] = data?.models || []

  const usable = models.filter((m) =>
    (m.supportedGenerationMethods || []).includes('generateContent')
  )

  if (usable.length === 0) {
    throw new Error('कोई भी इस्तेमाल करने लायक Gemini मॉडल नहीं मिला')
  }

  // "flash" वाले (तेज़ और सस्ते) मॉडल सबसे ऊपर, बाकी बाद में - ताकि पहला विकल्प
  // हमेशा सबसे तेज़/सस्ता हो, पर ज़रूरत पड़ने पर बाकी भी आज़माए जा सकें
  const sorted = [...usable].sort((a, b) => {
    const aFlash = a.name?.toLowerCase().includes('flash') ? 0 : 1
    const bFlash = b.name?.toLowerCase().includes('flash') ? 0 : 1
    return aFlash - bFlash
  })

  const names = sorted.map((m) => m.name.replace('models/', '')).slice(0, 5)

  cachedModels = names
  cachedAt = now
  return names
}

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

    let candidateModels: string[]
    try {
      candidateModels = await getCandidateModels()
    } catch (err) {
      return NextResponse.json(
        { message: `Model पता नहीं चल पाया: ${(err as Error).message}` },
        { status: 502 }
      )
    }

    let lastErrorMessage = ''
    let hitRateLimit = false

    for (const modelName of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 300, temperature: 0.3 },
            }),
          }
        )

        if (response.ok) {
          const data = await response.json()
          const answer =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'माफ़ कीजिए, अभी जवाब नहीं मिल पाया। कृपया दोबारा कोशिश करें।'
          return NextResponse.json({ answer })
        }

        // 429 = Rate limit / Quota खत्म - अगले मॉडल पर कोशिश करते हैं
        if (response.status === 429) {
          hitRateLimit = true
          continue
        }

        // कोई और error (जैसे model deprecated) - cache साफ़ करके अगले मॉडल पर कोशिश
        const errorData = await response.json().catch(() => ({}))
        lastErrorMessage = errorData?.error?.message || `status ${response.status}`
        cachedModels = null
      } catch (err) {
        lastErrorMessage = (err as Error).message
      }
    }

    // सभी मॉडल आज़माने के बाद भी जवाब नहीं मिला
    if (hitRateLimit) {
      return NextResponse.json(
        {
          message:
            'अभी बहुत सारे लोग एक साथ AI का इस्तेमाल कर रहे हैं। कृपया 20-30 सेकंड बाद दोबारा कोशिश करें।',
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { message: `AI से जवाब नहीं मिल पाया: ${lastErrorMessage || 'अज्ञात गड़बड़ी'}` },
      { status: 502 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: `कुछ गड़बड़ हो गई: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}
