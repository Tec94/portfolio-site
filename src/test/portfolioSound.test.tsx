import { act, cleanup, createEvent, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PreviewPortfolio from '../portfolio/PreviewPortfolio';
import { PortfolioSoundProvider, usePortfolioSound } from '../portfolio/providers/SoundProvider';
import { ContactPage } from '../portfolio/pages/ContactPage';
import * as submissions from '../lib/contactSubmissions';

const cues = vi.hoisted(() => ({
  cuelume: vi.fn(), enabled: vi.fn(), volume: vi.fn(),
  typing: vi.fn(), typingEnabled: vi.fn(), stop: vi.fn(), destroy: vi.fn(),
}));
vi.mock('cuelume', () => ({ play: cues.cuelume, setEnabled: cues.enabled, setVolume: cues.volume }));
vi.mock('uisfx', () => ({ createUISFX: vi.fn(() => ({
  play: cues.typing, setEnabled: cues.typingEnabled, stopAll: cues.stop, destroy: cues.destroy,
})) }));

let paper: { source: string; volume: number; player: HTMLMediaElement }[];
beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, 'localStorage', { configurable: true, value: { getItem: () => null, setItem: vi.fn() } });
  paper = [];
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    paper.push({ source: this.src, volume: this.volume, player: this });
    Object.defineProperty(this, 'paused', { configurable: true, value: false });
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'paused', { configurable: true, value: true });
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function renderSite(path = '/') {
  return render(<MemoryRouter initialEntries={[path]}><PreviewPortfolio /></MemoryRouter>);
}
function hover(element: Element) {
  const event = createEvent.pointerOver(element);
  Object.defineProperty(event, 'pointerType', { value: 'mouse' });
  fireEvent(element, event);
}

describe('portfolio sound hierarchy', () => {
  it('uses one paper-slide for project and back navigation, with no click-layered press or rustle', async () => {
    renderSite('/#work');
    fireEvent.click(screen.getByRole('link', { name: /Credify.*Oct 2025/i }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Credify' })).toBeInTheDocument();
    expect(paper).toHaveLength(1);
    expect(paper[0].source).toContain('/audio/normalized/paper-slide.mp3');
    expect(cues.cuelume).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('link', { name: 'Back to index' }));
    expect(paper).toHaveLength(2);
    expect(cues.cuelume).not.toHaveBeenCalled();
  });

  it('keeps compact-control hover silent and uses press only on a changed selection', () => {
    renderSite('/#work');
    const showcase = screen.getByRole('button', { name: 'Showcase view' });
    const theme = screen.getByRole('button', { name: /Theme:/ });
    hover(showcase);
    hover(theme);
    hover(screen.getByRole('button', { name: 'Interface sound on' }));
    expect(paper).toHaveLength(0);
    expect(cues.cuelume).not.toHaveBeenCalled();
    expect(cues.typing).not.toHaveBeenCalled();
    fireEvent.click(showcase);
    fireEvent.click(showcase);
    fireEvent.click(theme);
    expect(cues.cuelume.mock.calls).toEqual([['press'], ['press']]);
  });

  it('uses Zen typing for search entry, button hover, and keyboard selection, but paper for visiting a result', () => {
    renderSite();
    fireEvent.click(screen.getByRole('button', { name: 'Search portfolio' }));
    expect(cues.cuelume.mock.calls).toEqual([['press']]);
    const input = screen.getByRole('combobox');
    const service = within(screen.getByRole('listbox')).getByRole('option', { name: 'Services' });
    hover(service);
    expect(cues.typing).toHaveBeenCalledTimes(1);
    fireEvent.pointerMove(service);
    fireEvent.pointerMove(service);
    expect(cues.typing).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'a' });
    expect(cues.typing).toHaveBeenCalledTimes(3);
    expect(cues.typing).toHaveBeenLastCalledWith('typing', { cooldownMs: 28, retrigger: 'overlap' });
    fireEvent.click(service);
    expect(paper).toHaveLength(1);
    expect(cues.cuelume.mock.calls).toEqual([['press']]);
    fireEvent.click(screen.getByRole('button', { name: 'Search portfolio' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close search' }));
    expect(paper).toHaveLength(1);
    expect(cues.cuelume.mock.calls).toEqual([['press'], ['press'], ['press']]);
  });

  it('uses press for viewer actions and stays silent when selecting the current thumbnail', () => {
    renderSite('/work/credify');
    fireEvent.click(screen.getByRole('button', { name: /Open Credify media viewer/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Show media 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next media' }));
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    fireEvent.click(screen.getByRole('button', { name: 'Close media viewer' }));
    expect(cues.cuelume.mock.calls).toEqual([['press'], ['press'], ['press'], ['press']]);
    expect(paper).toHaveLength(0);
  });

  it('reuses the preview voice, replaces it on navigation, and respects mute in retained callbacks', () => {
    let sound!: ReturnType<typeof usePortfolioSound>;
    function Probe() { sound = usePortfolioSound(); return null; }
    render(<PortfolioSoundProvider><Probe /></PortfolioSoundProvider>);
    const retainedPlay = sound.play;
    act(() => { sound.playProjectPreview(); sound.playProjectPreview(); sound.play('navigation'); });
    expect(paper).toHaveLength(2);
    expect(paper[0].player).toBe(paper[1].player);
    expect(paper[0].volume).toBeLessThan(paper[1].volume);
    act(() => sound.setEnabled(false));
    expect(paper[0].player.paused).toBe(true);
    expect(cues.stop).toHaveBeenCalled();
    act(() => { retainedPlay('success'); sound.playTyping(); sound.playProjectPreview(); });
    expect(paper).toHaveLength(2);
    expect(cues.cuelume).not.toHaveBeenCalled();
    expect(cues.typing).not.toHaveBeenCalled();
    act(() => sound.toggle());
    expect(cues.cuelume.mock.calls).toEqual([['press']]);
    act(() => sound.toggle());
    expect(cues.cuelume).toHaveBeenCalledTimes(1);
  });

  it('plays success/error only after the corresponding clipboard result', async () => {
    let finish!: () => void;
    const writeText = vi.fn().mockImplementation(() => new Promise<void>((resolve) => { finish = resolve; }));
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<ContactPage />, { wrapper: PortfolioSoundProvider });
    fireEvent.click(screen.getByRole('button', { name: /Copy email/ }));
    expect(cues.cuelume.mock.calls).toEqual([['press']]);
    await act(async () => finish());
    expect(cues.cuelume.mock.calls).toEqual([['press'], ['success']]);
    writeText.mockRejectedValueOnce(new Error('blocked'));
    fireEvent.click(screen.getByRole('button', { name: /Copy email/ }));
    await waitFor(() => expect(cues.cuelume).toHaveBeenLastCalledWith('error'));
  });

  it.each([true, false])('reports the actual form outcome (success=%s)', async (ok) => {
    const submit = vi.spyOn(submissions, 'submitContactSubmission').mockResolvedValue(ok
      ? { ok: true, submissionId: 'test' } : { ok: false, code: 'network', message: 'Try again.' });
    render(<ContactPage />, { wrapper: PortfolioSoundProvider });
    fireEvent.click(screen.getByRole('button', { name: 'Send inquiry' }));
    expect(submit).not.toHaveBeenCalled();
    expect(cues.cuelume.mock.calls).toEqual([['press'], ['error']]);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'I would like help building a useful product.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send inquiry' }));
    await waitFor(() => expect(cues.cuelume).toHaveBeenLastCalledWith(ok ? 'success' : 'error'));
    expect(submit).toHaveBeenCalledOnce();
    expect(cues.cuelume.mock.calls).toEqual([['press'], ['error'], ['press'], [ok ? 'success' : 'error']]);
  });
});


