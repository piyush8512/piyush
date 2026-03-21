import { client } from "@/sanity/lib/client";

export interface ContentChunk {
  sourceType: string;
  sourceId: string;
  chunkText: string;
  metadata: {
    title?: string;
    tags?: string[];
    url?: string;
  };
}

/**
 * Fetches all portfolio content from Sanity and chunks it for embedding.
 * Supports: projects, skills, about, work experience, testimonials, FAQs
 */
export async function fetchPortfolioContent(): Promise<ContentChunk[]> {
  const chunks: ContentChunk[] = [];

  try {
    // Fetch all projects
    const projects = await fetchProjects();
    chunks.push(...projects);

    // Fetch all skills
    const skills = await fetchSkills();
    chunks.push(...skills);

    // Fetch about/bio
    const about = await fetchAbout();
    chunks.push(...about);

    // Fetch work experience
    const work = await fetchWorkExperience();
    chunks.push(...work);

    // Fetch testimonials
    const testimonials = await fetchTestimonials();
    chunks.push(...testimonials);

    // Fetch blog posts
    const blogs = await fetchBlogs();
    chunks.push(...blogs);

    return chunks;
  } catch (error) {
    console.error("Error fetching portfolio content from Sanity:", error);
    throw new Error("Failed to fetch portfolio content");
  }
}

/**
 * Fetches all projects from Sanity
 */
async function fetchProjects(): Promise<ContentChunk[]> {
  const query = `
    *[_type == "project"] {
      _id,
      title,
      description,
      stack,
      code,
      link,
      type,
      "imageUrl": image.asset->url
    }
  `;

  try {
    const projects = (await client.fetch(query)) || [];
    return projects.flatMap((project: any) => {
      const chunks: ContentChunk[] = [];

      // Create chunk from project info
      if (project.title) {
        const projectInfo = `
Project: ${project.title}
Description: ${project.description || ""}
Tech Stack: ${Array.isArray(project.stack) ? project.stack.join(", ") : ""}
Type: ${project.type || ""}
${project.link ? `Link: ${project.link}` : ""}
${project.code ? `GitHub: ${project.code}` : ""}
        `.trim();

        chunks.push({
          sourceType: "project",
          sourceId: project._id,
          chunkText: projectInfo,
          metadata: {
            title: project.title,
            tags: ["project", ...(Array.isArray(project.stack) ? project.stack : [])],
            url: project.link || project.code,
          },
        });
      }

      return chunks;
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

/**
 * Fetches skills from category arrays in Sanity
 */
async function fetchSkills(): Promise<ContentChunk[]> {
  const query = `
    *[_type == "skills"] {
      _id,
      languages,
      database,
      frameworks,
      tools,
      mobile,
      others
    }
  `;

  try {
    const docs = (await client.fetch(query)) || [];
    const categories = [
      "languages",
      "database",
      "frameworks",
      "tools",
      "mobile",
      "others",
    ];

    const chunks: ContentChunk[] = [];

    for (const doc of docs) {
      for (const category of categories) {
        const items = Array.isArray(doc[category]) ? doc[category] : [];
        if (!items.length) continue;

        chunks.push({
          sourceType: "skill",
          sourceId: `${doc._id}_${category}`,
          chunkText: `Skill Category: ${category}\nSkills: ${items.join(", ")}`,
          metadata: {
            title: `Skills - ${category}`,
            tags: ["skill", category, ...items],
          },
        });
      }
    }

    return chunks;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

/**
 * Fetches about content from Sanity
 */
async function fetchAbout(): Promise<ContentChunk[]> {
  const query = `
    *[_type == "aboutMe"] {
      _id,
      paragraphs
    }
  `;

  try {
    const aboutData = (await client.fetch(query)) || [];
    return aboutData.map((item: any) => ({
      sourceType: "about",
      sourceId: item._id,
      chunkText: Array.isArray(item.paragraphs)
        ? item.paragraphs.join("\n")
        : "",
      metadata: {
        title: "About Me",
        tags: ["about", "bio"],
      },
    }));
  } catch (error) {
    console.error("Error fetching about content:", error);
    return [];
  }
}

/**
 * Fetches current work from Sanity
 */
async function fetchWorkExperience(): Promise<ContentChunk[]> {
  const query = `
    *[_type == "currentWork"] {
      _id,
      text,
      link
    }
  `;

  try {
    const workExp = (await client.fetch(query)) || [];
    return workExp.map((work: any) => ({
      sourceType: "work_experience",
      sourceId: work._id,
      chunkText: `Current Work: ${work.text || ""}\n${work.link ? `Link: ${work.link}` : ""}`,
      metadata: {
        title: "Current Work",
        tags: ["work_experience", "current"],
        url: work.link,
      },
    }));
  } catch (error) {
    console.error("Error fetching work experience:", error);
    return [];
  }
}

/**
 * Fetches testimonials from Sanity
 */
async function fetchTestimonials(): Promise<ContentChunk[]> {
  const query = `
    *[_type == "testimonial"] {
      _id,
      name,
      quote,
      location,
      link
    }
  `;

  try {
    const testimonials = (await client.fetch(query)) || [];
    return testimonials.map((testimonial: any) => ({
      sourceType: "testimonial",
      sourceId: testimonial._id,
      chunkText: `Testimonial from ${testimonial.name || "Unknown"}${
        testimonial.location ? ` (${testimonial.location})` : ""
      }: "${testimonial.quote || ""}"`,
      metadata: {
        title: `Testimonial - ${testimonial.name || "Unknown"}`,
        tags: ["testimonial"],
        url: testimonial.link,
      },
    }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

/**
 * Fetches blog posts from Sanity
 */
async function fetchBlogs(): Promise<ContentChunk[]> {
  const query = `
    *[_type == "blogPost"] {
      _id,
      title,
      description,
      content,
      link
    }
  `;

  try {
    const blogs = (await client.fetch(query)) || [];
    return blogs.map((blog: any) => ({
      sourceType: "blog",
      sourceId: blog._id,
      chunkText: `Blog: ${blog.title || ""}\nDescription: ${blog.description || ""}\nContent: ${blog.content || ""}`,
      metadata: {
        title: blog.title,
        tags: ["blog"],
        url: blog.link,
      },
    }));
  } catch (error) {
    // Blogs might not exist, so do not block pipeline
    return [];
  }
}
