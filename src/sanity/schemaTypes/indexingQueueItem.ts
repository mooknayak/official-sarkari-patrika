// ✏️ यह Firebase Firestore की "indexingRetryQueue" collection की जगह लेता है —
// Google Indexing fail होने पर URL यहीं (Sanity) पर queue होता है, ताकि Cron Job
// बाद में दोबारा कोशिश कर सके।
import { defineField, defineType } from 'sanity'
import { RefreshIcon } from '@sanity/icons'

export const indexingQueueItem = defineType({
  name: 'indexingQueueItem',
  title: 'Indexing Retry Queue',
  type: 'document',
  icon: RefreshIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reason',
      title: 'Reason',
      type: 'string',
    }),
    defineField({
      name: 'attempts',
      title: 'Attempts',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'lastTriedAt',
      title: 'Last Tried At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: { title: 'url', subtitle: 'reason' },
  },
})
