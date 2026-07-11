import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // production में CDN cache इस्तेमाल हो (तेज़ी के लिए)
})
