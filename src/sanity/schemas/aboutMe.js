export default {
  name: 'aboutMe',
  title: 'About Me',
  type: 'document',
  fields: [
    {
      name: 'paragraphs',
      title: 'About Me Paragraphs',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each item in this array will be a paragraph of your "About Me" section.'
    }
  ]
}