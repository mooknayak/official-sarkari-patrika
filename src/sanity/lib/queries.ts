import { groq } from 'next-sanity'

export const HOMEPAGE_LATEST_QUERY = groq`
*[_type == "jobPost" && !(seo.noIndex == true)] | order(updatedAt desc) [0...20] {
  _id,
  title,
  "slug": slug.current,
  status,
  "category": category->slug.current,
  "categoryTitle": category->title,
  "organization": organization->name,
  updatedAt,
  publishedAt,
  importantDates
}
`

export const CATEGORY_LISTING_QUERY = groq`
*[_type == "jobPost" && category->slug.current == $categorySlug && !(seo.noIndex == true)]
| order(updatedAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  status,
  "organization": organization->name,
  updatedAt,
  importantDates
}
`

export const CATEGORY_INFO_QUERY = groq`
*[_type == "category" && slug.current == $categorySlug][0] {
  title,
  description
}
`

export const SINGLE_POST_QUERY = groq`
*[_type == "jobPost" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  status,
  statusTimeline[] | order(date desc) {
    status,
    date,
    note
  },
  importantDates,
  vacancyDetails,
  applicationFee,
  admitCardInfo,
  resultInfo,
  importantLinks,
  description,
  seo,
  publishedAt,
  updatedAt,
  "organization": organization-> {
    name,
    website,
    "logoUrl": logo.asset->url
  },
  "category": category-> {
    title,
    "slug": slug.current
  }
}
`

export const ALL_SLUGS_QUERY = groq`
*[_type == "jobPost"] {
  "slug": slug.current,
  "category": category->slug.current
}
`

export const RELATED_POSTS_QUERY = groq`
*[_type == "jobPost" && category->slug.current == $categorySlug && slug.current != $currentSlug]
| order(updatedAt desc) [0...6] {
  title,
  "slug": slug.current,
  status,
  "category": category->slug.current
}
`

export const SEARCH_QUERY = groq`
*[_type == "jobPost" && title match $searchTerm + "*"] | order(updatedAt desc) [0...20] {
  title,
  "slug": slug.current,
  status,
  "category": category->slug.current
}
`
