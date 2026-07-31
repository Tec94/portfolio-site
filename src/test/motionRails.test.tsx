import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PreviewRail, type PreviewRailItem } from '../components/v2/PreviewRail';
import { SocialActionBar, type SocialAction } from '../components/v2/SocialActionBar';

const previewItems: PreviewRailItem[] = [
  { id: 'one', label: 'Project one', href: '#one', preview: <span>One preview</span> },
  { id: 'two', label: 'Project two', href: '#two', preview: <span>Two preview</span> },
];

const socialItems: SocialAction[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/example', icon: <span>G</span> },
  { id: 'email', label: 'Email', href: 'mailto:hello@example.com', icon: <span>E</span> },
];

describe('motion rails', () => {
  it('keeps project rail links semantic and delegates project selection', async () => {
    const user = userEvent.setup();
    const onItemSelect = vi.fn();

    render(
      <PreviewRail
        items={previewItems}
        activeId="one"
        ariaCurrent="step"
        ariaLabel="Project gallery"
        onItemSelect={onItemSelect}
      />,
    );

    expect(screen.getByRole('link', { name: 'Project one' })).toHaveAttribute(
      'aria-current',
      'step',
    );
    await user.click(screen.getByRole('link', { name: 'Project two' }));
    expect(onItemSelect).toHaveBeenCalledWith('two');
  });

  it('exposes each social destination as a named link', () => {
    render(<SocialActionBar items={socialItems} ariaLabel="Social links" />);

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/example',
    );
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:hello@example.com',
    );
  });
});
