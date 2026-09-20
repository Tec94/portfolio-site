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
  .strict();

export const projectFrontmatterSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    summary: z.string().min(1),
    presentation: z.enum(['case-study', 'demo']).default('case-study'),
    year: z.number().int().min(2000).optional(),
    completedAt: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
    role: z.string().min(1).optional(),
    duration: z.string().min(1).optional(),
    categories: z.array(z.string().min(1)).min(1),
    technologies: z.array(z.string().min(1)).min(1).default([]),
    selectedWorkOrder: z.number().int().positive(),
    links: projectLinksSchema.default({}),
    publicationState: publicationStateSchema,
    media: z.array(projectMediaSchema).min(1),
  })
  .strict()
  .superRefine((project, context) => {
    if (project.presentation !== 'case-study') return;
    for (const field of ['year', 'completedAt', 'role', 'duration'] as const) {
      if (project[field] === undefined) {
        context.addIssue({ code: 'custom', path: [field], message: 'Required for a case study.' });
      }
    }
    if (!project.technologies.length) {
      context.addIssue({ code: 'custom', path: ['technologies'], message: 'Required for a case study.' });
    }
    if (!Object.values(project.links).some(Boolean)) {
      context.addIssue({ code: 'custom', path: ['links'], message: 'At least one project link is required for a case study.' });
    }
  });

export const articleFrontmatterSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    summary: z.string().min(1),
    publicationDate: z.string().date(),
    format: z.enum(['Note', 'Write-up']).default('Note'),
    readingMinutes: z.number().int().positive().optional(),
    series: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).min(1),
    status: publicationStateSchema,
    cover: projectMediaSchema.optional(),
  })
  .strict();

export type PublicationState = z.infer<typeof publicationStateSchema>;
export type ProjectMedia = z.infer<typeof projectMediaSchema>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
