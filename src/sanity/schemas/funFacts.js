// schemas/funFacts.js
export default {
  name: 'funFacts',
  title: 'Fun Facts',
  type: 'document',
  fields: [
    {
      name: 'facts',
      title: 'Facts List',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each item in this array will be a fun fact.'
    }
  ]
}