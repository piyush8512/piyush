// schemas/skills.js
const skills = {
  name: 'skills',
  title: 'Skills',
  type: 'document',
  fields: [
    {
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'database',
      title: 'Database',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'frameworks',
      title: 'Frameworks',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'tools',
      title: 'Tools',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'mobile',
      title: 'Mobile Development',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'others',
      title: 'Other Technologies',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ]
}

export default skills
