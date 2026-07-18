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
      title: 'Endpoint (Device Identifier)',
      type: 'text',
      validation: (Rule) => Rule.required(),
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
