import { defineField, defineType, defineArrayMember } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const jobPost = defineType({
  name: 'jobPost',
  title: 'Job Post',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'general', title: 'General Info' },
    { name: 'status', title: 'Status & Dates', default: true },
    { name: 'details', title: 'Post Details' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required().max(150),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'general',
      options: {
        source: 'title',
        maxLength: 100,
        isUnique: async (slugValue, context) => {
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-01-01' })
          const id = document?._id.replace(/^drafts\./, '') || ''
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug: slugValue,
          }
          const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug][0]._id)`
          const result = await client.fetch(query, params)
          return result
        },
      },
      validation: (Rule) => Rule.required(),
      description:
        'एक बार सेट होने के बाद इसे कभी न बदलें - यही Dynamic Update का आधार है। अगर यह किसी दूसरी पोस्ट में पहले से इस्तेमाल हो चुका है, तो Studio अपने-आप Error दिखाकर रोक देगा।',
    }),

    defineField({
      name: 'sourceUrl',
      title: '🔗 Source / Official Notification Link',
      type: 'url',
      group: 'general',
      description: 'पोस्ट लिखते समय रेफरेंस के लिए ऑफिशियल नोटिफिकेशन का लिंक यहाँ पेस्ट करें - यह सिर्फ आपकी (Editor की) मदद के लिए है, पब्लिक साइट पर नहीं दिखता। Important Links सेक्शन में डालकर ही यह यूज़र को दिखेगा।',
    }),

    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'reference',
      to: [{ type: 'organization' }],
      group: 'general',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'general',
    }),

    defineField({
      name: 'status',
      title: 'Current Status',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: '🟢 Notification / Job Opening', value: 'job' },
          { title: '🟡 Admit Card Released', value: 'admit_card' },
          { title: '🔵 Answer Key Released', value: 'answer_key' },
          { title: '🔴 Result Declared', value: 'result' },
          { title: '⚫ Final Selection / Merit List', value: 'final_selection' },
        ],
        layout: 'radio',
      },
      initialValue: 'job',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'isNew',
      title: '✨ Mark as NEW (चमकता हुआ टैग)',
      type: 'boolean',
      group: 'status',
      initialValue: false,
      description: 'इसे ON करने पर पोस्ट पर लाल रंग का चमकता हुआ "NEW" टैग दिखेगा। कुछ दिनों बाद वापस OFF कर दें।',
    }),

    defineField({
      name: 'isTrending',
      title: '🔥 Trending Box में दिखाएँ (होमपेज के रंगीन बॉक्स)',
      type: 'boolean',
      group: 'status',
      initialValue: false,
      description:
        'इसे ON करने पर यह पोस्ट होमपेज के ऊपर 6 रंगीन Trending बॉक्स में से एक में दिखेगी - ज़्यादा-से-ज़्यादा 6 पोस्ट एक साथ ON रखें, बाकी अपने-आप नहीं दिखेंगी।',
    }),

    defineField({
      name: 'helpfulCount',
      title: '👍 Helpful Votes',
      type: 'number',
      group: 'status',
      initialValue: 0,
      readOnly: true,
      description: 'यह अपने-आप वेबसाइट पर यूज़र के फीडबैक से भरता है, इसे मैनुअली न बदलें।',
    }),

    defineField({
      name: 'notHelpfulCount',
      title: '👎 Not Helpful Votes',
      type: 'number',
      group: 'status',
      initialValue: 0,
      readOnly: true,
      description: 'यह अपने-आप वेबसाइट पर यूज़र के फीडबैक से भरता है, इसे मैनुअली न बदलें।',
    }),

    defineField({
      name: 'statusTimeline',
      title: 'Status Update Timeline',
      type: 'array',
      group: 'status',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'status', type: 'string', title: 'Status' },
            { name: 'date', type: 'datetime', title: 'Updated On' },
            { name: 'note', type: 'string', title: 'Short Note (वैकल्पिक)' },
          ],
          preview: {
            select: { title: 'status', subtitle: 'date' },
          },
        }),
      ],
      description: 'उदाहरण: "12 Jan 2026 - Job Notification जारी", "15 Mar 2026 - Admit Card जारी"',
    }),

    defineField({
      name: 'importantDates',
      title: 'Important Dates',
      type: 'object',
      group: 'status',
      fields: [
        { name: 'applicationStart', type: 'date', title: 'Application Start' },
        { name: 'applicationEnd', type: 'date', title: 'Application Last Date' },
        { name: 'admitCardDate', type: 'date', title: 'Admit Card Release Date' },
        { name: 'examDate', type: 'date', title: 'Exam Date' },
        { name: 'resultDate', type: 'date', title: 'Result Date' },
      ],
    }),

    defineField({
      name: 'importantLinks',
      title: 'Important Links',
      type: 'array',
      group: 'details',
      description: '📌 Full Description के नीचे यह लिंक वेबसाइट पर एक साफ़-सुथरे बॉक्स में दिखेंगे - Documents/योजना के लिए Official Website, PDF, Apply Link यहीं जोड़ें।',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Link Label' },
            { name: 'url', type: 'url', title: 'URL' },
            {
              name: 'linkType',
              type: 'string',
              options: {
                list: [
                  'Apply Online',
                  'Download Admit Card',
                  'Check Result',
                  'Official Notification',
                  'Official Website',
                ],
              },
            },
          ],
        }),
      ],
    }),

    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      group: 'details',
      description: '📌 Documents/सरकारी योजनाएं पोस्ट के लिए मुख्य जगह यही है - यहाँ bullet points, headings और Highlight (🖍️) इस्तेमाल करके पूरी जानकारी लिखें। Job Post के लिए यह अतिरिक्त जानकारी के तौर पर इस्तेमाल करें।',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Highlight', value: 'highlight', icon: () => '🖍️' },
            ],
          },
        },
      ],
    }),

    defineField({
      name: 'customSectionsBeforeLinks',
      title: '➕ कस्टम सेक्शन (Important Links से ऊपर)',
      type: 'array',
      group: 'details',
      description: '📌 जितने चाहें उतने Title+Description वाले बॉक्स जोड़ें ("+ Add item" दबाकर) - यह सब Important Links से ऊपर दिखेंगे। हर बॉक्स में Bold/Bullet/Highlight जैसी formatting इस्तेमाल कर सकते हैं।',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'heading', type: 'string', title: 'Section का Title' },
            {
              name: 'content',
              type: 'array',
              title: 'Content (Bullet/Bold/Highlight सब चलेगा)',
              of: [
                {
                  type: 'block',
                  marks: {
                    decorators: [
                      { title: 'Bold', value: 'strong' },
                      { title: 'Italic', value: 'em' },
                      { title: 'Highlight', value: 'highlight', icon: () => '🖍️' },
                    ],
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'heading' },
          },
        }),
      ],
    }),

    defineField({
      name: 'customSectionsAfterLinks',
      title: '➕ कस्टम सेक्शन (Important Links से नीचे)',
      type: 'array',
      group: 'details',
      description: '📌 जितने चाहें उतने Title+Description वाले बॉक्स जोड़ें ("+ Add item" दबाकर) - यह सब Important Links के नीचे, Full Description के पहले दिखेंगे।',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'heading', type: 'string', title: 'Section का Title' },
            {
              name: 'content',
              type: 'array',
              title: 'Content (Bullet/Bold/Highlight सब चलेगा)',
              of: [
                {
                  type: 'block',
                  marks: {
                    decorators: [
                      { title: 'Bold', value: 'strong' },
                      { title: 'Italic', value: 'em' },
                      { title: 'Highlight', value: 'highlight', icon: () => '🖍️' },
                    ],
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'heading' },
          },
        }),
      ],
    }),

    defineField({
      name: 'vacancyDetails',
      title: 'Vacancy Details',
      type: 'array',
      group: 'details',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'postName', type: 'string', title: 'Post Name' },
            { name: 'totalPosts', type: 'number', title: 'Total Vacancies' },
            { name: 'eligibility', type: 'text', title: 'Eligibility' },
          ],
        }),
      ],
      hidden: ({ document }) => document?.status === 'result',
      description: '⚠️ सिर्फ Job Post के लिए। Documents/सरकारी योजनाएं पोस्ट में इसे खाली छोड़ दें।',
    }),

    defineField({
      name: 'categoryWiseVacancy',
      title: 'Category-wise Vacancy (आरक्षण अनुसार)',
      type: 'object',
      group: 'details',
      description: 'मार्कशीट जैसी टेबल के लिए - UR/EWS/OBC/SC/ST के हिसाब से पदों की संख्या',
      fields: [
        { name: 'ur', type: 'number', title: 'UR (General)' },
        { name: 'ews', type: 'number', title: 'EWS' },
        { name: 'obc', type: 'number', title: 'OBC / BC' },
        { name: 'sc', type: 'number', title: 'SC' },
        { name: 'st', type: 'number', title: 'ST' },
        { name: 'total', type: 'number', title: 'Total' },
      ],
      hidden: ({ document }) => document?.status === 'result',
    }),

    defineField({
      name: 'applicationFee',
      title: 'Application Fee',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'general', type: 'string', title: 'General/OBC' },
        { name: 'scst', type: 'string', title: 'SC/ST/PH' },
        { name: 'paymentMode', type: 'string', title: 'Payment Mode' },
      ],
      hidden: ({ document }) => document?.status !== 'job',
    }),

    defineField({
      name: 'admitCardInfo',
      title: 'Admit Card Info',
      type: 'text',
      group: 'details',
      hidden: ({ document }) => document?.status !== 'admit_card',
      description: 'डाउनलोड प्रक्रिया, आवश्यक दस्तावेज़ आदि (कोई संवेदनशील डेटा नहीं)',
    }),

    defineField({
      name: 'resultInfo',
      title: 'Result Info',
      type: 'text',
      group: 'details',
      hidden: ({ document }) =>
        document?.status !== 'result' && document?.status !== 'final_selection',
      description: 'कट-ऑफ, अगला चरण आदि। कभी भी उम्मीदवारों का व्यक्तिगत डेटा न डालें।',
    }),

    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        { name: 'metaTitle', type: 'string', title: 'Meta Title', validation: (Rule) => Rule.max(60) },
        { name: 'metaDescription', type: 'text', title: 'Meta Description', validation: (Rule) => Rule.max(160) },
        { name: 'noIndex', type: 'boolean', title: 'No-Index (expired posts के लिए)' },
      ],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Originally Published At',
      type: 'datetime',
      group: 'general',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'updatedAt',
      title: 'Last Updated At',
      type: 'datetime',
      group: 'general',
      description: 'हर बार status बदलने पर इसे मैन्युअली अपडेट करें - Schema.org dateModified के लिए ज़रूरी',
    }),
  ],

  preview: {
    select: { title: 'title', status: 'status', media: 'organization.logo' },
    prepare({ title, status }) {
      const statusLabels: Record<string, string> = {
        job: '🟢 Job',
        admit_card: '🟡 Admit Card',
        answer_key: '🔵 Answer Key',
        result: '🔴 Result',
        final_selection: '⚫ Final Selection',
      }
      return { title, subtitle: statusLabels[status] || status }
    },
  },
})
