create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  whatsapp text,
  role text not null default 'customer' check (role in ('customer', 'support', 'admin')),
  created_at timestamptz not null default now()
);

alter table profiles add column if not exists avatar_url text;

create table if not exists business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text,
  business_type text,
  address text,
  city text,
  service_interest text,
  created_at timestamptz not null default now()
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  yearly integer,
  note text,
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table plans add column if not exists note text;
alter table plans add column if not exists featured boolean not null default false;
alter table plans add column if not exists sort_order integer not null default 0;

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  business text not null,
  phone text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_name text not null,
  amount integer not null,
  currency text not null default 'INR',
  razorpay_order_id text unique,
  status text not null default 'created',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  plan_name text not null,
  amount integer not null,
  currency text not null default 'INR',
  razorpay_order_id text,
  razorpay_payment_id text unique,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists support_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists support_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references support_threads(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  sender_role text not null default 'customer',
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  status text not null default 'open',
  admin_response text,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_name text not null,
  message text not null,
  status text not null default 'requested',
  created_at timestamptz not null default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists admin_notes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  target_table text not null,
  target_id uuid,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  last_message text not null,
  raw_payload jsonb not null default '{}'::jsonb,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_name text not null,
  category text not null,
  city text,
  live_url text not null,
  description text not null,
  result text not null,
  tags jsonb not null default '[]'::jsonb,
  services_delivered jsonb not null default '[]'::jsonb,
  image_url text,
  active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table business_profiles enable row level security;
alter table plans enable row level security;
alter table enquiries enable row level security;
alter table orders enable row level security;
alter table payments enable row level security;
alter table support_threads enable row level security;
alter table support_messages enable row level security;
alter table complaints enable row level security;
alter table reviews enable row level security;
alter table feedback enable row level security;
alter table admin_notes enable row level security;
alter table whatsapp_conversations enable row level security;
alter table analytics_events enable row level security;
alter table portfolio_projects enable row level security;
alter table site_settings enable row level security;

create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role in ('admin', 'support')
  );
$$;

drop policy if exists "profiles own read" on profiles;
drop policy if exists "profiles own update" on profiles;
drop policy if exists "business own crud" on business_profiles;
drop policy if exists "plans public read" on plans;
drop policy if exists "admin plans write" on plans;
drop policy if exists "enquiries own or admin" on enquiries;
drop policy if exists "orders own or admin" on orders;
drop policy if exists "payments own or admin" on payments;
drop policy if exists "threads own or admin" on support_threads;
drop policy if exists "messages own or admin" on support_messages;
drop policy if exists "complaints own or admin" on complaints;
drop policy if exists "reviews own or admin" on reviews;
drop policy if exists "feedback own or admin" on feedback;
drop policy if exists "admin notes only" on admin_notes;
drop policy if exists "whatsapp admin only" on whatsapp_conversations;
drop policy if exists "analytics admin only" on analytics_events;
drop policy if exists "portfolio public read" on portfolio_projects;
drop policy if exists "portfolio admin write" on portfolio_projects;
drop policy if exists "site settings public read" on site_settings;
drop policy if exists "site settings admin write" on site_settings;

create policy "profiles own read" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles own update" on profiles for update using (id = auth.uid() or is_admin());
create policy "business own crud" on business_profiles for all using (user_id = auth.uid() or is_admin());
create policy "plans public read" on plans for select using (active = true or is_admin());
create policy "admin plans write" on plans for all using (is_admin());
create policy "enquiries own or admin" on enquiries for all using (user_id = auth.uid() or is_admin());
create policy "orders own or admin" on orders for all using (user_id = auth.uid() or is_admin());
create policy "payments own or admin" on payments for all using (user_id = auth.uid() or is_admin());
create policy "threads own or admin" on support_threads for all using (user_id = auth.uid() or is_admin());
create policy "messages own or admin" on support_messages for all using (
  exists(select 1 from support_threads where support_threads.id = support_messages.thread_id and (support_threads.user_id = auth.uid() or is_admin()))
);
create policy "complaints own or admin" on complaints for all using (user_id = auth.uid() or is_admin());
create policy "reviews own or admin" on reviews for all using (user_id = auth.uid() or is_admin());
create policy "feedback own or admin" on feedback for all using (user_id = auth.uid() or is_admin());
create policy "admin notes only" on admin_notes for all using (is_admin());
create policy "whatsapp admin only" on whatsapp_conversations for all using (is_admin());
create policy "analytics admin only" on analytics_events for all using (is_admin());
create policy "portfolio public read" on portfolio_projects for select using (active = true or is_admin());
create policy "portfolio admin write" on portfolio_projects for all using (is_admin());
create policy "site settings public read" on site_settings for select using (true);
create policy "site settings admin write" on site_settings for all using (is_admin());

insert into plans (name, yearly, note, features, featured, sort_order)
values
  ('Starter', 4999, 'For shops, freelancers, and single-location businesses starting online.', '["1-page premium website","Google Business cleanup","Basic local SEO","Lead form and WhatsApp CTA"]', false, 10),
  ('Growth', 9999, 'The best fit for growing businesses that need automation.', '["5-page website","WhatsApp automation","Monthly SEO improvements","Lead dashboard","Offer campaign support"]', true, 20),
  ('AI Premium', 19999, 'For serious operators who want a complete AI-enabled growth system.', '["Custom AI chatbot","Automation workflows","Dashboard and CRM setup","Content engine","Priority support"]', false, 30)
on conflict (name) do update set yearly = excluded.yearly, note = excluded.note, features = excluded.features, featured = excluded.featured, sort_order = excluded.sort_order, active = true;

insert into portfolio_projects (title, client_name, category, city, live_url, description, result, tags, services_delivered, active, featured, sort_order)
values
  (
    'Deepak Mittal Portfolio',
    'Deepak Mittal',
    'Founder Portfolio',
    'India',
    'https://deepakmittal.vercel.app',
    'Business technology consultant portfolio positioning 15 years of IBM and Concentrix process expertise for local business growth.',
    'Founder-led personal brand',
    '["Portfolio","Personal Brand","Consulting"]'::jsonb,
    '["Portfolio website","Founder positioning","Service storytelling"]'::jsonb,
    true,
    true,
    5
  ),
  (
    'Chandra Mehndi Art',
    'Chandra Mehndi Art',
    'Mehndi Artist',
    'Gurgaon',
    'https://Chandramehndiart.vercel.app',
    'Professional mehndi and henna artist website for bridal, Arabic, and contemporary designs.',
    'Premium booking-ready artist website',
    '["Website","Local SEO","Booking CTA"]'::jsonb,
    '["Responsive website","Service pages","SEO metadata","Schema markup"]'::jsonb,
    true,
    true,
    10
  ),
  (
    'Seema Rajput',
    'Seema Rajput',
    'Beautician and Model',
    'India',
    'https://seemarajput.vercel.app',
    'Personal brand website for a professional beautician and model offering bridal makeup, party makeup, photoshoot makeup, and brand modeling.',
    'Elegant personal brand portfolio',
    '["Portfolio","Beauty","Personal Brand"]'::jsonb,
    '["Responsive website","Personal brand sections","Service showcase","SEO metadata"]'::jsonb,
    true,
    true,
    20
  )
on conflict do nothing;
