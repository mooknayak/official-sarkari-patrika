// ✏️ एडिट फ़ाइल — अब Firebase FCM Token की जगह Standard Web Push Subscription
// (endpoint + keys) यहाँ स्टोर होती है, ब्राउज़र की अपनी बिल्ट-इन Push API से।
import { defineField, defineType } from 'sanity'
import { BellIcon } from '@sanity/icons'

export const pushSubscriber = defineType({
  name: 'pushSubscriber',
  title: 'Push Notification Subscribers',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'endpoint',
      title: 'Push Endpoint',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description: 'ब्राउज़र की Push Service URL — यही एक Subscriber को यूनीक पहचानती है।',
    }),
    defineField({
      name: 'p256dh',
      title: 'p256dh Key',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'auth',
      title: 'Auth Key',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { title: 'subscribedAt', subtitle: 'endpoint' },
    prepare({ title, subtitle }) {
      return { title: title ? `Subscribed: ${title}` : 'Push Subscriber', subtitle }
    },
  },
})
