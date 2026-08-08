// ✏️ यह Firebase Firestore की जगह लेता है — अब सारे Comments यहीं (Sanity) में store होते हैं।
import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

export const comment = defineType({
  name: 'comment',
  title: 'Comments',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'postSlug',
      title: 'Post Slug',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postTitle',
      title: 'Post Title',
      type: 'string',
    }),
    defineField({
      name: 'name',
      title: 'नाम',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: (Rule) => Rule.required().max(1000),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'reply',
      title: 'Admin का जवाब',
      type: 'object',
      fields: [
        defineField({ name: 'message', title: 'जवाब', type: 'text' }),
        defineField({ name: 'repliedAt', title: 'Replied At', type: 'datetime' }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'message', description: 'postTitle' },
    prepare({ title, subtitle, description }) {
      return {
        title: title || 'अज्ञात',
        subtitle: subtitle ? subtitle.slice(0, 60) : '',
        description,
      }
    },
  },
})
