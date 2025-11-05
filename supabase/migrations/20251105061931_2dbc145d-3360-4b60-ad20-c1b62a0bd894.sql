-- Users profile table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('user','authority','admin')) default 'user',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Categories for complaints
create table if not exists public.categories (
  id bigserial primary key,
  name text unique not null,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

-- Complaints table
create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text not null,
  category_id bigint references public.categories(id) on delete set null,
  status text check (status in ('NEW','ACKNOWLEDGED','IN_PROGRESS','RESOLVED','REJECTED')) default 'NEW',
  priority text check (priority in ('LOW','MEDIUM','HIGH')) default 'LOW',
  location_lng double precision not null,
  location_lat double precision not null,
  municipality text,
  ward text,
  photos text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.complaints enable row level security;

-- Comments on complaints
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid references public.complaints(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  attachments text[] default '{}',
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

-- Indexes for performance
create index if not exists idx_complaints_status on public.complaints(status);
create index if not exists idx_complaints_category on public.complaints(category_id);
create index if not exists idx_complaints_created_at on public.complaints(created_at desc);
create index if not exists idx_complaints_user on public.complaints(user_id);
create index if not exists idx_comments_complaint on public.comments(complaint_id);

-- RLS Policies
-- Profiles: users read/update self
create policy "profiles self read" on public.profiles
for select using (auth.uid() = id);

create policy "profiles self update" on public.profiles
for update using (auth.uid() = id);

-- Categories: everyone can read, only admins can modify
create policy "categories read all" on public.categories
for select using (true);

create policy "categories admin insert" on public.categories
for insert with check (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "categories admin update" on public.categories
for update using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "categories admin delete" on public.categories
for delete using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Complaints: everyone can read
create policy "complaints read all" on public.complaints
for select using (true);

-- Authenticated users can insert their own complaints
create policy "complaints owner insert" on public.complaints
for insert with check (auth.uid() = user_id);

-- Owner can update their own complaints
create policy "complaints owner update" on public.complaints
for update using (auth.uid() = user_id);

-- Authority/admin can update any complaint
create policy "authority update any" on public.complaints
for update using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('authority','admin'))
);

-- Comments: everyone can read
create policy "comments read all" on public.comments
for select using (true);

-- Authenticated users can insert comments
create policy "comments insert auth" on public.comments
for insert with check (auth.uid() = author_id);

-- Author can update/delete their own comments
create policy "comments owner update" on public.comments
for update using (auth.uid() = author_id);

create policy "comments owner delete" on public.comments
for delete using (auth.uid() = author_id);

-- Trigger for profiles creation on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updated_at on complaints
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_complaints_updated_at
before update on public.complaints
for each row execute function public.update_updated_at_column();

-- Insert default categories
insert into public.categories (name) values
  ('Potholes'),
  ('Street Lighting'),
  ('Garbage Collection'),
  ('Water Supply'),
  ('Drainage'),
  ('Traffic Signals'),
  ('Public Transportation'),
  ('Parks & Recreation'),
  ('Noise Pollution'),
  ('Other')
on conflict (name) do nothing;