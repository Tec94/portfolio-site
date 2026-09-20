import type { SupabaseClient } from '@supabase/supabase-js';

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: string;
  timeline: string;
  budgetRange: string;
  message: string;
  website?: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactSubmission, string>>;

export type ContactSubmissionResult =
  | { ok: true; submissionId: string }
  | {
      ok: false;
      code: 'configuration' | 'validation' | 'network' | 'server';
      message: string;
    };

let client: SupabaseClient | null = null;

async function getClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (!client) {
    const { createClient } = await import('@supabase/supabase-js');
    client ??= createClient(url, anonKey);
  }
  return client;
}

export function validateContactSubmission(submission: ContactSubmission): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (submission.name.trim().length < 2) errors.name = 'Enter your name.';
  if (!emailPattern.test(submission.email.trim())) errors.email = 'Enter a valid email address.';
  if (!submission.projectType) errors.projectType = 'Choose a project type.';
  if (!submission.timeline) errors.timeline = 'Choose a timeline.';
  if (!submission.budgetRange) errors.budgetRange = 'Choose a budget range.';
  if (submission.message.trim().length < 20) {
    errors.message = 'Share at least 20 characters about the project.';
  }
  if (submission.message.length > 2_000) errors.message = 'Keep project details under 2,000 characters.';
  return errors;
}

export async function submitContactSubmission(
  submission: ContactSubmission,
): Promise<ContactSubmissionResult> {
  const errors = validateContactSubmission(submission);
  if (Object.keys(errors).length > 0 || submission.website) {
    return {
      ok: false,
      code: 'validation',
      message: 'Review the highlighted fields and try again.',
    };
  }

  try {
    const supabase = await getClient();
    if (!supabase) {
      return {
        ok: false,
        code: 'configuration',
        message: 'The inquiry service is not configured. Please use the email option.',
      };
    }

    const { data, error } = await supabase.functions.invoke('submit-contact', {
      body: submission,
    });
    if (error) {
      return {
        ok: false,
        code: 'server',
        message: 'Your inquiry was not saved. Please retry or use email.',
      };
    }
    if (!data?.ok || typeof data.submissionId !== 'string') {
      return {
        ok: false,
        code: 'server',
        message: 'The server did not confirm your inquiry. Please use email.',
      };
    }
    return { ok: true, submissionId: data.submissionId };
  } catch {
    return {
      ok: false,
      code: 'network',
      message: 'A network issue prevented submission. Please retry or use email.',
    };
  }
}
