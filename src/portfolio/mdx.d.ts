declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const frontmatter: unknown;
  export const portfolioSource: string;
  const MDXContent: ComponentType<Record<string, unknown>>;
  export default MDXContent;
}
