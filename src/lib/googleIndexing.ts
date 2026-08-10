import { SignJWT, importPKCS8 } from 'jose'

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
  const rawKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY
  const privateKey = rawKey?.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey
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
    .setSubject(clientEmail)
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

export async function requestGoogleIndexing(url: string): Promise<IndexingResult> {
  const { clientEmail, privateKey, source } = loadCredentials()

  if (!clientEmail || !privateKey) {
    const msg = 'Google Indexing API सेट नहीं है (credentials खाली/अमान्य हैं) - स्किप किया'
    console.error('[GoogleIndexing]', msg)
    return { success: false, message: msg }
  }

  console.log(`[GoogleIndexing] शुरू (source: ${source}) - URL: ${url}`)

  const maxAttempts = 3
  let lastError: any = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const accessToken = await getAccessToken(clientEmail, privateKey)
      const res = await callIndexingApi(accessToken, url)

      if (res.status === 429) {
        console.error('[GoogleIndexing] दैनिक Quota समाप्त हो गई है')
        return { success: false, message: 'Google Indexing की दैनिक सीमा (quota) पूरी हो चुकी है' }
      }

      if (res.status === 401 || res.status === 403) {
        const errText = await res.text()
        console.error(`[GoogleIndexing] स्थायी त्रुटि (${res.status}):`, errText.slice(0, 300))
        return { success: false, message: `Permission त्रुटि (${res.status}) - Search Console में service account का access जाँचें` }
      }

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`)
      }

      console.log(`[GoogleIndexing] SUCCESS (attempt ${attempt}) - status: ${res.status}`)
      return { success: true, message: `Google को सूचित कर दिया गया (status: ${res.status})` }
    } catch (err: any) {
      lastError = err
      console.warn(`[GoogleIndexing] अस्थायी त्रुटि (attempt ${attempt}/${maxAttempts}):`, err.message)
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, attempt * 500))
    }
  }

  const errorMessage = lastError?.message || 'अज्ञात त्रुटि'
  console.error('[GoogleIndexing] सभी कोशिशें विफल:', errorMessage)
  return { success: false, message: `Google Indexing में समस्या: ${errorMessage}` }
}
