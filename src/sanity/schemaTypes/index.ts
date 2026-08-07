// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/sanity/schemaTypes/index.ts
import { jobPost } from './jobPost'
import { category } from './category'
import { organization } from './organization'
import { subscriber } from './subscriber'
import { pushSubscriber } from './pushSubscriber'
import { siteSettings } from './siteSettings'

export const schemaTypes = [jobPost, category, organization, subscriber, pushSubscriber, siteSettings]
