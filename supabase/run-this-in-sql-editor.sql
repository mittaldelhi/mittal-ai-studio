create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  whatsapp text,
  role text not null default 'customer' check (role in ('customer', 'support', 'admin')),
  created_at timestamptz not null default now()
);

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
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

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

insert into plans (name, yearly, features)
values
  ('Starter', 4999, '["1-page premium website","Google Business cleanup","Basic local SEO","Lead form and WhatsApp CTA"]'),
  ('Growth', 9999, '["5-page website","WhatsApp automation","Monthly SEO improvements","Lead dashboard","Offer campaign support"]'),
  ('AI Premium', 19999, '["Custom AI chatbot","Automation workflows","Dashboard and CRM setup","Content engine","Priority support"]')
on conflict (name) do update set yearly = excluded.yearly, features = excluded.features, active = true;

notify pgrst, 'reload schema';

select table_name
from information_schema.tables
where table_schema = 'public'
and table_name in (
  'profiles',
  'business_profiles',
  'plans',
  'enquiries',
  'orders',
  'payments',
  'support_threads',
  'support_messages',
  'complaints',
  'reviews',
  'feedback',
  'admin_notes',
  'whatsapp_conversations',
  'analytics_events'
)
order by table_name;
