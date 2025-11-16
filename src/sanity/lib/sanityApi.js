// lib/sanityApi.js
import {client} from '@/sanity/lib/sanity.js';
export async function getTestimonials() {
  const query = `*[_type == "testimonial"]{
    _id,
    name,
    "profile_picture_url": profile_picture->url, // Assuming 'profile_picture' is an image field
    location,
    quote,
    link
  }`;
  const data = await client.fetch(query);
  return data;
}

export async function getSummary() {
  const query = `*[_type == "summary"] [0]{
    text // Replace 'content' with the actual field name in your Sanity 'summary' schema
  }`;
  const data = await client.fetch(query);
  return data;
}


export async function getFeaturedProjects() {
  const query = `*[_type == "project"]{
    _id,
    title,
    description,
    "image_url": image.asset->url,
    link,
    code,
    type,
  }`;
  const data = await client.fetch(query);
  return data;
}

  export async function getSkills() {
    const query = `*[_type == "skills"]{
      languages,
      database,
      mobile,
      frameworks,
      tools,
      others
    }`;
    const data = await client.fetch(query);
    return data;
  }


  export async function getAbout() {
    const query = `*[_type == "aboutMe"]{
      paragraphs,
    }`;
    const data = await client.fetch(query);
    return data;
  }

export async function getCurrentWork() {
  const query = `*[_type == "currentWork"]{
    text,
 
    link,

  }`;
  const data = await client.fetch(query);
  return data;
}


//get resume pdf
export async function getResume() {
  const query = `*[_type == "resume"]{
    "pdf_url": pdf.asset->url,
  }`;
  const data = await client.fetch(query);
  return data;
}


