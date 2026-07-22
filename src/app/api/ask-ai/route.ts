import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Active candidate models (gemini-3.6-flash, gemini-flash-latest)
const CANDIDATE_MODELS = ['gemini-3.6-flash', 'gemini-flash-latest']

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { message: 'AI Assistant सेटअप अधूरा है। .env फ़ाइल में GEMINI_API_KEY दर्ज करें।' },
        { status: 503 }
      )
    }

    const { question, postTitle, postContext, category, prompt } = await req.json()
    const query = (question || prompt || '').trim()

    if (!query) {
      return NextResponse.json({ message: 'कृपया कोई खोज शब्द या सवाल दर्ज करें।' }, { status: 400 })
    }

    // सिस्टम प्रॉम्ट जो वेबसाइट के सभी अनुभागों (Jobs, Result, Admit Card, Answer Key, Documents, Important, Organizations) के अनुसार उत्तर देता है
    const systemPrompt = `तुम "Official Sarkari Patrika" (officialsarkaripatrika.com) वेबसाइट के आधिकारिक AI सर्च और सहायक हो।

[हमारी वेबसाइट की जानकारी व परिचय (Website Information)]:
- नाम: Official Sarkari Patrika
- आधिकारिक डोमेन: officialsarkaripatrika.com
- मुख्य उद्देश्य: भारत के सभी अभ्यर्थियों को सरकारी नौकरी (Latest Jobs), एडमिट कार्ड (Admit Card), परीक्षा परिणाम (Sarkari Result), उत्तर कुंजी (Answer Key), महत्वपूर्ण दस्तावेज़ (Documents) तथा सरकारी योजनाओं (Scholarship, Pension) की त्वरित, नि:शुल्क व 100% सटीक जानकारी देना।

[वेबसाइट के मुख्य अनुभाग (Main Sections on Website)]:
1. Latest Jobs (नवीनतम सरकारी नौकरी): SSC, Railway, Banking, Police, Defense, Teaching, UPSC, BPSC, UPSSSC, State Govt Jobs आदि।
2. Admit Card (प्रवेश पत्र): सभी राष्ट्रीय व राज्य स्तरीय परीक्षाओं के हॉल टिकट/एडमिट कार्ड लिंक।
3. Result (परीक्षा परिणाम): NTA NEET, SSC, Railway, Board Results, Cutoff और मेरिट लिस्ट।
4. Answer Key (उत्तर कुंजी): आधिकारिक उत्तर कुंजी व OMR शीट डाउनलोड निर्देश।
5. Documents (महत्वपूर्ण दस्तावेज़): Aadhaar Card (Online Apply, Correction & Download Guide), New PAN Card Online, Voter ID Card Guide, Bihar Caste, Income, Residence Certificate & Bihar Dakhil Kharij Status।
6. Important (महत्वपूर्ण अपडेट्स व योजनाएं): UP Scholarship (2026-27), वृद्धा पेंशन योजना 2026 एवं अन्य जनकल्याणकारी योजनाएं।
7. Organizations (सरकारी विभाग): भारत के प्रमुख भर्ती बोर्ड (SSC, UPSC, BPSC, Railway, NTA आदि)।

[यदि यूज़र हमारी वेबसाइट (Official Sarkari Patrika) के बारे में पूछे]:
यदि यूज़र पूछे कि "Official Sarkari Patrika क्या है?", "यह वेबसाइट कैसी है?", "officialsarkaripatrika.com क्या सुविधा देती है?" या इससे जुड़ा कोई भी सवाल:
- तुम्हें अत्यंत पेशेवर, उत्साहजनक और सम्मानजनक हिंदी में उत्तर देना है:
"Official Sarkari Patrika (officialsarkaripatrika.com) भारत का एक अत्यंत विश्वसनीय और मुफ़्त सरकारी जॉब व एजुकेशन पोर्टल है। यहाँ अभ्यर्थियों को निम्नलिखित सभी अनुभागों की सटीक व ताज़ा जानकारी सबसे पहले प्राप्त होती है:
1. Jobs (नवीनतम सरकारी नौकरियां)
2. Admit Card (प्रवेश पत्र लिंक)
3. Result (परीक्षा परिणाम व कटऑफ)
4. Answer Key (उत्तर कुंजी)
5. Documents (Aadhaar, PAN, Voter ID, Caste/Income Certificate, Dakhil Kharij गाइड)
6. Important (UP Scholarship, वृद्धा पेंशन व अन्य सरकारी योजनाएं)
7. Organizations (सरकारी विभागों की जानकारी)

हमारा मुख्य लक्ष्य अभ्यर्थियों तक बिना किसी भ्रम के सीधा, सटीक और आधिकारिक लिंक पहुँचाना है।"

[उत्तर देने के नियम (Response Guidelines)]:
1. भर्ती, परीक्षा, रिजल्ट या दस्तावेज़ से जुड़े सवालों का उत्तर पॉइंट-बाय-पॉइंट, स्पष्ट और सरल हिंदी में दो।
2. यदि पोस्ट संदर्भ दिया गया है, तो उसी पोस्ट के आधार पर जानकारी दो।

[सख्त विषय-सीमा नियम (Strict Off-Topic Policy)]:
- यदि यूज़र का सवाल हमारी वेबसाइट के विषय क्षेत्र (सरकारी भर्ती, रिजल्ट, एडमिट कार्ड, परीक्षा, दस्तावेज़, सरकारी योजनाएं, या Official Sarkari Patrika वेबसाइट) से बाहर का है (जैसे फ़िल्में, खेल, रेसिपी, पर्सनल गॉसिप आदि):
- तो तुम्हें सीधा यह जवाब देना है:
"यह सवाल हमारी वेबसाइट (Official Sarkari Patrika) के विषय क्षेत्र से बाहर का है। कृपया केवल सरकारी भर्ती, परीक्षा, रिजल्ट, एडमिट कार्ड, दस्तावेज़ गाइड या हमारी वेबसाइट से संबंधित सवाल ही पूछें।"`

    const userPrompt = postTitle
      ? `[वेबसाइट पोस्ट संदर्भ]:
शीर्षक: ${postTitle}
श्रेणी: ${category || 'Sarkari Update'}
विवरण: ${postContext || 'विवरण उपलब्ध नहीं है।'}

[यूज़र का प्रश्न / कीवर्ड]: ${query}`
      : `[यूज़र का प्रश्न / कीवर्ड]: ${query}`

    let response: Response | null = null
    let lastErrorMsg = ''
    let lastStatus = 500

    // Try active models (gemini-3.6-flash, gemini-flash-latest) in order
    for (const modelName of CANDIDATE_MODELS) {
      const apiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { maxOutputTokens: 400, temperature: 0.2 },
          }),
        }
      )

      if (apiRes.ok) {
        response = apiRes
        break
      }

      const errorData = await apiRes.json().catch(() => ({}))
      lastStatus = apiRes.status
      lastErrorMsg = errorData?.error?.message || ''

      // Quota Exceeded (429) & Rate Limit error handling
      if (lastStatus === 429 || lastErrorMsg.includes('Quota exceeded') || lastErrorMsg.includes('rate limit')) {
        return NextResponse.json(
          {
            message:
              '⚠️ AI सेवा की प्रति मिनट लिमिट (Quota Limit / 429 Error) समाप्त हो गई है। कृपया 1 मिनट बाद पुनः प्रयास करें या Google Cloud में Billing इनेबल करें।',
          },
          { status: 429 }
        )
      }
    }

    if (!response) {
      return NextResponse.json(
        { message: `AI प्रतिक्रिया नहीं मिल सकी: ${lastErrorMsg || 'HTTP Status ' + lastStatus}` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'माफ़ कीजिए, अभी जवाब उपलब्ध नहीं हो सका। कृपया पुनः प्रयास करें।'

    return NextResponse.json({ answer })
  } catch (err: any) {
    return NextResponse.json(
      { message: `सर्वर त्रुटि हुई: ${err?.message || 'अज्ञात समस्या'}` },
      { status: 500 }
    )
  }
}
