import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { ZodError, type ZodType } from 'zod';
import {
  articleFrontmatterSchema,
  projectFrontmatterSchema,
  type ArticleFrontmatter,
  type ProjectFrontmatter,
} from '../src/portfolio/content/contracts.ts';

const workspaceRoot = process.cwd();
const contentRoot = path.join(workspaceRoot, 'src', 'content');

async function readMdxDirectory<T>(directoryName: string, schema: ZodType<T>) {
  const directory = path.join(contentRoot, directoryName);
  const filenames = (await readdir(directory)).filter((filename) => filename.endsWith('.mdx'));

  return Promise.all(
    filenames.map(async (filename) => {
      const source = await readFile(path.join(directory, filename), 'utf8');
      const parsed = schema.parse(matter(source).data);
      const expectedSlug = path.basename(filename, '.mdx');
      const actualSlug = (parsed as { slug: string }).slug;

      if (actualSlug !== expectedSlug) {
        throw new Error(`${directoryName}/${filename}: slug must be "${expectedSlug}".`);
      }

      return parsed;
    }),
  );
}

async function verifyLocalMedia(projects: ProjectFrontmatter[], articles: ArticleFrontmatter[]) {
  const mediaSources = [
    ...projects.flatMap((project) => project.media.flatMap((media) => [media.source, media.poster])),
    ...articles.flatMap((article) => [article.cover?.source, article.cover?.poster]),
  ].filter((source): source is string => Boolean(source?.startsWith('/')));

  await Promise.all(
    mediaSources.map(async (source) => {
      const publicPath = path.resolve(workspaceRoot, 'public', source.slice(1));
      const publicRoot = path.resolve(workspaceRoot, 'public');
      if (!publicPath.startsWith(`${publicRoot}${path.sep}`)) {
        throw new Error(`Local media path escapes public/: ${source}`);
      }
      await access(publicPath);
    }),
  );
}

async function validateContent() {
  const [projects, articles] = await Promise.all([
    readMdxDirectory('projects', projectFrontmatterSchema),
    readMdxDirectory('writing', articleFrontmatterSchema),
  ]);

  const orderOwners = new Map<number, string>();
  projects.forEach((project) => {
    const previous = orderOwners.get(project.selectedWorkOrder);
    if (previous) {
      throw new Error(
        `selectedWorkOrder ${project.selectedWorkOrder} is shared by ${previous} and ${project.slug}.`,
      );
    }
    orderOwners.set(project.selectedWorkOrder, project.slug);
  });

  await verifyLocalMedia(projects, articles);
  const publishedProjects = projects.filter((project) => project.publicationState === 'published');
  const publishedArticles = articles.filter((article) => article.status === 'published');

  console.log(
    `Portfolio content valid: ${projects.length} projects (${publishedProjects.length} published), ` +
      `${articles.length} articles (${publishedArticles.length} published).`,
  );
}

validateContent().catch((error: unknown) => {
  if (error instanceof ZodError) {
    console.error(error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'));
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

