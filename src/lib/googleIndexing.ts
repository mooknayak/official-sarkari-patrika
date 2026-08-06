import { JWT } from 'google-auth-library'

/**
 * Google Indexing API का इस्तेमाल करके Google को तुरंत बताता है
 * कि कोई पेज नया बना है या अपडेट हुआ है, ताकि सामान्य crawl का इंतज़ार न करना पड़े।
 *
 * ज़रूरी: यह सिर्फ तभी काम करेगा जब GOOGLE_INDEXING_CLIENT_EMAIL और
 * GOOGLE_INDEXING_PRIVATE_KEY environment variables सेट हों। अगर सेट नहीं हैं,
 * तो यह चुपचाप स्किप हो जाएगा - वेबसाइट पर कोई असर नहीं पड़ेगा।
 */
export async function requestGoogleIndexing(url: string): Promise<{ success: boolean; message: string }> {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, '\n')

  console.log('[GoogleIndexing] शुरू - URL:', url)
  console.log('[GoogleIndexing] clientEmail मौजूद है?', !!clientEmail)
  console.log('[GoogleIndexing] privateKey मौजूद है?', !!privateKey, '| लंबाई:', privateKey?.length || 0)
  console.log('[GoogleIndexing] privateKey शुरुआत:', privateKey?.slice(0, 30))

  if (!clientEmail || !privateKey) {
    console.error('[GoogleIndexing] SKIP - env vars खाली हैं')
    return { success: false, message: 'Google Indexing API अभी सेट नहीं है (env vars खाली हैं) - स्किप किया' }
  }

  try {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    })

    console.log('[GoogleIndexing] JWT client बना, अब Google को call कर रहे हैं...')

    const res = await jwtClient.request({
      url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
      method: 'POST',
      data: {
        url,
        type: 'URL_UPDATED',
      },
    })

    console.log('[GoogleIndexing] SUCCESS - status:', res.status)
    return { success: true, message: `Google को सूचित कर दिया गया: ${url} (status: ${res.status})` }
  } catch (err) {
    console.error('[GoogleIndexing] ERROR:', (err as Error).message)
    console.error('[GoogleIndexing] पूरा error:', JSON.stringify(err, null, 2).slice(0, 1000))
    return { success: false, message: `Google Indexing में समस्या: ${(err as Error).message}` }
  }
}
