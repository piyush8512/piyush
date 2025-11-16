// schemas/summary.js
export default {
  name: 'summary',
  title: 'Summary',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'Summary Text',
      type: 'text',
      validation: Rule => Rule.required()
    }
  ]
}