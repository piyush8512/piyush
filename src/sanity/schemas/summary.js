// schemas/summary.js
const summary = {
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

export default summary