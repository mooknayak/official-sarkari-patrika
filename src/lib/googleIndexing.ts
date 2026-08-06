import { JWT } from 'google-auth-library'

type IndexingResult = { success: boolean; message: string }

function loadCredentials(): { clientEmail?: string; privateKey?: string; source: string } {
  // प्राथमिकता: base64 वाला पूरा JSON (सबसे भरोसेमंद, corrupt नहीं होता)
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

  // Fallback: पुराने अलग-अलग env vars
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, '\n')
  return { clientEmail, privateKey, source: 'separate-vars' }
}

async function callGoogleIndexingApi(jwtClient: JWT, url: string) {
  return jwtClient.request({
    url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
    method: 'POST',
    data: { url, type: 'URL_UPDATED' },
  })
}

/**
 * Google को तुरंत बताता है कि कोई पेज नया/अपडेट हुआ है।
 * अस्थायी गलतियों (network/500) पर अपने-आप दोबारा कोशिश करता है।
 * Quota या permission जैसी स्थायी गलतियों पर तुरंत साफ़ जवाब देता है।
 */
export async function requestGoogleIndexing(url: string): Promise<IndexingResult> {
  const { clientEmail, privateKey, source } = loadCredentials()

  if (!clientEmail || !privateKey) {
    const msg = 'Google Indexing API सेट नहीं है (credentials खाली/अमान्य हैं) - स्किप किया'
    console.error('[GoogleIndexing]', msg)
    return { success: false, message: msg }
  }

  console.log(`[GoogleIndexing] शुरू (source: ${source}) - URL: ${url}`)

  const jwtClient = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })

  const maxAttempts = 3
  let lastError: any = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await callGoogleIndexingApi(jwtClient, url)
      console.log(`[GoogleIndexing] SUCCESS (attempt ${attempt}) - status: ${res.status}`)
      return { success: true, message: `Google को सूचित कर दिया गया (status: ${res.status})` }
    } catch (err: any) {
      lastError = err
      const status = err?.response?.status
      const code = err?.code

      if (status === 401 || status === 403 || code === 'ERR_OSSL_UNSUPPORTED') {
        console.error(`[GoogleIndexing] स्थायी त्रुटि (attempt ${attempt}), रुक रहे हैं:`, err.message)
        break
      }

      if (status === 429) {
        console.error('[GoogleIndexing] दैनिक Quota समाप्त हो गई है')
        return { success: false, message: 'Google Indexing की दैनिक सीमा (quota) पूरी हो चुकी है' }
      }

      console.warn(`[GoogleIndexing] अस्थायी त्रुटि (attempt ${attempt}/${maxAttempts}):`, err.message)
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, attempt * 500))
      }
    }
  }

  const errorMessage = lastError?.message || 'अज्ञात त्रुटि'
  console.error('[GoogleIndexing] सभी कोशिशें विफल:', errorMessage)
  return { success: false, message: `Google Indexing में समस्या: ${errorMessage}` }
}
