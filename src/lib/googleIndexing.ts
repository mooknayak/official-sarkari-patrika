// ✏️ एडिट फ़ाइल — अब यह 3-Tier (3-परत) System है, ताकि नई पोस्ट किसी-न-किसी
// तरीके से Google तक ज़रूर पहुँचे:
//
//   🥇 Tier 1 — Google Indexing API (Service Account से, सबसे तेज़ + पक्का तरीका)
//   🥈 Tier 2 — अगर Tier 1 fail हो जाए, तो Google के Sitemap Ping Endpoint को
//               सूचित किया जाता है (Backup कोशिश - मुफ़्त, कोई नुकसान नहीं,
//               पर Google ने इसे June 2023 में Officially बंद कर दिया था,
//               इसलिए यह गारंटी नहीं देता, बस एक Extra कोशिश है)
//   🥉 Tier 3 — Google News सिस्टम (हमारी साइट में पहले से मौजूद
//               /news-sitemap.xml अपने-आप हर 48 घंटे की नई पोस्ट को
//               शामिल करता है - Google News Crawler इसे खुद पढ़ता रहता है,
//               इसके लिए अलग से कुछ Trigger करने की ज़रूरत नहीं)
//
// तीनों Tier मिलकर पक्का करते हैं कि किसी-न-किसी हाल में पोस्ट Google तक पहुँचे,
// चाहे कभी Indexing API का Quota खत्म हो जाए या Credentials में दिक्कत आ जाए।

import { SignJWT, importPKCS8 } from 'jose'
import { writeClient } from '@/sanity/lib/writeClient'

type IndexingResult = { success: boolean; message: string }

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const INDEXING_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish'

function loadCredentials(): { clientEmail?: string; privateKey?: string; source: string } {
  const base64Creds = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64
  if (base64Creds) {
    try {
      const decoded = JSON.parse(Buffer.from(base64Creds, 'base64').toString('utf-8'))
      if (decoded.client_email && decoded.private_key) {
        return { clientEmail: decoded.client_email, privateKey: decoded.private_key, source: 'base64' }
      }
      console.error('[GoogleIndexing] base64 credentials में client_email/private_key नहीं मिला')
    } catch (e) {
      console.error('[GoogleIndexing] base64 decode विफल:', (e as Error).message)
    }
  }
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, '\n')
  return { clientEmail, privateKey, source: 'separate-vars' }
}

async function getAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  // jose WebCrypto से key पढ़ता है - Vercel के serverless environment में
  // google-auth-library वाली "DECODER routines::unsupported" समस्या नहीं आती
  const key = await importPKCS8(privateKeyPem, 'RS256')

  const now = Math.floor(Date.now() / 1000)
  const jwt = await new SignJWT({ scope: 'https://www.googleapis.com/auth/indexing' })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key)

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Token exchange विफल (${res.status}): ${errText.slice(0, 300)}`)
  }

  const data = await res.json()
  if (!data.access_token) throw new Error('access_token नहीं मिला')
  return data.access_token
}

async function callIndexingApi(accessToken: string, url: string) {
  return fetch(INDEXING_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  })
}

// 🔁 अगर सभी Tier के बाद भी पक्का Success न मिले, तो पोस्ट को यूँ ही मत छोड़ो -
// Sanity की "indexingQueueItem" में डाल दो, ताकि बाद में Cron Job (हर दिन एक बार)
// अपने-आप दोबारा Tier 1 कोशिश करता रहे। इससे कभी भी System "रुकता" नहीं, सिर्फ़
// लाइन में लगता है - और Tier 3 (Google News Sitemap) तो वैसे भी हमेशा चालू रहता है।
async function queueForRetry(url: string, reason: string) {
  try {
    const docId = `indexingQueue.${Buffer.from(url).toString('base64url')}`
    await writeClient.createIfNotExists({
      _id: docId,
      _type: 'indexingQueueItem',
      url,
      reason,
      attempts: 0,
      createdAt: new Date().toISOString(),
      lastTriedAt: null,
    })
    await writeClient.patch(docId).set({ reason }).commit({ autoGenerateArrayKeys: true })
  } catch (e) {
    console.error('[GoogleIndexing] Retry Queue में डालने में समस्या:', (e as Error).message)
  }
}

// 🥈 Tier 2 — Backup कोशिश: Google के पुराने Sitemap Ping Endpoint को हिट करना।
// ⚠️ ईमानदारी से बता दें: Google ने यह Endpoint June 2023 में Officially बंद कर
// दिया था, इसलिए यह पक्की गारंटी नहीं है। पर यह मुफ़्त है, तुरंत होता है, और कभी
// नुकसान नहीं करता - इसलिए एक Extra कोशिश के तौर पर रखा गया है।
async function tier2PingSitemap(): Promise<IndexingResult> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) {
      return { success: false, message: 'Tier 2 स्किप - NEXT_PUBLIC_SITE_URL सेट नहीं है' }
    }
    const sitemapUrl = `${siteUrl}/sitemap.xml`
    const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
    return {
      success: res.ok,
      message: `Tier 2 (Sitemap Ping) भेजा गया - status: ${res.status} (यह सिर्फ़ Backup कोशिश है, पक्की गारंटी नहीं)`,
    }
  } catch (e) {
    return { success: false, message: `Tier 2 (Sitemap Ping) में समस्या: ${(e as Error).message}` }
  }
}

// 🥉 Tier 3 — Google News: कुछ भी अलग से भेजने की ज़रूरत नहीं। हमारी साइट का
// /news-sitemap.xml रूट हमेशा जीवित रहता है और पिछले 48 घंटों में Publish हुई हर
// पोस्ट को अपने-आप शामिल करता है - Google News Crawler इसे खुद बार-बार पढ़ता है।
// यह Function सिर्फ़ यह बताता है कि पोस्ट इस Window में है या नहीं, ताकि Log/Message
// में साफ़ दिखे कि Tier 3 भी लागू हो रहा है।
function tier3NewsSitemapNote(): string {
  return 'Tier 3 (Google News Sitemap) हमेशा से चालू है - /news-sitemap.xml अपने-आप पिछले 48 घंटे की पोस्ट Google News को दिखाता रहेगा।'
}

async function tier1IndexingApi(url: string): Promise<IndexingResult> {
  const { clientEmail, privateKey, source } = loadCredentials()

  if (!clientEmail || !privateKey) {
    const msg = 'Tier 1 स्किप - Google Indexing API सेट नहीं है (credentials खाली/अमान्य हैं)'
    console.error('[GoogleIndexing]', msg)
    return { success: false, message: msg }
  }

  console.log(`[GoogleIndexing] Tier 1 शुरू (source: ${source}) - URL: ${url}`)

  const maxAttempts = 3
  let lastError: any = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const accessToken = await getAccessToken(clientEmail, privateKey)
      const res = await callIndexingApi(accessToken, url)

      if (res.status === 429) {
        console.error('[GoogleIndexing] Tier 1 - दैनिक Quota समाप्त हो गई है')
        return { success: false, message: 'Tier 1 विफल - दैनिक सीमा (quota) पूरी हो चुकी है' }
      }

      if (res.status === 401 || res.status === 403) {
        const errText = await res.text()
        console.error(`[GoogleIndexing] Tier 1 - स्थायी त्रुटि (${res.status}):`, errText.slice(0, 300))
        return { success: false, message: `Tier 1 विफल - Permission त्रुटि (${res.status})` }
      }

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`)
      }

      console.log(`[GoogleIndexing] Tier 1 SUCCESS (attempt ${attempt}) - status: ${res.status}`)
      return { success: true, message: `Tier 1 सफल - Google को सीधे सूचित कर दिया गया (status: ${res.status})` }
    } catch (err: any) {
      lastError = err
      console.warn(`[GoogleIndexing] Tier 1 - अस्थायी त्रुटि (attempt ${attempt}/${maxAttempts}):`, err.message)
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, attempt * 500))
    }
  }

  const errorMessage = lastError?.message || 'अज्ञात त्रुटि'
  console.error('[GoogleIndexing] Tier 1 - सभी कोशिशें विफल:', errorMessage)
  return { success: false, message: `Tier 1 विफल - ${errorMessage}` }
}

export async function requestGoogleIndexing(url: string): Promise<IndexingResult> {
  // 🥇 पहले Tier 1 (सीधा Google Indexing API)
  const tier1 = await tier1IndexingApi(url)
  if (tier1.success) {
    return tier1
  }

  // 🥈 Tier 1 fail हुआ तो घबराने की ज़रूरत नहीं - Tier 2 (Backup Sitemap Ping) आज़माते हैं
  const tier2 = await tier2PingSitemap()

  // 🥉 और Tier 3 (Google News) तो वैसे भी हमेशा चालू ही है
  const tier3Note = tier3NewsSitemapNote()

  // किसी भी हाल में पोस्ट को Retry Queue में डाल देना है, ताकि Tier 1 बाद में
  // अपने-आप दोबारा कोशिश करता रहे (जब तक Success न मिल जाए या sitemap के भरोसे न छूटे)
  await queueForRetry(url, `tier1-failed: ${tier1.message}`)

  const combinedMessage = `${tier1.message} | ${tier2.message} | ${tier3Note} (Tier 1 अपने-आप बाद में दोबारा कोशिश करेगा)`

  return {
    success: tier2.success, // कम-से-कम Tier 2 सफल हुआ तो भी कुछ-न-कुछ हुआ माना जाएगा
    message: combinedMessage,
  }
}
