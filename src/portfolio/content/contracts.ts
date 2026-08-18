import { z } from 'zod';

export const publicationStateSchema = z.enum(['draft', 'published']);

export const projectMediaSchema = z
  .object({
    type: z.enum(['image', 'video']),
    source: z.string().min(1),
    poster: z.string().min(1).optional(),
    alt: z.string().min(1),
    caption: z.string().min(1).optional(),
    aspectRatio: z
      .object({
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .strict(),
    narrativeRole: z.enum(['hero', 'flow', 'detail', 'evidence']),
  })
  .strict();

const projectLinksSchema = z
  .object({
    live: z.string().url().optional(),
    repository: z.string().url().optional(),
    devpost: z.string().url().optional(),
  })
  .strict()
  .refine((links) => Object.values(links).some(Boolean), {
    message: 'At least one project link is required.',
  });

export const projectFrontmatterSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    summary: z.string().min(1),
    year: z.number().int().min(2000),
    completedAt: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    role: z.string().min(1),
    duration: z.string().min(1),
    categories: z.array(z.string().min(1)).min(1),
    technologies: z.array(z.string().min(1)).min(1),
    selectedWorkOrder: z.number().int().positive(),
    links: projectLinksSchema,
    publicationState: publicationStateSchema,
    media: z.array(projectMediaSchema).min(1),
  })
  .strict();

export const articleFrontmatterSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    summary: z.string().min(1),
    publicationDate: z.string().date(),
    tags: z.array(z.string().min(1)).min(1),
    status: publicationStateSchema,
    cover: projectMediaSchema.optional(),
  })
  .strict();

export type PublicationState = z.infer<typeof publicationStateSchema>;
export type ProjectMedia = z.infer<typeof projectMediaSchema>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
