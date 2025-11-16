// schemas/index.js (or schema.js)
import testimonial from './testimonial'
import quote from './quote'
import profileLinks from './profileLinks'
import skills from './skills'
import aboutMe from './aboutMe'
import summary from './summary'
import currentWork from './currentWork'
import funFacts from './funFacts'
import contactInfo from './contactInfo'
import project from './project' // Import the single project schema

export const schemaTypes = [
  testimonial,
  quote,
  profileLinks,
  skills,
  aboutMe,
  summary,
  currentWork,
  funFacts,
  contactInfo,
  project, // Add the project schema
]