import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const organization = defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Organization Name',
      type: 'string',
      description: 'उदाहरण: UPSC, SSC, IBPS, Indian Railways (RRB)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name / Abbreviation',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'website',
      title: 'Official Website URL',
      type: 'url',
      description: 'इसे JobPosting schema के sameAs फील्ड में उपयोग किया जाएगा',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'About Organization',
      type: 'text',
      description: 'संगठन के बारे में 2-3 पंक्तियाँ — SEO के लिए उपयोगी unique content',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'shortName', media: 'logo' },
  },
})
