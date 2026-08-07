// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/lib/indexNow.ts
//
// 📌 IndexNow क्या है (साफ़-साफ़ समझ लें):
// यह Bing और Yandex का प्रोटोकॉल है - Google इसमें शामिल नहीं है।
// Google के लिए हमारी साइट पहले से ही "Google Indexing API" (googleIndexing.ts)
// इस्तेमाल कर रही है, जो Job Post वाली साइट के लिए बिल्कुल सही तरीका है।
// यह फ़ाइल सिर्फ Bing/Yandex को तुरंत बताने के लिए है, ताकि वहाँ भी नई पोस्ट
// जल्दी दिखे - सामान्य crawling के मुकाबले (जिसमें दिन/हफ़्ते लग सकते हैं)
// यह कुछ ही मिनटों में हो जाता है।

type IndexNowResult = { success: boolean; message: string }

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

export async function pingIndexNow(url: string): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!key || !siteUrl) {
    return { success: false, message: 'IndexNow सेट नहीं है (INDEXNOW_KEY खाली है) - स्किप किया' }
  }

  const host = new URL(siteUrl).host
  const keyLocation = `${siteUrl}/indexnow-key.txt`

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: [url],
      }),
    })

    // IndexNow 200/202 दोनों = सफलतापूर्वक स्वीकार हो गया
    if (res.status === 200 || res.status === 202) {
      return { success: true, message: `Bing/Yandex को सूचित कर दिया गया (status: ${res.status})` }
    }

    if (res.status === 400) {
      return { success: false, message: 'Invalid request - URL या Key सही से जाँचें' }
    }
    if (res.status === 403) {
      return { success: false, message: 'Key Verification विफल - keyLocation पर key वाली फ़ाइल सही से नहीं मिली' }
    }
    if (res.status === 422) {
      return { success: false, message: 'URL इस host से मेल नहीं खाता या key गलत है' }
    }
    if (res.status === 429) {
      return { success: false, message: 'बहुत ज़्यादा requests - Rate Limit लग गई' }
    }

    return { success: false, message: `IndexNow से अनपेक्षित जवाब (status: ${res.status})` }
  } catch (err) {
    return { success: false, message: `IndexNow में समस्या: ${(err as Error).message}` }
  }
}
