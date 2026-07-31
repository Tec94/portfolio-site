import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type SubmissionBody = {
  name?: unknown;
  email?: unknown;
  projectType?: unknown;
  timeline?: unknown;
  budgetRange?: unknown;
  message?: unknown;
  website?: unknown;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405);

  let body: SubmissionBody;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON.' }, 400);
  }

  if (clean(body.website)) return json({ ok: false, error: 'Invalid submission.' }, 400);

  const submission = {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    project_type: clean(body.projectType),
    timeline: clean(body.timeline),
    budget_range: clean(body.budgetRange),
    message: clean(body.message),
  };
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email);
  const valid =
    submission.name.length >= 2 &&
    submission.name.length <= 120 &&
    validEmail &&
    submission.email.length <= 254 &&
    submission.project_type.length >= 2 &&
    submission.project_type.length <= 80 &&
    submission.timeline.length >= 2 &&
    submission.timeline.length <= 80 &&
    submission.budget_range.length >= 2 &&
    submission.budget_range.length <= 80 &&
    submission.message.length >= 20 &&
    submission.message.length <= 2000;

  if (!valid) return json({ ok: false, error: 'Validation failed.' }, 422);

  const url = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceRoleKey) {
    return json({ ok: false, error: 'Service unavailable.' }, 503);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(submission)
    .select('id')
    .single();

  if (error || !data) return json({ ok: false, error: 'Submission was not saved.' }, 500);
  return json({ ok: true, submissionId: data.id }, 201);
});
