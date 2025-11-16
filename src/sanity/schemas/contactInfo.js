// schemas/contactInfo.js
export default {
  name: 'contactInfo',
  title: 'Contact Information',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string', // Use string for email address
      validation: Rule => Rule.required().email() // Add email validation
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string'
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [{ type: 'text' }], // Use text for longer notes
      description: 'Any additional notes or messages for contact section.'
    }
  ]
}