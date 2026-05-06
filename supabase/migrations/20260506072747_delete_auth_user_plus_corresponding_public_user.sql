-- first remove orphan rows if any (required before FK)
DELETE FROM public.users pu
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users au WHERE au.id = pu.id
);

-- then enforce parent-child relationship
ALTER TABLE public.users
ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) -- users_id_fkey is the NAME of the constraint
REFERENCES auth.users(id)
ON DELETE CASCADE;