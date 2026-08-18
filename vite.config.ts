import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { portfolioMdxSourcePlugin } from './portfolioMdxSourcePlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    portfolioMdxSourcePlugin(),
    mdx({
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
      rehypePlugins: [rehypeSlug],
    }),
    react(),
  ],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'EXPERIMENTATION_'],
});
