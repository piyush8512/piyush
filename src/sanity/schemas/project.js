// schemas/project.js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Project thumbnail or preview image.'
    },
    {
      name: 'code',
      title: 'Code Link (GitHub)',
      type: 'url'
    },
    {
      name: 'link',
      title: 'Live Demo Link',
      type: 'url'
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Desktop', value: 'desktop' },
          { title: 'Mobile', value: 'mobile' }
        ],
        layout: 'radio'
      }
    },
    {
      name: 'stack',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'string' }]
    },
  ]
}