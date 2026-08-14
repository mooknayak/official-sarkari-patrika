// 🆕 नई फ़ाइल — इसे इसी पाथ पर बनाएं: src/sanity/schemaTypes/siteSettings.ts
// (यह फ़ाइल पहले गलती से डिलीट हो गई थी, अब वापस बनाई गई है)

import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

// ⚙️ यह एक "Singleton" है — पूरी साइट में इसका सिर्फ 1 ही Document रहेगा।
// यहीं से Logo, Favicon, Organization की फ़ोटो, AdSense/Google News/Search Console
// से जुड़ी सारी सेटिंग्स कण्ट्रोल होंगी — Studio Structure (structure.ts) में
// इसे अलग "⚙️ Website Settings" ग्रुप के तौर पर पिन किया गया है।
export const siteSettings = defineType({
  name: 'siteSettings',
  title: '⚙️ Website Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'branding', title: '🖼️ Logo / Favicon / Photos', default: true },
    { name: 'seo', title: '🔍 SEO / Search Console' },
    { name: 'ads', title: '💰 AdSense' },
    { name: 'news', title: '📰 Google News / Discover' },
    { name: 'social', title: '🔗 Social Links' },
    { name: 'footer', title: '📄 Footer Links (Privacy, Terms, About वगैरह)' },
    { name: 'engagement', title: '📌 Post के नीचे Banner / Discover More' },
  ],
  fields: [
    // ---------- Branding / Photos ----------
    defineField({
      name: 'siteLogo',
      title: 'Site Logo (Header, Favicon और Publisher Schema के लिए)',
      type: 'image',
      group: 'branding',
      options: { hotspot: true },
      description:
        'चौड़ा (rectangular) logo अपलोड करें — जैसे 600×140px। यह Header में, Google Search के Publisher Logo में और (अगर अलग Favicon न डालें तो) Favicon के तौर पर भी इस्तेमाल होगा। ⚠️ यह पोस्ट की फ़ोटो से बिल्कुल अलग चीज़ है — हर पोस्ट की अपनी फ़ोटो अलग जगह (उसी पोस्ट के अंदर "🖼️ Post की मुख्य फ़ोटो" सेक्शन में) अपलोड होती है।',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon (Browser Tab व Google Search Result Icon)',
      type: 'image',
      group: 'branding',
      description:
        'Square इमेज (कम-से-कम 512×512px, बैकग्राउंड साफ़/ठोस रंग का) — Search Result में साइट के नाम के बगल में और Browser के Tab में यही दिखता है। अगर यहाँ कुछ अपलोड नहीं करेंगे, तो ऊपर वाला Site Logo अपने-आप Favicon के तौर पर भी इस्तेमाल हो जाएगा।',
    }),
    defineField({
      name: 'siteGalleryImages',
      title: '📸 Organization / Site Photos',
      type: 'array',
      group: 'branding',
      description:
        'साइट से जुड़े संगठन, ऑफिस या प्रतिनिधि फ़ोटो यहाँ अपलोड करें (जितने चाहें उतने) — Google को साइट की प्रामाणिकता (E-E-A-T) दिखाने में मदद करता है, AdSense व Google News Approval दोनों के लिए उपयोगी।',
      of: [defineArrayMemberImage()],
    }),
    defineField({
      name: 'publisherName',
      title: 'Publisher / Organization Name',
      type: 'string',
      group: 'branding',
      initialValue: 'Official Sarkari Patrika',
      description: 'Schema.org Organization व NewsArticle publisher में यही नाम भेजा जाएगा।',
    }),

    // ---------- SEO / Search Console ----------
    defineField({
      name: 'googleSiteVerification',
      title: 'Google Search Console Verification Code',
      type: 'string',
      group: 'seo',
      description:
        'search.google.com/search-console → Settings → Ownership Verification → HTML Tag से सिर्फ content="..." वाला कोड यहाँ पेस्ट करें (सिर्फ कोड, पूरा HTML टैग नहीं)। Sitelinks Search Box व Search Console की सारी सुविधाएँ इसी से Verify होंगी — यह सीधे वेबसाइट के <head> में अपने-आप जुड़ जाएगा, कोई अलग file अपलोड करने की ज़रूरत नहीं।',
    }),
    defineField({
      name: 'bingSiteVerification',
      title: 'Bing Webmaster Verification Code',
      type: 'string',
      group: 'seo',
      description: 'bing.com/webmasters से content="..." वाला कोड (सिर्फ कोड) यहाँ पेस्ट करें।',
    }),

    // ---------- AdSense ----------
    defineField({
      name: 'adsensePublisherId',
      title: 'AdSense Publisher ID (ca-pub-xxxxxxxxxxxxxxxx)',
      type: 'string',
      group: 'ads',
      description:
        'AdSense अप्रूवल के बाद यहाँ डालें (Vercel के Environment Variable NEXT_PUBLIC_ADSENSE_CLIENT_ID से भी सेट हो सकता है — दोनों जगह डालने की ज़रूरत नहीं, कोई एक काफ़ी है; यहाँ डाला हुआ हमेशा प्राथमिकता में रहेगा)।',
    }),

    // ---------- News / Discover ----------
    defineField({
      name: 'googleNewsPublicationName',
      title: 'Google News Publication Name',
      type: 'string',
      group: 'news',
      description:
        'Google News Publisher Center में जो नाम रजिस्टर करें, वही यहाँ भी डालें — दोनों जगह एक जैसा नाम होना अनिवार्य है।',
      initialValue: 'Official Sarkari Patrika',
    }),
    defineField({
      name: 'enableNewsSitemap',
      title: 'News Sitemap Enable करें',
      type: 'boolean',
      group: 'news',
      initialValue: true,
      description:
        '/news-sitemap.xml पर पिछले 48 घंटों की पोस्ट (उनकी फ़ोटो सहित) अपने-आप शामिल होंगी — Google News व Discover के लिए ज़रूरी। हर पोस्ट में फ़ोटो डालना न भूलें, तभी Google News में फ़ोटो के साथ पोस्ट दिखेगी।',
    }),

    // ---------- Social ----------
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook Page URL' },
        { name: 'twitter', type: 'url', title: 'Twitter / X URL' },
        { name: 'youtube', type: 'url', title: 'YouTube Channel URL' },
        { name: 'telegram', type: 'url', title: 'Telegram Channel URL' },
        { name: 'instagram', type: 'url', title: 'Instagram URL' },
      ],
      description:
        'यह सब Organization Schema के "sameAs" में जाएँगे — Google को साइट की पहचान (Knowledge Panel) बनाने में मदद करता है।',
    }),

    // ---------- 🆕 Footer के सारे Links (Privacy, Terms, About, Contact वगैरह) ----------
    defineField({
      name: 'footerLinks',
      title: '📄 Footer में दिखने वाले सभी Links',
      type: 'array',
      group: 'footer',
      description:
        'Website के सबसे नीचे (Footer) में जो भी Links दिखते हैं (Privacy Policy, Terms, Disclaimer, About Us, Contact Us वगैरह) - सब यहीं से Add/Edit/Delete/Reorder कर सकते हैं। कोई दिक्कत हो तो यहीं से ठीक करके Publish कर दें, कोई Code बदलने की ज़रूरत नहीं। क्रम वैसा ही रहेगा जैसा नीचे लिस्ट में है (ऊपर-नीचे खींचकर क्रम बदल सकते हैं)।',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Link का नाम (जो दिखेगा)', validation: (Rule: any) => Rule.required() },
            {
              name: 'href',
              type: 'string',
              title: 'Link कहाँ जाए',
              description: 'साइट के अंदर के पेज के लिए: /privacy-policy जैसा लिखें। बाहर के लिंक के लिए पूरा URL लिखें: https://...',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: { select: { title: 'title', subtitle: 'href' } },
        },
      ],
      initialValue: [
        { title: 'Privacy Policy', href: '/privacy-policy' },
        { title: 'Terms & Conditions', href: '/terms-and-conditions' },
        { title: 'Disclaimer', href: '/disclaimer' },
        { title: 'About Us', href: '/about-us' },
        { title: 'Contact Us', href: '/contact-us' },
      ],
    }),

    // ---------- 🆕 Post के नीचे Banner (वैकल्पिक) ----------
    defineField({
      name: 'postBottomBanner',
      title: '🖼️ हर Post के नीचे दिखने वाला Banner (वैकल्पिक)',
      type: 'object',
      group: 'engagement',
      description:
        'जब चाहें तब यहाँ कोई भी Banner/Logo/Ad Photo अपलोड कर दें - जैसे AdSense अप्रूवल के बाद कोई Ad Banner, या किसी की Sponsorship/प्रचार की फ़ोटो। खाली रहने पर पेज पर कुछ नहीं दिखेगा, कोई नुकसान नहीं - जब मन करे तभी लगाएँ या हटाएँ।',
      fields: [
        {
          name: 'image',
          type: 'image',
          title: 'Banner Photo',
          options: { hotspot: true },
        },
        {
          name: 'link',
          type: 'url',
          title: 'Banner पर Click होने पर कहाँ जाए (वैकल्पिक)',
          description: 'खाली छोड़ने पर Banner सिर्फ़ दिखेगा, Click करने योग्य नहीं होगा।',
        },
        {
          name: 'altText',
          type: 'string',
          title: 'Alt Text (फ़ोटो में क्या है, संक्षेप में)',
        },
      ],
    }),

    // ---------- 🆕 Discover More (हर Post में, आपकी अपनी लिखी Guidelines) ----------
    defineField({
      name: 'discoverMorePanels',
      title: '🔎 Discover More Section (हर Post के नीचे दिखेगा)',
      type: 'array',
      group: 'engagement',
      description:
        'यहाँ अपनी मर्ज़ी से Title + Content के Panel जोड़ें (जितने चाहें उतने) - यह हर Post के नीचे "Discover More" के नाम से दिखेंगे। खाली छोड़ने पर पहले जैसा Default Content दिख जाएगा, कोई नुकसान नहीं।',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Panel Title', validation: (Rule: any) => Rule.required() },
            { name: 'content', type: 'text', title: 'Panel Content (Guidelines)', validation: (Rule: any) => Rule.required() },
          ],
          preview: { select: { title: 'title', subtitle: 'content' } },
        },
      ],
    }),

    // 🆕 Team / Masthead (Founder, Editorial, Legal)
    defineField({
      name: 'teamMembers',
      title: '👥 हमारी टीम (Founder, Editorial, Legal वगैरह)',
      type: 'array',
      group: 'engagement',
      description:
        '⚠️ पुराना Field है, अब इसकी जगह नीचे "⚖️ Legal Panel" (Organization Chart) इस्तेमाल करें। यह सिर्फ़ पुराने Data के लिए रखा गया है।',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'नाम', validation: (Rule: any) => Rule.required() },
            {
              name: 'role',
              type: 'string',
              title: 'पद (Role)',
              description: 'उदाहरण: Founder & Editor-in-Chief, Legal Advisor, Content Editor',
              validation: (Rule: any) => Rule.required(),
            },
            { name: 'photo', type: 'image', title: 'फ़ोटो (वैकल्पिक)', options: { hotspot: true } },
            { name: 'bio', type: 'text', title: 'संक्षिप्त परिचय (वैकल्पिक)' },
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
        },
      ],
    }),

    // 🆕 Legal Panel - Court/Judiciary जैसा Organization Chart (Vanshavali Style)
    // Founder सबसे ऊपर, उसके नीचे 3 Vibhag (Technical, Editorial, Legal) - हर
    // Vibhag का एक Head (जिसकी Photo लग सकती है) और बाकी Members (सिर्फ़ नाम+पद)
    defineField({
      name: 'legalPanel',
      title: '⚖️ Legal Panel (Organization Chart)',
      type: 'object',
      group: 'engagement',
      description:
        'यह Footer में एक Court/Judiciary जैसा Hierarchy Chart दिखाएगा - सबसे ऊपर Founder, उसके नीचे Technical/Editorial/Legal विभाग। सिर्फ़ मुख्य पदाधिकारी (Founder + हर विभाग का Head) की फ़ोटो लगती है, बाकी सदस्यों का सिर्फ़ नाम और पद दिखता है।',
      fields: [
        {
          name: 'founder',
          title: '👑 प्रमुख (Founder)',
          type: 'object',
          description: 'सबसे ऊपर, बीच में दिखेगा - सबसे बड़ा और सबसे पहला पद',
          fields: [
            { name: 'name', type: 'string', title: 'नाम' },
            { name: 'role', type: 'string', title: 'पद', initialValue: 'Founder & Editor-in-Chief' },
            { name: 'photo', type: 'image', title: 'फ़ोटो', options: { hotspot: true } },
          ],
        },
        {
          name: 'departments',
          title: '🏛️ विभाग (Departments)',
          type: 'array',
          description: 'जैसे "Technical Department", "Editorial Department", "Legal Panel" - जितने चाहें उतने जोड़ें',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'departmentName',
                  type: 'string',
                  title: 'विभाग का नाम',
                  description: 'उदाहरण: Technical Department, Editorial Department, Legal Panel',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'head',
                  title: '👤 विभाग प्रमुख (Head) - इनकी फ़ोटो लगेगी',
                  type: 'object',
                  fields: [
                    { name: 'name', type: 'string', title: 'नाम' },
                    {
                      name: 'role',
                      type: 'string',
                      title: 'पद',
                      description: 'उदाहरण: CTO (Chief Technical Officer), Editor-in-Chief, Chief Legal Advisor',
                    },
                    { name: 'photo', type: 'image', title: 'फ़ोटो', options: { hotspot: true } },
                  ],
                },
                {
                  name: 'members',
                  title: '👥 बाकी सदस्य (सिर्फ़ नाम + पद, फ़ोटो नहीं)',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        { name: 'name', type: 'string', title: 'नाम', validation: (Rule: any) => Rule.required() },
                        { name: 'role', type: 'string', title: 'पद', validation: (Rule: any) => Rule.required() },
                      ],
                      preview: { select: { title: 'name', subtitle: 'role' } },
                    },
                  ],
                },
              ],
              preview: {
                select: { title: 'departmentName', subtitle: 'head.name' },
              },
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Website Settings (Logo, Favicon, SEO, AdSense, News)' }
    },
  },
})

function defineArrayMemberImage() {
  return {
    type: 'image' as const,
    options: { hotspot: true },
    fields: [{ name: 'caption', type: 'string' as const, title: 'Caption (वैकल्पिक)' }],
  }
}
