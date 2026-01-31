-- Create the leads table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  email text,
  phone text,
  company text,
  quiz_results jsonb,
  status text default 'new'::text,
  notes text,
  tags text[]
);

-- Enable Row Level Security (RLS)
alter table public.leads enable row level security;

-- Create a policy that allows anonymous inserts (for the public quiz)
create policy "Allow anonymous inserts"
  on public.leads
  for insert
  with check (true);

-- Create a policy that allows read access to authenticated users (admins)
-- Note: You will need to set up Authentication in Supabase for this to be secure in production.
-- For now, we will allow public read for development ease, but STRONGLY ADVISE securing this before production.
-- ideally: create policy "Allow read access to admins" on public.leads for select using (auth.role() = 'authenticated');
create policy "Allow public read access (DEV ONLY)"
  on public.leads
  for select
  using (true);

-- Create a policy that allows updates to authenticated users (admins)
create policy "Allow public update access (DEV ONLY)"
  on public.leads
  for update
  using (true);
