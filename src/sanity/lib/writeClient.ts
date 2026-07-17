import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// यह client सिर्फ Server-side API routes में इस्तेमाल होता है (कभी भी browser
// को नहीं भेजा जाता) क्योंकि इसमें write-permission वाला token होता है।
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
