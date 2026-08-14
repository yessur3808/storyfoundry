import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const books = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    author: z.string(),
    description: z.string(),
    genre: z.array(z.string()),
    status: z.enum(['Serializing', 'Complete', 'Coming soon']),
    published: z.coerce.date(),
    featured: z.boolean().default(false),
    accent: z.string().default('#d86545'),
    downloadSlug: z.string(),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/chapters' }),
  schema: z.object({
    title: z.string(),
    book: z.string(),
    order: z.number().int().positive(),
    description: z.string(),
    published: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { books, chapters };
