import { createRef } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import OmnitrixController, {
  type OmnitrixControllerHandle,
  type ProjectOption,
} from '../components/v2/OmnitrixController';

const projectOptions: ProjectOption[] = [
  { id: 'one', label: 'Project One', glyph: <span>1</span> },
  { id: 'two', label: 'Project Two', glyph: <span>2</span> },
  { id: 'three', label: 'Project Three', glyph: <span>3</span> },
];

afterEach(cleanup);

describe('OmnitrixController', () => {
  it('keeps opening, arming, and confirmation as separate actions', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onSelectorOpenChange = vi.fn();
    const controllerRef = createRef<OmnitrixControllerHandle>();
    const { container } = render(
      <OmnitrixController
        ref={controllerRef}
        projects={projectOptions}
        selectedId="one"
        onPreviewChange={vi.fn()}
        onConfirm={onConfirm}
        onSelectorOpenChange={onSelectorOpenChange}
        reducedMotion
      />,
    );

    controllerRef.current?.armSelection('one');
    expect(container.querySelector('.v2-omnitrix-controller')).toHaveAttribute(
      'data-mechanism',
      'covered',
    );

    await user.click(screen.getByRole('button', { name: 'Open project selector' }));
    expect(onSelectorOpenChange).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(container.querySelector('.v2-omnitrix-controller')).toHaveAttribute(
        'data-selector',
        'browsing',
      );
    });

    await waitFor(() => {
      expect(container.querySelector('.v2-omnitrix-controller')).toHaveAttribute(
        'data-mechanism',
        'armed',
      );
    });

    await user.click(screen.getByRole('button', { name: 'Open selected project: Project One' }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    expect(onConfirm).toHaveBeenCalledWith('one');
    await waitFor(() => {
      expect(container.querySelector('.v2-omnitrix-controller')).toHaveAttribute(
        'data-selector',
        'closed',
      );
      expect(container.querySelector('.v2-omnitrix-controller')).toHaveAttribute(
        'data-cover',
        'closed',
      );
      expect(container.querySelector('.v2-omnitrix-controller')).toHaveAttribute(
        'data-mechanism',
        'covered',
      );
    });
  });

  it('supports keyboard project browsing and announces selected position', async () => {
    const user = userEvent.setup();
    const onPreviewChange = vi.fn();
    const { container } = render(
      <OmnitrixController
        projects={projectOptions}
        selectedId="one"
        onPreviewChange={onPreviewChange}
        onConfirm={vi.fn()}
        reducedMotion
      />,
    );

    screen.getByRole('button', { name: 'Open project selector' }).focus();
    await waitFor(() => {
      expect(container.querySelector('.v2-omnitrix-controller')).toHaveAttribute(
        'data-selector',
        'browsing',
      );
    });
    await user.keyboard('{ArrowRight}');

    expect(onPreviewChange).toHaveBeenCalledWith('two');
    expect(screen.getByRole('option', { name: 'Project Two, 2 of 3' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('opens from hover and retracts the full mechanism after pointer exit', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <OmnitrixController
        projects={projectOptions}
        selectedId="one"
        onPreviewChange={vi.fn()}
        onConfirm={vi.fn()}
        reducedMotion
      />,
    );
    const controller = container.querySelector('.v2-omnitrix-controller');
    const watchControl = screen.getByRole('button', { name: 'Open project selector' });

    await user.hover(watchControl);
    await waitFor(() => {
      expect(controller).toHaveAttribute('data-selector', 'browsing');
      expect(controller).toHaveAttribute('data-cover', 'open');
      expect(controller).toHaveAttribute('data-mechanism', 'armed');
    });

    await user.unhover(watchControl);
    await waitFor(() => {
      expect(controller).toHaveAttribute('data-selector', 'closed');
      expect(controller).toHaveAttribute('data-cover', 'closed');
      expect(controller).toHaveAttribute('data-mechanism', 'covered');
    });
  });

  it('retracts the core independently while keeping the hovered frame uncovered', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <OmnitrixController
        projects={projectOptions}
        selectedId="one"
        onPreviewChange={vi.fn()}
        onConfirm={vi.fn()}
        reducedMotion
      />,
    );
    const controller = container.querySelector('.v2-omnitrix-controller');
    const watchZone = container.querySelector('.v2-omnitrix-watch-zone');
    const frame = container.querySelector('.v2-omnitrix-frame-hit-area');
    const watchControl = screen.getByRole('button', { name: 'Open project selector' });

    await user.hover(watchControl);
    await waitFor(() => {
      expect(controller).toHaveAttribute('data-cover', 'open');
      expect(controller).toHaveAttribute('data-mechanism', 'armed');
    });

    await user.hover(frame as Element);
    await waitFor(() => {
      expect(controller).toHaveAttribute('data-selector', 'browsing');
      expect(controller).toHaveAttribute('data-cover', 'open');
      expect(controller).toHaveAttribute('data-mechanism', 'covered');
    });

    fireEvent.pointerLeave(watchZone as Element, {
      pointerType: 'mouse',
      relatedTarget: document.body,
    });
    await waitFor(() => {
      expect(controller).toHaveAttribute('data-selector', 'closed');
      expect(controller).toHaveAttribute('data-cover', 'closed');
    });
  });
});
