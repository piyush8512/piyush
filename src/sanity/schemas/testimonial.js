// schemas/testimonial.js (or .ts)

export default {
  // Unique name for this schema type (used internally by Sanity)
  name: 'testimonial',
  // Display name in the Sanity Studio UI
  title: 'Testimonial',
  // The type of schema (e.g., 'document' for a top-level content type)
  type: 'document',
  // Array of fields that define the structure of a testimonial document
  fields: [
    {
      name: 'name', // This is the field's internal name
      title: 'Client Name', // This is the label in the Studio UI
      type: 'string', // The Sanity data type for this field
      validation: Rule => Rule.required(), // Sanity's way to mark a field as required
      description: "The name of the person giving the testimonial.",
    },
    {
      name: 'profile_picture',
      title: 'Profile Picture',
      // For images, Sanity uses the 'image' type, not 'string' for the URL directly.
      // You'll fetch the URL in your Next.js app using `image.asset->url`.
      type: 'image',
      options: {
        hotspot: true, // Allows for focal point selection on images
      },
      description: "Upload the client's profile picture.",
      // 'required: false' is implicit if no validation rule is set
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: Rule => Rule.required(),
      description: "The geographical location of the person.",
    },
    {
      name: 'quote',
      title: 'Quote',
      // Use 'text' for longer strings that might contain line breaks.
      // 'string' is for single-line text input.
      type: 'text',
      validation: Rule => Rule.required(),
      description: "The actual testimonial text.",
    },
    {
      name: 'link',
      title: 'Link (Optional)',
      // Use 'url' type for URLs, Sanity will provide URL validation
      type: 'url',
      description: "A URL related to the testimonial (e.g., person's profile, project link).",
    },
  ],
};