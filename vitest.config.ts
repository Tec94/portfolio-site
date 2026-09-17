import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { portfolioMdxSourcePlugin } from './portfolioMdxSourcePlugin';

export default defineConfig({
  plugins: [
    portfolioMdxSourcePlugin(),
    mdx({
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
      rehypePlugins: [rehypeSlug],
    }),
    react(),
  ],
  test: {
    exclude: [...configDefaults.exclude, 'studio/**', '.studio/**'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
  },
});
