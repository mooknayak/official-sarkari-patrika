// ✏️ एडिट फ़ाइल — मौजूदा फाइल में बदलें: src/sanity/schemaTypes/pushSubscriber.ts
import { defineField, defineType } from 'sanity'
import { BellIcon } from '@sanity/icons'

export const pushSubscriber = defineType({
  name: 'pushSubscriber',
  title: 'Push Notification Subscribers',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'fcmToken',
      title: 'Firebase (FCM) Token',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description: 'Firebase Cloud Messaging का Device Token - इसी पर Notification भेजी जाती है।',
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { title: 'subscribedAt', subtitle: 'fcmToken' },
    prepare({ title, subtitle }) {
      return { title: title ? `Subscribed: ${title}` : 'Push Subscriber', subtitle }
    },
  },
})
