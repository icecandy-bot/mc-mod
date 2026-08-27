create table if not exists public.mod_selections (
  device_id text primary key,
  selected_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.mod_selections enable row level security;

drop policy if exists "Allow anonymous read by device id" on public.mod_selections;
create policy "Allow anonymous read by device id"
on public.mod_selections
for select
to anon, authenticated
using (true);

drop policy if exists "Allow anonymous insert" on public.mod_selections;
create policy "Allow anonymous insert"
on public.mod_selections
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow anonymous update" on public.mod_selections;
create policy "Allow anonymous update"
on public.mod_selections
for update
to anon, authenticated
using (true)
with check (true);

grant select, insert, update on public.mod_selections to anon, authenticated;
