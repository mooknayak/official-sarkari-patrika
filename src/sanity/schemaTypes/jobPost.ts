// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/sanity/schemaTypes/jobPost.ts
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
    { name: 'media', title: '🖼️ Post Photo (Google News)' },
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
      description:
        'हर तारीख के लिए या तो सही Date चुनें, या नीचे वाले "Note" वाले Text Field में कुछ लिख दें (जैसे "जल्द जारी होगी", "नियमानुसार", "संभावित तिथि जल्द बताई जाएगी") - Note भरा होगा तो वही Highlight होकर दिखेगा, Date की जगह।',
      fields: [
        { name: 'applicationStart', type: 'date', title: 'Application Start' },
        {
          name: 'applicationStartNote',
          type: 'string',
          title: '✏️ Application Start - Note (अगर Date पक्की नहीं है)',
          description: 'उदाहरण: "जल्द जारी होगी" / "नियमानुसार" / "संभावित तिथि जल्द बताई जाएगी"',
        },
        { name: 'applicationEnd', type: 'date', title: 'Application Last Date' },
        {
          name: 'applicationEndNote',
          type: 'string',
          title: '✏️ Application Last Date - Note (अगर Date पक्की नहीं है)',
          description: 'उदाहरण: "जल्द जारी होगी" / "नियमानुसार" / "संभावित तिथि जल्द बताई जाएगी"',
        },
        { name: 'admitCardDate', type: 'date', title: 'Admit Card Release Date' },
        {
          name: 'admitCardDateNote',
          type: 'string',
          title: '✏️ Admit Card Date - Note (अगर Date पक्की नहीं है)',
          description: 'उदाहरण: "जल्द जारी होगी" / "नियमानुसार" / "संभावित तिथि जल्द बताई जाएगी"',
        },
        { name: 'examDate', type: 'date', title: 'Exam Date' },
        {
          name: 'examDateNote',
          type: 'string',
          title: '✏️ Exam Date - Note (अगर Date पक्की नहीं है)',
          description: 'उदाहरण: "जल्द जारी होगी" / "नियमानुसार" / "संभावित तिथि जल्द बताई जाएगी"',
        },
        { name: 'resultDate', type: 'date', title: 'Result Date' },
        {
          name: 'resultDateNote',
          type: 'string',
          title: '✏️ Result Date - Note (अगर Date पक्की नहीं है)',
          description: 'उदाहरण: "जल्द जारी होगी" / "नियमानुसार" / "संभावित तिथि जल्द बताई जाएगी"',
        },
        // 🆕 अगर ऊपर के 5 के अलावा भी कोई और तारीख बतानी हो (जैसे "Interview Date",
        // "Document Verification"), तो यहाँ अपनी मर्ज़ी से 1-2 (या ज़्यादा) Custom
        // Entry जोड़ सकते हैं - हर एक में भी Date या Note (टेक्स्ट), दोनों में से कोई एक चुन सकते हैं।
        {
          name: 'extraDates',
          type: 'array',
          title: '➕ कोई और Custom तारीख जोड़ें (वैकल्पिक)',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'तारीख का नाम', description: 'उदाहरण: "Interview Date", "Document Verification"' },
                { name: 'date', type: 'date', title: 'Date (अगर पक्की है)' },
                {
                  name: 'note',
                  type: 'string',
                  title: 'Note (अगर Date पक्की नहीं है)',
                  description: 'उदाहरण: "जल्द जारी होगी" / "नियमानुसार" / "संभावित तिथि जल्द बताई जाएगी"',
                },
              ],
              preview: { select: { title: 'label', subtitle: 'date' } },
            },
          ],
        },
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

    // 🆕 Google Jobs (और Search Result) में सही तरीके से दिखने के लिए यह 2 फ़ील्ड
    // बहुत ज़रूरी मानी जाती हैं - बिना Location के कई बार Job Listing Google Jobs
    // में दिखती ही नहीं, और Salary भरने से Listing ज़्यादा भरोसेमंद लगती है।
    defineField({
      name: 'jobLocation',
      title: '🌍 Job Location (Google Jobs के लिए ज़रूरी)',
      type: 'string',
      group: 'details',
      description:
        'उदाहरण: "All India / पूरे भारत में", "Uttar Pradesh", "Delhi", "Bihar" - जहाँ यह भर्ती/पद लागू होता है',
      hidden: ({ document }) => document?.status !== 'job',
    }),
    defineField({
      name: 'salary',
      title: '💰 Salary / Pay Scale (Google Jobs के लिए अनुशंसित)',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'minAmount', type: 'number', title: 'न्यूनतम राशि (₹ प्रति माह)' },
        { name: 'maxAmount', type: 'number', title: 'अधिकतम राशि (₹ प्रति माह)' },
        {
          name: 'payScaleText',
          type: 'string',
          title: 'Pay Scale (दिखाने के लिए टेक्स्ट)',
          description: 'उदाहरण: "Pay Level 4 (₹25,500 - ₹81,100)" - यह पेज पर वैसे ही दिखेगा',
        },
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
      name: 'featuredImage',
      title: '🖼️ इस Post की मुख्य फ़ोटो',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text (फ़ोटो में क्या है, संक्षेप में लिखें)',
          validation: (Rule) => Rule.max(125),
        },
      ],
      description:
        '⚠️ यह वेबसाइट के Logo से बिल्कुल अलग है (Logo सिर्फ Website Settings में एक बार डलता है) — यहाँ इसी पोस्ट से जुड़ी असली फ़ोटो/बैनर अपलोड करें। Google News, Google Discover, WhatsApp/Facebook Share Preview और Rich Result — इन सबमें यही फ़ोटो दिखेगी। कम-से-कम 1200×675px (16:9), साफ़ और बिना ज़्यादा टेक्स्ट वाली फ़ोटो सबसे अच्छा रिज़ल्ट देती है।',
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
    select: { title: 'title', status: 'status', media: 'featuredImage', orgLogo: 'organization.logo' },
    prepare({ title, status, media, orgLogo }) {
      const statusLabels: Record<string, string> = {
        job: '🟢 Job',
        admit_card: '🟡 Admit Card',
        answer_key: '🔵 Answer Key',
        result: '🔴 Result',
        final_selection: '⚫ Final Selection',
      }
      return { title, subtitle: statusLabels[status] || status, media: media || orgLogo }
    },
  },
})
