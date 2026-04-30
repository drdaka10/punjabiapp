-- Run this in the Supabase SQL editor for your project.
-- Tables track per-user progress and SRS state for vocabulary cards.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  score int not null default 0,
  primary key (user_id, lesson_id)
);

-- One row per (user, vocab card). SM-2 fields.
create table if not exists srs_cards (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  ease real not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  due_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table profiles enable row level security;
alter table lesson_progress enable row level security;
alter table srs_cards enable row level security;

create policy "own profile read" on profiles
  for select using (auth.uid() = id);
create policy "own profile upsert" on profiles
  for insert with check (auth.uid() = id);
create policy "own profile update" on profiles
  for update using (auth.uid() = id);

create policy "own lesson progress read" on lesson_progress
  for select using (auth.uid() = user_id);
create policy "own lesson progress write" on lesson_progress
  for insert with check (auth.uid() = user_id);
create policy "own lesson progress update" on lesson_progress
  for update using (auth.uid() = user_id);

create policy "own srs read" on srs_cards
  for select using (auth.uid() = user_id);
create policy "own srs write" on srs_cards
  for insert with check (auth.uid() = user_id);
create policy "own srs update" on srs_cards
  for update using (auth.uid() = user_id);
