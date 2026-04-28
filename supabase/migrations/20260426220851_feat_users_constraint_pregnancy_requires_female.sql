ALTER TABLE users
ADD CONSTRAINT users_pregnancy_requires_female
CHECK (
  is_pregnant IS NOT TRUE
  OR sex IS NOT DISTINCT FROM 'female'
);