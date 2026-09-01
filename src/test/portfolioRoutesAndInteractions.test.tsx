import { createRef } from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary';
import { MediaViewer } from '../portfolio/components/MediaViewer';
import { ContactPage } from '../portfolio/pages/ContactPage';
import PreviewPortfolio from '../portfolio/PreviewPortfolio';
import {
  getLandingSectionUrl,
  getPreviewRedirect,
  isLegacyAppRoute,
  parseLandingSection,
} from '../portfolio/routeOwnership';

const media = [
  {
    type: 'image' as const,
    source: '/screenshots/credify.svg',
    alt: 'Credify overview',
    aspectRatio: { width: 16, height: 10 },
    narrativeRole: 'hero' as const,
  },
  {
    type: 'image' as const,
    source: '/screenshots/citizen-voice.svg',
    alt: 'Credify detail',
    aspectRatio: { width: 16, height: 10 },
    narrativeRole: 'detail' as const,
  },
];

describe('portfolio cutover routes', () => {
  it('preserves legacy routes while the new portfolio owns standard paths', () => {
    expect(isLegacyAppRoute('/v2')).toBe(true);
    expect(isLegacyAppRoute('/v2/about')).toBe(true);
    expect(isLegacyAppRoute('/classic')).toBe(true);
    expect(isLegacyAppRoute('/payment')).toBe(true);
    expect(isLegacyAppRoute('/services/consulting')).toBe(true);
    expect(isLegacyAppRoute('/')).toBe(false);
    expect(isLegacyAppRoute('/work/credify')).toBe(false);
    expect(isLegacyAppRoute('/services')).toBe(false);
  });

  it('redirects every preview path to its standard public equivalent', () => {
    expect(getPreviewRedirect('/preview')).toBe('/');
    expect(getPreviewRedirect('/preview/work/credify')).toBe('/work/credify');
    expect(getPreviewRedirect('/preview/lab', '?debug=1')).toBe('/lab?debug=1');
  });
});

describe('portfolio system pages', () => {
  it('renders fatal errors in the current tactile system', () => {
    const boundary = createRef<ErrorBoundary>();

    render(
      <ErrorBoundary ref={boundary}>
        <p>Ready</p>
      </ErrorBoundary>,
    );
    act(() => boundary.current?.setState({ hasError: true, error: new Error('test failure') }));

    expect(screen.getByRole('heading', {
      name: 'This page stopped before it was ready.',
    })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();
    expect(document.querySelector('.v2-system-page')).not.toBeInTheDocument();
  });
});

describe('portfolio overview shell', () => {
  it('keeps primary navigation centered around Work, Services, and About', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <PreviewPortfolio />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /^Jack Cao is a product engineer/ })).toBeInTheDocument();
    expect(document.querySelector('.portfolio-masthead')).not.toBeInTheDocument();
    expect(document.querySelector('[data-portfolio-section="contact"]')).not.toBeInTheDocument();
    expect(screen.queryByText('Product engineer who designs')).not.toBeInTheDocument();
    expect(document.querySelector('.portfolio-hero__availability')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'resume' })).toHaveAttribute(
      'href',
      'https://assets.jackcao.dev/resume/jack-cao-resume.pdf',
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/Tec94');
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/jackcao',
    );
    expect(screen.getByRole('link', { name: 'Book a 15-minute call' })).toHaveAttribute(
      'href',
      'https://cal.com/jack-cao/15min',
    );

    const dock = screen.getByRole('navigation', { name: 'Portfolio' });
    expect(within(dock).getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Work',
      'Services',
      'About',
    ]);
    expect(within(dock).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/#work',
      '/#services',
      '/#about',
    ]);
    const searchButton = within(dock).getByRole('button', { name: 'Search portfolio' });
    expect(searchButton).toHaveTextContent('');
    expect(document.getElementById('overview')).toHaveAttribute('data-portfolio-section', 'overview');
    expect(document.getElementById('featured')).not.toBeInTheDocument();
    expect(document.querySelector('.portfolio-hero__scroll-cue')).toHaveAttribute('href', '/#work');
    expect(document.getElementById('work')).toHaveAttribute('data-portfolio-section', 'work');
    expect(screen.queryByRole('heading', { name: 'My Projects' })).not.toBeInTheDocument();
    expect(document.getElementById('services')).toHaveAttribute('data-portfolio-section', 'services');
    expect(document.getElementById('about')).toHaveAttribute('data-portfolio-section', 'about');
    expect(document.getElementById('work')).toHaveClass('portfolio-content-shell', 'portfolio-split-layout');
    expect(document.getElementById('services')).toHaveClass('portfolio-content-shell', 'portfolio-split-layout');
    expect(document.getElementById('about')).toHaveClass('portfolio-content-shell', 'portfolio-split-layout');
    expect(document.querySelector('.portfolio-work-archive__sticky .portfolio-work-filters')).toBeInTheDocument();
    const servicesIndex = document.querySelector<HTMLElement>('.portfolio-services__index');
    expect(servicesIndex?.querySelector('#portfolio-services-heading')).toBeInTheDocument();
    expect(servicesIndex?.querySelector('ol')).not.toBeInTheDocument();
    expect(within(servicesIndex!).getByRole('link', { name: 'Book a call ↗' })).toHaveAttribute(
      'href',
      'https://cal.com/jack-cao/15min',
    );

    fireEvent.click(searchButton);
    const commandResults = screen.getByRole('listbox');
    expect(screen.getByPlaceholderText('Type a page or action')).toBeInTheDocument();
    const routeResults = commandResults.querySelectorAll('[id^="portfolio-command-route-"]');
    expect(routeResults).toHaveLength(6);
    routeResults.forEach((result) => {
      expect(result.querySelector('small')).toBeNull();
      expect(result.querySelector('.portfolio-command__kind')).toBeNull();
    });
    const actionResults = commandResults.querySelectorAll('[id^="portfolio-command-action-"]');
    expect(actionResults).toHaveLength(2);
    actionResults.forEach((result) => {
      expect(result.querySelector('small')).toBeNull();
      expect(result.querySelector('.portfolio-command__kind')).toBeNull();
    });
    expect(commandResults.querySelectorAll('[id^="portfolio-command-project-"]')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Close search' }));

    const themeToggle = screen.getByRole('button', { name: /Theme: (light|dark); switch to/ });
    const initialTheme = themeToggle.getAttribute('aria-label');
    expect(initialTheme).not.toContain('system');
    fireEvent.click(themeToggle);
    expect(themeToggle.getAttribute('aria-label')).not.toBe(initialTheme);

    const aboutToggle = screen.getByRole('button', { name: 'More about me' });
    expect(aboutToggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('portfolio-about-details')).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(aboutToggle);
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('portfolio-about-details')).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByText('University of Texas at Dallas')).toBeInTheDocument();
  });

  it('uses the landing Work section as the only work index', async () => {
    const projectView = render(
      <MemoryRouter initialEntries={['/work/credify']}>
        <PreviewPortfolio />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Back to index' })).toHaveAttribute('href', '/#work');
    expect(screen.getByRole('link', { name: 'Work index' })).toHaveAttribute('href', '/#work');
    projectView.unmount();

    const redirectedView = render(
      <MemoryRouter initialEntries={['/work']}>
        <PreviewPortfolio />
      </MemoryRouter>,
    );
    expect(await within(redirectedView.container).findByRole('heading', { level: 1, name: /^Jack Cao is a product engineer/ }))
      .toBeInTheDocument();
    redirectedView.unmount();
  });

  it('opens a project from the full list row with matched transition names', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    const originalStartViewTransition = document.startViewTransition;
    const startViewTransition = vi.fn((callback: () => void) => {
      callback();
      return {
        finished: Promise.resolve(),
        ready: Promise.resolve(),
        updateCallbackDone: Promise.resolve(),
        skipTransition: vi.fn(),
      } as ViewTransition;
    });
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    });
    const view = render(
      <MemoryRouter initialEntries={['/#work']}>
        <PreviewPortfolio />
      </MemoryRouter>,
    );

    const projectRow = within(view.container).getByRole('link', { name: /Credify.*Oct 2025/i });
    fireEvent.click(projectRow);
    expect(startViewTransition).toHaveBeenCalledOnce();

    const projectHeading = await within(view.container).findByRole('heading', { level: 1, name: 'Credify' });
    expect(projectHeading.style.viewTransitionName).toBe('portfolio-title-credify');
    expect(view.container.querySelector<HTMLElement>('.portfolio-project-preview__media')?.style.viewTransitionName)
      .toBe('portfolio-media-credify');
    view.unmount();
    play.mockRestore();
    if (originalStartViewTransition) {
      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: originalStartViewTransition,
      });
    } else {
      delete (document as unknown as { startViewTransition?: Document['startViewTransition'] })
        .startViewTransition;
    }
  });

  it('maps observed landing sections to stable URLs', () => {
    expect(getLandingSectionUrl('overview')).toBe('/');
    expect(getLandingSectionUrl('featured')).toBe('/#featured');
    expect(getLandingSectionUrl('work')).toBe('/#work');
    expect(getLandingSectionUrl('services')).toBe('/#services');
    expect(getLandingSectionUrl('about')).toBe('/#about');
    expect(parseLandingSection('about')).toBe('about');
    expect(parseLandingSection('unknown')).toBeUndefined();
  });

  it('updates the URL when a landing section enters the reading region', () => {
    const OriginalIntersectionObserver = window.IntersectionObserver;
    let observerCallback: IntersectionObserverCallback | undefined;

    class SectionObserverStub {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
      root = null;
      rootMargin = '';
      thresholds = [];
    }

    window.IntersectionObserver = SectionObserverStub as unknown as typeof IntersectionObserver;
    window.history.replaceState(window.history.state, '', '/');

    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <PreviewPortfolio />
      </MemoryRouter>,
    );
    const services = document.getElementById('services');
    expect(services).not.toBeNull();
    expect(observerCallback).toBeTypeOf('function');
    if (!services) throw new Error('Expected the Services landing section to render.');

    act(() => {
      observerCallback?.([
        {
          isIntersecting: true,
          intersectionRatio: 0.8,
          target: services,
        } as unknown as IntersectionObserverEntry,
      ], {} as IntersectionObserver);
    });

    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#services');

    view.unmount();
    window.history.replaceState(window.history.state, '', '/');
    window.IntersectionObserver = OriginalIntersectionObserver;
  });
});

describe('project media viewer', () => {
  it('supports keyboard navigation and dismissal', () => {
    const close = vi.fn();
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function show(this: HTMLDialogElement) {
      Object.defineProperty(this, 'open', { configurable: true, value: true });
      this.setAttribute('open', '');
    });
    vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function closeDialog(this: HTMLDialogElement) {
      Object.defineProperty(this, 'open', { configurable: true, value: false });
      this.removeAttribute('open');
    });

    render(<MediaViewer media={media} projectTitle="Credify" open onClose={close} />);
    expect(showModal).toHaveBeenCalled();
    expect(screen.getByText('01 / 02')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByText('02 / 02')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(screen.getByText('01 / 02')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close media viewer' }));
    expect(close).toHaveBeenCalled();
  });
});

describe('progressive contact', () => {
  it('reveals the inquiry form and focuses the first invalid field', async () => {
    render(<ContactPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a project inquiry' }));
    expect(screen.getByRole('button', { name: 'Send inquiry' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Send inquiry' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Review the highlighted fields.');
    await waitFor(() => expect(screen.getByLabelText('Name')).toHaveFocus());
  });
});
