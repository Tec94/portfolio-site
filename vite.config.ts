import { cpSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { defineConfig, normalizePath, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { portfolioMdxSourcePlugin } from './portfolioMdxSourcePlugin';

// These originals stay in the repo; project pages serve their Cloudflare R2 copies.
const r2SourceVideos = new Set([
  'assets/artist_platform/journey_hover.mp4',
  'assets/nexora_landing_page/landing_demo.mp4',
  'assets/slack_agent/slack_demo.mp4',
]);
let buildConfig: ResolvedConfig;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
  },
  plugins: [
    {
      name: 'public-assets-without-r2-originals',
      apply: 'build',
      configResolved(config) {
        buildConfig = config;
      },
      writeBundle() {
        cpSync(buildConfig.publicDir, resolve(buildConfig.root, buildConfig.build.outDir), {
          recursive: true,
          filter: (source) => !r2SourceVideos.has(normalizePath(relative(buildConfig.publicDir, source))),
        });
      },
    },
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
