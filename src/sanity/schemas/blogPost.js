
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image', 
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'link',
      title: 'Link',
      type: 'string',
    },
    {
        name: 'content',
        title: 'Content',
        type: 'string',
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
}