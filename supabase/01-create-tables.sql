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
