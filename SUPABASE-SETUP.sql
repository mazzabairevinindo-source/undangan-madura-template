-- UNDANGAN MADURA: SUPABASE SETUP
-- Jalankan SEKALI di Supabase Dashboard > SQL Editor > New query.
-- Tabel hanya dapat ditulis oleh admin yang login (authenticated).
-- Tamu hanya dapat membaca undangan tertentu melalui RPC get_public_invitation.

create table if not exists public.invitations (
  slug text primary key check (char_length(slug) between 1 and 80),
  recipient_name text not null default '',
  invitation jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invitations enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.invitations to authenticated;

drop policy if exists "Admin can read invitations" on public.invitations;
create policy "Admin can read invitations"
  on public.invitations
  for select
  to authenticated
  using (true);

drop policy if exists "Admin can create invitations" on public.invitations;
create policy "Admin can create invitations"
  on public.invitations
  for insert
  to authenticated
  with check (
    jsonb_typeof(invitation) = 'object'
    and char_length(slug) between 1 and 80
  );

drop policy if exists "Admin can update invitations" on public.invitations;
create policy "Admin can update invitations"
  on public.invitations
  for update
  to authenticated
  using (true)
  with check (
    jsonb_typeof(invitation) = 'object'
    and char_length(slug) between 1 and 80
  );

create or replace function public.get_public_invitation(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'slug', slug,
    'recipient_name', recipient_name,
    'invitation', invitation
  )
  from public.invitations
  where slug = p_slug
  limit 1;
$$;

revoke all on function public.get_public_invitation(text) from public;
grant execute on function public.get_public_invitation(text) to anon, authenticated;

-- Tabel tidak dapat dibaca langsung oleh tamu anonim. Mereka hanya dapat
-- memanggil fungsi di atas dengan slug yang ada pada tautan undangan.
