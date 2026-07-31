import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import {
  submitContactSubmission,
  validateContactSubmission,
  type ContactSubmission,
} from '../lib/contactSubmissions';

const invoke = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ functions: { invoke } })),
}));

const validSubmission: ContactSubmission = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  projectType: 'product-engineering',
  timeline: '1-3-months',
  budgetRange: '5k-15k',
  message: 'I need help turning an existing prototype into a reliable first release.',
  website: '',
};

describe('contact submissions', () => {
  beforeEach(() => {
    invoke.mockReset();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'public-anon-key');
  });

  it('returns field-linked validation errors', () => {
    const errors = validateContactSubmission({
      name: '',
      email: 'bad-email',
      projectType: '',
      timeline: '',
      budgetRange: '',
      message: 'short',
    });
    expect(errors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      projectType: expect.any(String),
      timeline: expect.any(String),
      budgetRange: expect.any(String),
      message: expect.any(String),
    });
  });

  it('rejects the honeypot before making a request', async () => {
    const result = await submitContactSubmission({ ...validSubmission, website: 'spam.example' });
    expect(result).toMatchObject({ ok: false, code: 'validation' });
    expect(createClient).not.toHaveBeenCalled();
  });

  it('reports success only after the function confirms an insert', async () => {
    invoke.mockResolvedValue({ data: { ok: true, submissionId: 'submission-1' }, error: null });
    await expect(submitContactSubmission(validSubmission)).resolves.toEqual({
      ok: true,
      submissionId: 'submission-1',
    });
  });

  it('does not report success for a server error', async () => {
    invoke.mockResolvedValue({ data: null, error: new Error('failed') });
    const result = await submitContactSubmission(validSubmission);
    expect(result).toMatchObject({ ok: false, code: 'server' });
  });
});
