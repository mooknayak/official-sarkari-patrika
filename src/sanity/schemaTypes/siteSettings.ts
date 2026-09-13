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

    // 🆕🆕🆕 ================= प्रोफेशनल Banner Ad Placements ================= 🆕🆕🆕
    // हर जगह की अपनी अलग जगह (Slot), अपना तय साइज़ और अपना अलग Sandbox (iframe) है।
    // हर Ad अपने ही डिब्बे के अंदर isolate रहता है - इसलिए साइट पर कहीं भी क्लिक
    // करने पर Ad अपने-आप नहीं खुलेगा (जो पहले "MultiTag/Popunder" वाले Global Code
    // से हो रहा था)। Monetag Dashboard से हर Placement के लिए अलग "Banner" Zone
    // बनाएँ (Push/Popunder/OnClick/SmartLink टाइप नहीं - सिर्फ़ Banner टाइप कोड
    // यहाँ डालें) और नीचे सही जगह Paste करें - साइज़ हमने पहले से Professional
    // (SarkariResult जैसा) सेट कर दिया है, आपको साइज़ की चिंता नहीं करनी।
    defineField({
      name: 'headerBannerCode',
      title: '1️⃣ Header Banner (लोगो/मेनू के ठीक नीचे)',
      type: 'text',
      rows: 5,
      group: 'ads',
      description:
        'साइज़: 728×90 (Desktop) / 320×50 (Mobile) - अपने-आप Responsive। Monetag से "Banner" Zone का कोड यहाँ डालें।',
    }),
    defineField({
      name: 'contentBannerLeft',
      title: '2️⃣ Important Links के ऊपर - बायाँ Banner (1 of 3)',
      type: 'text',
      rows: 5,
      group: 'ads',
      description:
        'साइज़: 300×100। SarkariResult जैसे एक-साथ 3 Banner की Row बनाने के लिए - यह पहला (बायाँ) Banner है।',
    }),
    defineField({
      name: 'contentBannerCenter',
      title: '2️⃣ Important Links के ऊपर - बीच वाला Banner (2 of 3)',
      type: 'text',
      rows: 5,
      group: 'ads',
      description: 'साइज़: 300×100। तीन Banner वाली Row का बीच वाला (दूसरा) Banner।',
    }),
    defineField({
      name: 'contentBannerRight',
      title: '2️⃣ Important Links के ऊपर - दायाँ Banner (3 of 3)',
      type: 'text',
      rows: 5,
      group: 'ads',
      description: 'साइज़: 300×100। तीन Banner वाली Row का आख़िरी (तीसरा) Banner।',
    }),
    defineField({
      name: 'stickyBottomBannerCode',
      title: '3️⃣ Sticky Bottom Banner (स्क्रीन के सबसे नीचे चिपका हुआ)',
      type: 'text',
      rows: 5,
      group: 'ads',
      description:
        'साइज़: 320×50 (Mobile Sticky Banner)। User के पास एक छोटा ✕ Close बटन भी रहेगा - यह पूरे पेज को कवर नहीं करेगा, सिर्फ़ नीचे एक पतली पट्टी में रहेगा।',
    }),
    defineField({
      name: 'footerBannerCode',
      title: '4️⃣ Footer Banner (Footer से ठीक ऊपर)',
      type: 'text',
      rows: 5,
      group: 'ads',
      description: 'साइज़: 728×90 (Desktop) / 320×50 (Mobile) - अपने-आप Responsive।',
    }),

    // 🆕 Google AdSense के अलावा कोई और Ad Network (जैसे Media.net - जो Microsoft/Bing
    // के Advertisers से Ad दिखाता है) - दोनों एक साथ भी चल सकते हैं, यह Google की
    // Policy के खिलाफ नहीं है।
    defineField({
      name: 'secondaryAdNetworkName',
      title: '🖥️ दूसरे Ad Network का नाम (सिर्फ़ याद रखने के लिए)',
      type: 'string',
      group: 'ads',
      description: 'उदाहरण: "Media.net", "Ezoic" - यह सिर्फ़ लेबल है, कोड में इस्तेमाल नहीं होता',
    }),
    defineField({
      name: 'secondaryAdNetworkCode',
      title: '⚠️ सिर्फ़ Site-Verification Script (Ad/Banner Code नहीं)',
      type: 'text',
      rows: 6,
      group: 'ads',
      description:
        '⚠️ ज़रूरी: यहाँ सिर्फ़ Ezoic/Media.net जैसे Network का "Site Verification" Script डालें (वो कोड जो कोई Ad नहीं दिखाता, सिर्फ़ Ownership साबित करता है)। किसी भी तरह का Popunder / MultiTag / OnClick / Push Ad Code यहाँ कभी न डालें - यह पूरी साइट पर हर जगह Click Hijack करके Ad खोल देगा (पहले यही समस्या थी)। असली Ad Banner ऊपर वाले 4 Placement Fields में डालें, वहाँ हर Ad अपने Sandbox (iframe) में सुरक्षित रहता है।',
    }),

    // 🆕 "Priority Switch" - असली Real-Time Bidding (जो बड़ी Sites इस्तेमाल करती हैं)
    // बहुत जटिल Ad-Tech System है, अभी हमारी साइट के लिए ज़रूरत से ज़्यादा भारी होगा।
    // इसकी जगह एक Simple, आपके हाथ में रहने वाला Switch है - जब आप देखें कि कौन ज़्यादा
    // कमाई दे रहा है (हर एक-दो हफ़्ते में दोनों के Dashboard Earnings देखकर), तब यहाँ से
    // बदल दें - Code छूने की कोई ज़रूरत नहीं।
    defineField({
      name: 'adPriority',
      title: '⚖️ किसे प्राथमिकता दें (जब दोनों Approved हों)',
      type: 'string',
      group: 'ads',
      options: {
        list: [
          { title: '✅ दोनों साथ-साथ चलाएँ (अलग-अलग जगह)', value: 'both' },
          { title: '🟦 Google AdSense को पहले दिखाएँ', value: 'google_first' },
          { title: '🟨 Microsoft/Media.net को पहले दिखाएँ', value: 'microsoft_first' },
        ],
        layout: 'radio',
      },
      initialValue: 'both',
      description:
        'जब तक सिर्फ़ एक ही Network Approved है, वही अपने-आप दिखेगा। दोनों Approved होने पर यह Setting तय करेगी कि प्राथमिकता किसे मिले। जिसकी Earning ज़्यादा दिखे, हर हफ़्ते-दो हफ़्ते में यहाँ आकर बदल सकते हैं।',
    }),

    // 🆕🆕🆕 ============ 5️⃣ Important Links Ad Stack (SarkariResult वाला "कई Banner एक साथ" Pattern) ============ 🆕🆕🆕
    // SarkariResult पर जो एक साथ 3-4 Banner एक के नीचे एक दिखते हैं, वह असल में
    // एक ही बड़ा Banner नहीं है — हर "Important Link" Row के साथ एक अलग Ad Unit
    // जुड़ा है। जितनी ज़्यादा Link Rows, उतने ही ज़्यादा Ad एक साथ दिख जाते हैं।
    // यहाँ जितने चाहें उतने Ad (Monetag भी, AdSense भी, दोनों मिलाकर भी) जोड़ें -
    // यह अपने-आप हर Link Row के साथ बारी-बारी (Round-Robin) लग जाएँगे।
    defineField({
      name: 'importantLinksAds',
      title: '5️⃣ Important Links Ad Stack (हर Link Row के साथ एक Ad)',
      type: 'array',
      group: 'ads',
      description:
        'SarkariResult जैसा Look - Important Links Table के हर Row के बगल में एक Banner। Monetag और AdSense दोनों के Ad यहाँ मिला-जुलाकर जोड़ सकते हैं - दोनों Network एक साथ, अलग-अलग Row पर चलेंगे। ज़्यादा Ad जोड़ेंगे तो उतना ही सघन (dense) दिखेगा, बिल्कुल Reference जैसा।',
      of: [
        {
          type: 'object',
          name: 'adUnit',
          fields: [
            {
              name: 'network',
              title: 'Network',
              type: 'string',
              options: {
                list: [
                  { title: '🖥️ Monetag / अन्य Custom Ad Code', value: 'custom' },
                  { title: '🟦 Google AdSense (Real Ad Unit)', value: 'adsense' },
                ],
                layout: 'radio',
              },
              initialValue: 'custom',
            },
            {
              name: 'code',
              title: 'Ad Code (Monetag/Custom के लिए - पूरा Code Paste करें)',
              type: 'text',
              rows: 4,
              hidden: ({ parent }: any) => parent?.network === 'adsense',
            },
            {
              name: 'adSenseSlotId',
              title: 'AdSense Ad Slot ID',
              type: 'string',
              description:
                'AdSense Dashboard → Ads → By ad unit → कोई भी Display Ad Unit बनाएँ, वहाँ से सिर्फ़ data-ad-slot वाला नंबर (जैसे 1234567890) यहाँ डालें - पूरा Publisher ID ऊपर वाले फ़ील्ड से अपने-आप जुड़ जाएगा।',
              hidden: ({ parent }: any) => parent?.network !== 'adsense',
            },
          ],
          preview: {
            select: { network: 'network', code: 'code', slot: 'adSenseSlotId' },
            prepare({ network, code, slot }: any) {
              return {
                title: network === 'adsense' ? '🟦 AdSense Ad Unit' : '🖥️ Monetag / Custom Banner',
                subtitle: network === 'adsense' ? `Slot: ${slot || '—'}` : (code ? code.slice(0, 50) : ''),
              }
            },
          },
        },
      ],
    }),

    // 🆕 Video Ads - VAST Tag आधारित (Google IMA SDK) - Monetag Video/AdSense for
    // Video दोनों में जो भी "VAST Tag URL" मिले, वह सीधे यहाँ पेस्ट कर दें, कोई
    // Extra Library Install करने की ज़रूरत नहीं - Player पहले से बना हुआ है।
    defineField({
      name: 'videoAdVastTagUrl',
      title: '🎬 Video Ad - VAST Tag URL',
      type: 'url',
      group: 'ads',
      description:
        'Monetag (Video Ad ज़ोन) या Google AdSense for Video से मिलने वाला VAST Tag Link यहाँ पेस्ट करें। खाली छोड़ने पर Video Ad Player साइट पर कहीं नहीं दिखेगा, कोई नुकसान नहीं।',
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
        'यहाँ Founder, Editor-in-Chief, Legal Advisor जैसे लोगों के नाम जोड़ें - यह "About Us" पेज पर एक Team सेक्शन के तौर पर दिखेगा। Google इसे साइट की विश्वसनीयता (E-E-A-T) परखने के लिए देखता है, और AdSense व Google News Approval में भी मदद करता है।',
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
