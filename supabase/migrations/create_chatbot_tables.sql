create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  status text not null default 'active' check (status in ('active', 'closed')),
  source_page text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  sender_type text not null check (sender_type in ('user', 'bot', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_leads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  business_name text,
  service_interest text,
  budget_range text,
  timeline text,
  city text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'lost')),
  source text not null default 'Chatbot',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_sessions_visitor_idx on public.chat_sessions(visitor_id);
create index if not exists chat_messages_session_idx on public.chat_messages(session_id, created_at);
create index if not exists chat_leads_status_idx on public.chat_leads(status);
create index if not exists chat_leads_created_idx on public.chat_leads(created_at desc);
create index if not exists chat_leads_service_idx on public.chat_leads(service_interest);

create or replace function public.set_chat_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists chat_leads_set_updated_at on public.chat_leads;
create trigger chat_leads_set_updated_at
before update on public.chat_leads
for each row execute function public.set_chat_leads_updated_at();

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_leads enable row level security;

drop policy if exists "Admins can manage chat sessions" on public.chat_sessions;
create policy "Admins can manage chat sessions"
on public.chat_sessions
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage chat messages" on public.chat_messages;
create policy "Admins can manage chat messages"
on public.chat_messages
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage chat leads" on public.chat_leads;
create policy "Admins can manage chat leads"
on public.chat_leads
for all
using (public.is_admin())
with check (public.is_admin());

notify pgrst, 'reload schema';
