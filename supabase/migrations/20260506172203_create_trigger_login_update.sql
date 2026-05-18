create or replace function public.touch_user_on_auth_signin()
returns trigger
language plpgsql
security definer
as $$
begin
    update public.users
    set updated_at = now()
    where id = new.id;

    return new;
end;
$$;

drop trigger if exists on_auth_user_signed_in on auth.users;

create trigger on_auth_user_signed_in
after update of last_sign_in_at on auth.users
for each row
when (old.last_sign_in_at is distinct from new.last_sign_in_at)
execute procedure public.touch_user_on_auth_signin();