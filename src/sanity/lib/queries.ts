import { groq } from 'next-sanity'

// नोट: ऑर्डरिंग के लिए हर जगह Sanity के अपने-आप अपडेट होने वाले "_updatedAt"
// System फील्ड का इस्तेमाल किया गया है (मैनुअल "updatedAt" फील्ड की जगह) -
// यह हमेशा सही रहता है, भले ही Editor "Last Updated At" फील्ड भरना भूल जाए।

export const HOMEPAGE_LATEST_QUERY = groq`
*[_type == "jobPost" && !(seo.noIndex == true)] | order(_updatedAt desc) [0...20] {
  _id,
  title,
  "slug": slug.current,
  status,
  isNew,
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
| order(_updatedAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  status,
  isNew,
  "category": category->slug.current,
  "organization": organization->name,
  updatedAt,
  importantDates
}
`

// ---- Status के आधार पर Listing - यही Dynamic Box Architecture का मुख्य हिस्सा है ----
// एक पोस्ट सिर्फ अपने CURRENT status के हिसाब से बॉक्स/लिस्टिंग में दिखती है,
// चाहे उसकी मूल (permanent) category/URL कुछ भी हो।
// ज़रूरी: सिर्फ उन्हीं पोस्ट को गिनते हैं जिनकी category असल में "job lifecycle" वाली हो
// (jobs/admit-card/result/answer-key) - ताकि Documents या सरकारी योजनाएं जैसी
// evergreen category की पोस्ट, सिर्फ status=job होने की वजह से गलती से Jobs बॉक्स में न दिखें।
export const STATUS_LISTING_QUERY = groq`
*[_type == "jobPost" && status in $statusList
  && category->slug.current in ["jobs", "admit-card", "result", "answer-key"]
  && !(seo.noIndex == true)]
| order(_updatedAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  status,
  isNew,
  "category": category->slug.current,
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
  categoryWiseVacancy,
  applicationFee,
  admitCardInfo,
  resultInfo,
  importantLinks,
  description,
  customSectionsBeforeLinks,
  customSectionsAfterLinks,
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
*[_type == "jobPost" && defined(category->slug.current) && defined(slug.current)] {
  "slug": slug.current,
  "category": category->slug.current
}
`

export const RELATED_POSTS_QUERY = groq`
*[_type == "jobPost" && category->slug.current == $categorySlug && slug.current != $currentSlug]
| order(_updatedAt desc) [0...6] {
  title,
  "slug": slug.current,
  status,
  "category": category->slug.current
}
`

export const SEARCH_QUERY = groq`
*[_type == "jobPost" && title match $searchTerm + "*"] | order(_updatedAt desc) [0...20] {
  title,
  "slug": slug.current,
  status,
  "category": category->slug.current
}
`

// ---- Organization-wise पेज के लिए ----
export const ORGANIZATION_INFO_QUERY = groq`
*[_type == "organization" && slug.current == $orgSlug][0] {
  name,
  about,
  website,
  "logoUrl": logo.asset->url
}
`

export const ORGANIZATION_POSTS_QUERY = groq`
*[_type == "jobPost" && organization->slug.current == $orgSlug && !(seo.noIndex == true)]
| order(_updatedAt desc) [0...100] {
  _id,
  title,
  "slug": slug.current,
  status,
  isNew,
  "category": category->slug.current,
  updatedAt
}
`

export const ALL_ORGANIZATIONS_QUERY = groq`
*[_type == "organization"] | order(name asc) {
  name,
  "slug": slug.current,
  "postCount": count(*[_type == "jobPost" && references(^._id)])
}
`
