import { type SchemaTypeDefinition } from 'sanity'
import testimonial from '@/sanity/schemas/testimonial';
import quote from '@/sanity/schemas/quote';
import profileLinks from '@/sanity/schemas/profileLinks';
import skills from '@/sanity/schemas/skills';
import aboutMe from '@/sanity/schemas/aboutMe';
import summary from '@/sanity/schemas/summary';
import currentWork from '@/sanity/schemas/currentWork';
import funFacts from '@/sanity/schemas/funFacts';
import contactInfo from '@/sanity/schemas/contactInfo';
import project from '@/sanity/schemas/project';
import resume from '@/sanity/schemas/resume';
import blogPost from '@/sanity/schemas/blogPost';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    testimonial, 
    quote,
    profileLinks,
    skills,
    aboutMe,
    summary,
    currentWork,
    funFacts,
    contactInfo,
    project,
    resume,
    blogPost
  ],
}