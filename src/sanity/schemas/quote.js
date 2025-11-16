// schemas/quote.js
export default {
  name: 'quote',
  title: 'Quote',
  type: 'document',
  fields: [
    {
      name: 'quoteText', // Renamed to avoid conflict with 'quote' type
      title: 'Quote Text',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: Rule => Rule.required()
    }
  ]
}