import type { ArticleRecord } from '../../portfolio/content/manifest';

function FixturePost() {
  return <>
    <p>I spent a year treating the database as a place to put things and a place to get things. A nearby-reports query changed how I thought about that boundary.</p>
    <aside><small>01</small>Sample margin note for checking the article layout.</aside>
    <pre><code>{'select id, title\nfrom reports\nwhere ST_DWithin(\n  geom::geography,\n  ST_MakePoint(-96.797, 32.7767)::geography,\n  120\n);'}</code></pre>
    <aside><small>02</small>The <code>::geography</code> cast makes the units explicit.</aside>
    <p>The interesting part was moving the question closer to the data.</p>
  </>;
}

// Browser and interaction fixtures only; these are never published content.
export const writingFixtures: ArticleRecord[] = [
  { slug: 'cal', title: 'Cal.com embeds are fine, actually', summary: 'I expected to fight it. I did not have to fight it.', publicationDate: '2026-01-02', format: 'Note', readingMinutes: 2, series: 'Things that bit me' },
  { slug: 'slack', title: 'Building the Slack agent nobody asked for', summary: 'A volunteer-events bot, and what a demo owes its audience.', publicationDate: '2025-12-02', format: 'Write-up', readingMinutes: 7 },
  { slug: 'postgis', title: 'PostGIS made me like SQL again', summary: 'One cast, one index, zero application code.', publicationDate: '2025-11-03', format: 'Note', readingMinutes: 3, series: 'Things that bit me' },
  { slug: 'credify', title: 'Shipping Credify in 24 hours, mostly awake', summary: 'What we cut, what we kept, and the call that ate three hours.', publicationDate: '2025-10-02', format: 'Write-up', readingMinutes: 6 },
].map((entry) => ({
  ...entry,
  format: entry.format as ArticleRecord['format'],
  tags: ['SQL', 'PostGIS'],
  status: 'published',
  kind: 'article',
  href: `/writing/${entry.slug}`,
  headings: [],
  bodyText: 'Sample article content.',
  Content: FixturePost,
}));
