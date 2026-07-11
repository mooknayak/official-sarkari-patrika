import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      description: 'उदाहरण: Jobs, Admit Card, Result, Answer Key, Syllabus',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
      description: 'यही आपके URL में [category] सेगमेंट बनता है, जैसे /jobs या /result',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Category listing पेज के लिए intro paragraph — SEO के लिए उपयोगी',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Navbar/Homepage में क्रम तय करने हेतु (छोटा नंबर पहले दिखेगा)',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
