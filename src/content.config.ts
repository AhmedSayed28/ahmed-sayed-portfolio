import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    problem: z.string(),
    approach: z.string(),
    decisions: z.array(z.string()),
    edgeCase: z.string(),
    technologies: z.array(z.string()),
    githubUrl: z.url(),
    demoUrl: z.url().optional(),
    coverImage: z.string().optional(),
    specimen: z.enum(['shopping-cart']).optional(),
    status: z.enum(['published', 'in-progress']),
    featured: z.boolean(),
    order: z.number(),
    visible: z.boolean(),
  }),
});

export const collections = { projects };
