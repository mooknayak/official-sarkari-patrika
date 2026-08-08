// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/sanity/structure.ts
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Official Sarkari Patrika')
    .items([
      // ⚙️ Singleton — इसका सिर्फ 1 ही Document रहेगा (Logo/Favicon/AdSense/News सेटिंग्स)
      S.listItem()
        .title('⚙️ Website Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Website Settings')
        ),
      S.divider(),
      S.listItem()
        .title('🟢 Live Job Notifications')
        .child(
          S.documentList()
            .title('Job Notifications')
            .filter('_type == "jobPost" && status == "job"')
        ),
      S.listItem()
        .title('🟡 Admit Cards')
        .child(
          S.documentList()
            .title('Admit Cards')
            .filter('_type == "jobPost" && status == "admit_card"')
        ),
      S.listItem()
        .title('🔵 Answer Keys')
        .child(
          S.documentList()
            .title('Answer Keys')
            .filter('_type == "jobPost" && status == "answer_key"')
        ),
      S.listItem()
        .title('🔴 Results')
        .child(
          S.documentList()
            .title('Results')
            .filter('_type == "jobPost" && status == "result"')
        ),
      S.listItem()
        .title('⚫ Final Selection / Merit List')
        .child(
          S.documentList()
            .title('Final Selection')
            .filter('_type == "jobPost" && status == "final_selection"')
        ),
      S.divider(),
      S.listItem()
        .title('📁 All Job Posts')
        .child(S.documentTypeList('jobPost').title('All Posts')),
      S.listItem()
        .title('🏷️ Categories')
        .child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('🏛️ Organizations')
        .child(S.documentTypeList('organization').title('Organizations')),
      S.divider(),
      S.listItem()
        .title('📧 Job Alert Subscribers (Email)')
        .child(S.documentTypeList('subscriber').title('Email Subscribers')),
      S.listItem()
        .title('🔔 Push Notification Subscribers')
        .child(S.documentTypeList('pushSubscriber').title('Push Subscribers')),
      S.divider(),
      S.listItem()
        .title('💬 Comments (जवाब यहीं से दें)')
        .child(
          S.documentTypeList('comment')
            .title('Comments')
            .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
        ),
      S.listItem()
        .title('🔁 Indexing Retry Queue')
        .child(S.documentTypeList('indexingQueueItem').title('Indexing Retry Queue')),
    ])
