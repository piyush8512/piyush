// schemas/currentWork.js
const currentWork = {
  name: 'currentWork',
  title: 'Current Work',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'Current Work',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'link',
      title: 'Link (Optional)',
      type: 'url'
    }
  ]
}

export default currentWork