export function isLegacyAppRoute(pathname: string) {
  return (
    pathname === '/classic' ||
    pathname === '/payment' ||
    pathname === '/v2' ||
    pathname.startsWith('/v2/') ||
    pathname.startsWith('/services/')
  );
}

export function getPreviewRedirect(pathname: string, search = '') {
  const destination = pathname.replace(/^\/preview/, '') || '/';
  return `${destination}${search}`;
}

const landingSections = ['overview', 'featured', 'work', 'services', 'about', 'writing'] as const;

export type LandingSection = (typeof landingSections)[number];

export function parseLandingSection(value: string) {
  return landingSections.find((section) => section === value);
}

export function getLandingSectionUrl(section: LandingSection) {
  return section === 'overview' ? '/' : `/#${section}`;
}
