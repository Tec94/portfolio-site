import type { Plugin } from 'vite';

export function portfolioMdxSourcePlugin(): Plugin {
  return {
    name: 'portfolio-mdx-source',
    enforce: 'pre',
    transform(source, id) {
      const [pathname, query] = id.split('?');
      if (query || !pathname.endsWith('.mdx')) return null;
      return {
        code: `${source}\nexport const portfolioSource = ${JSON.stringify(source)};`,
        map: null,
      };
    },
  };
}

