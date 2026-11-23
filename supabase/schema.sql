-- ============================================================================
-- PACKSACH DATABASE SCHEMA & ROW LEVEL SECURITY (SUPABASE POSTGRESQL)
-- ============================================================================

-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  avatar_url text,
  dietary_preferences text[] default '{}',
  allergies text[] default '{}',
  daily_calorie_target integer,
  max_sugar_daily_grams numeric(4,1),
  max_sodium_daily_mg integer,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Row Level Security (RLS) for Profiles
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 2. USER SCANS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.user_scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id text not null,
  product_name text not null,
  brand text not null,
  category text not null,
  health_score numeric(3,1) not null,
  sugar_teaspoons numeric(4,1) not null,
  sodium_mg integer not null,
  image_url text,
  product_data jsonb not null,
  scanned_at timestamptz default now() not null
);

-- Index for rapid query by user
create index if not exists idx_user_scans_user_id on public.user_scans (user_id, scanned_at desc);

-- Row Level Security (RLS) for User Scans
alter table public.user_scans enable row level security;

create policy "Users can view their own scans"
  on public.user_scans for select
  using (auth.uid() = user_id);

create policy "Users can record new scans"
  on public.user_scans for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own scans"
  on public.user_scans for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 3. SAVED SWAPS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.user_saved_swaps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  swap_id text not null,
  swap_data jsonb not null,
  original_product jsonb not null,
  created_at timestamptz default now() not null
);

-- Index for user saved swaps
create index if not exists idx_saved_swaps_user_id on public.user_saved_swaps (user_id, created_at desc);

-- Row Level Security (RLS) for Saved Swaps
alter table public.user_saved_swaps enable row level security;

create policy "Users can view their own saved swaps"
  on public.user_saved_swaps for select
  using (auth.uid() = user_id);

create policy "Users can add saved swaps"
  on public.user_saved_swaps for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own saved swaps"
  on public.user_saved_swaps for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 4. AUTOMATIC PROFILE CREATION TRIGGER
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger firing on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
