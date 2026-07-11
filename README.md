# Official Sarkari Patrika

Next.js (App Router) + Sanity.io + Vercel पर बना सरकारी जॉब अलर्ट पोर्टल।

## 🚀 GitHub पर अपलोड करने और Vercel से Deploy करने के Steps

### Step 1 — GitHub Repository बनाएँ
1. https://github.com/new पर जाएँ और एक नया repository बनाएँ (नाम: `official-sarkari-patrika`)।
2. इसे **Private** या **Public** — जैसा चाहें रखें।

### Step 2 — इस फोल्डर को GitHub पर Upload करें
अपने कंप्यूटर के टर्मिनल में इस पूरे फोल्डर (जो आपने ZIP से extract किया है) के अंदर जाकर यह कमांड चलाएँ:

```bash
git init
git add .
git commit -m "Initial commit - Official Sarkari Patrika"
git branch -M main
git remote add origin https://github.com/<आपका-username>/official-sarkari-patrika.git
git push -u origin main
```

> यदि आप कमांड लाइन इस्तेमाल नहीं करना चाहते, तो GitHub की वेबसाइट पर जाकर "uploading an existing file" वाले लिंक से पूरा फोल्डर ड्रैग-एंड-ड्रॉप भी कर सकते हैं (GitHub की drag-and-drop सुविधा सीधे "Add file → Upload files" से)।

### Step 3 — Sanity Project बनाएँ (यदि अभी तक नहीं बनाया)
1. https://sanity.io/manage पर जाकर एक नया project बनाएँ।
2. वहाँ से आपको **Project ID** मिलेगा।
3. Dataset का नाम `production` रखें (डिफ़ॉल्ट)।

### Step 4 — Sanity API Token बनाएँ (ज़रूरी, अपने-आप नहीं बनता)
1. https://sanity.io/manage पर जाकर अपना प्रोजेक्ट (Official Sarkari Patrika) खोलें।
2. **API → Tokens → Add API token** पर जाएँ।
3. नाम कुछ भी दें (जैसे `vercel-production`), और Permission में **Editor** चुनें।
4. जो token मिले उसे तुरंत कॉपी कर लें (यह दोबारा नहीं दिखेगा) — यही `SANITY_API_TOKEN` है।

### Step 5 — Vercel से Connect करें
1. https://vercel.com/new पर जाएँ।
2. "Import Git Repository" से अपनी GitHub repo (`official-sarkari-patrika`) चुनें।
3. **Environment Variables** सेक्शन में नीचे दी गई values paste करें (आपकी असली Project ID पहले से भर दी गई है):

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `vfq6y7fb` |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
   | `SANITY_API_TOKEN` | *(Step 4 से मिला हुआ token यहाँ पेस्ट करें)* |
   | `SANITY_REVALIDATE_SECRET` | कोई भी लंबा random string बना लें, जैसे: `sarkaripatrika_secret_2026_xyz` |
   | `NEXT_PUBLIC_SITE_URL` | `https://officialsarkaripatrika.com` |

4. **Deploy** बटन दबाएँ।

### Step 5 — Custom Domain जोड़ें
1. Vercel प्रोजेक्ट के Settings → Domains में जाकर `officialsarkaripatrika.com` जोड़ें।
2. Vercel जो Nameserver/DNS records दिखाए, उन्हें अपने Domain Registrar (जहाँ से डोमेन खरीदा है) के DNS Settings में जाकर जोड़ दें।
3. DNS Propagate होने में कुछ घंटे लग सकते हैं।

### Step 6 — Sanity Studio एक्सेस करें
Deploy होने के बाद आपका Content Management System यहाँ उपलब्ध होगा:
```
https://officialsarkaripatrika.com/studio
```
यहीं से आप Job Post जोड़ेंगे, और Status (Job/Admit Card/Result) बदलेंगे।

### Step 7 — Webhook सेट करें (Dynamic Update के लिए ज़रूरी)
1. https://sanity.io/manage में अपने project में जाकर **API → Webhooks** में जाएँ।
2. एक नया Webhook बनाएँ:
   - URL: `https://officialsarkaripatrika.com/api/revalidate`
   - Trigger on: Create, Update
   - Secret: वही डालें जो आपने `SANITY_REVALIDATE_SECRET` में Vercel पर डाला है
   - Projection: `{"slug": slug.current, "category": category->slug.current}`
   - Filter: `_type == "jobPost"`

बस — अब जब भी आप किसी Job Post का status बदलेंगे, वेबसाइट अपने-आप उस पेज को अपडेट कर देगी, बिना URL बदले।

---

## 🛠️ लोकल Development (वैकल्पिक — अगर टेस्ट करना हो)

```bash
npm install
cp .env.example .env.local   # फिर .env.local में असली values भरें
npm run dev
```
साइट यहाँ खुलेगी: `http://localhost:3000`
Studio यहाँ खुलेगा: `http://localhost:3000/studio`

---

## 📁 Project Structure संक्षेप में
- `src/app/(site)/` — पब्लिक वेबसाइट के सभी पेज
- `src/app/studio/` — Embedded Sanity CMS
- `src/app/api/revalidate/` — Webhook endpoint (dynamic content update के लिए)
- `src/sanity/schemaTypes/` — Job Post, Category, Organization के Schema
- `src/components/` — सभी UI components

## ⚠️ याद रखें
- `.env.local` फाइल को कभी भी GitHub पर push न करें (यह `.gitignore` में पहले से शामिल है)।
- सभी secrets (`SANITY_API_TOKEN`, `SANITY_REVALIDATE_SECRET`) केवल Vercel के Environment Variables में डालें।
