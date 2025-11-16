// schemas/profileLinks.js
export default {
  name: 'profileLinks',
  title: 'Profile Links',
  type: 'document',
  fields: [
    {
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'object',
      fields: [
        { name: 'link', title: 'Link', type: 'url' },
        { name: 'label', title: 'Label', type: 'string' },
      ],
    },
    {
      name: 'github',
      title: 'GitHub',
      type: 'object',
      fields: [
        { name: 'link', title: 'Link', type: 'url' },
        { name: 'label', title: 'Label', type: 'string' },
      ],
    },
    // ... repeat for TWITTER, FACEBOOK, EMAIL
    {
      name: 'twitter',
      title: 'Twitter',
      type: 'object',
      fields: [
        { name: 'link', title: 'Link', type: 'url' },
        { name: 'label', title: 'Label', type: 'string' },
      ],
    },
    {
      name: 'facebook',
      title: 'Facebook',
      type: 'object',
      fields: [
        { name: 'link', title: 'Link', type: 'url' },
        { name: 'label', title: 'Label', type: 'string' },
      ],
    },
    {
      name: 'email',
      title: 'Email',
      type: 'object',
      fields: [
        { name: 'link', title: 'Email Address', type: 'string' }, // Use string for email
        { name: 'label', title: 'Label', type: 'string' },
      ],
    },
  ]
}