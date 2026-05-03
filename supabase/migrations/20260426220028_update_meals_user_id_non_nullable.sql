-- update null rows to known test user
UPDATE meals
SET user_id = '44728848-87d7-45ea-99d2-e6600c49b8d1'
WHERE user_id IS NULL;

-- make user_id non-nullable
ALTER TABLE meals
ALTER COLUMN user_id SET NOT NULL;