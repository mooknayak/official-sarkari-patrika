// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/app/indexnow-key.txt/route.ts
//
// IndexNow को अपनी identity साबित करने के लिए यह फ़ाइल (आपकी असली वेबसाइट पर
// https://yourdomain.com/indexnow-key.txt) खुलनी चाहिए और उसमें सिर्फ आपकी
// INDEXNOW_KEY (env variable) की वैल्यू होनी चाहिए - कुछ और नहीं।

export async function GET() {
  const key = process.env.INDEXNOW_KEY || ''
  return new Response(key, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
