import { cpSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { defineConfig, normalizePath, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { portfolioMdxSourcePlugin } from './portfolioMdxSourcePlugin';
import studioConfig from './studio.config.json';

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
      name: 'studio-search-metadata',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          const data: Record<string, string> = JSON.parse(readFileSync(new URL('./src/content/site/seo.json', import.meta.url), 'utf8'));
          return html.replace(/%STUDIO_([a-z_]+)%/g, (_, key: string) => (data[key] ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!)));
        },
      },
    },
    {
      name: 'studio-media-urls',
      apply: 'build',
      enforce: 'pre',
      transform(source, id) {
        if (!normalizePath(id).includes('/src/')) return;
        return source.replaceAll('/assets/studio/', `${studioConfig.mediaBaseUrl}/studio/`);
      },
    },
    {
      name: 'public-assets-without-r2-originals',
      apply: 'build',
      configResolved(config) {
        buildConfig = config;
      },
      writeBundle() {
        cpSync(buildConfig.publicDir, resolve(buildConfig.root, buildConfig.build.outDir), {
          recursive: true,
          filter: (source) => {
            const name = normalizePath(relative(buildConfig.publicDir, source));
            return name !== 'assets/studio' && !r2SourceVideos.has(name);
          },
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
    watch: { ignored: ['**/.studio/**'] },
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'EXPERIMENTATION_'],
});
