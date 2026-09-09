-- Demo diet restrictions and dietary plans for user 869d8252-7373-4741-b888-8ee8a17a46ec.
-- Safe to re-run: replaces the user's existing links.

DO $$
DECLARE
  demo_user_id UUID := '869d8252-7373-4741-b888-8ee8a17a46ec';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = demo_user_id) THEN
    RAISE EXCEPTION 'User % not found. Create the user before seeding diet data.', demo_user_id;
  END IF;

  INSERT INTO diet_restrictions (name, is_custom)
  VALUES
    ('Vegetarian', FALSE),
    ('No Peanuts', FALSE),
    ('Vegan', FALSE),
    ('Pescatarian', FALSE),
    ('No Gluten', FALSE),
    ('Dairy Free', FALSE),
    ('Halal', FALSE),
    ('Kosher', FALSE)
  ON CONFLICT (name) DO NOTHING;

  DELETE FROM user_diet_restrictions WHERE user_id = demo_user_id;
  DELETE FROM user_dietary_plans WHERE user_id = demo_user_id;

  INSERT INTO user_diet_restrictions (user_id, diet_id)
  SELECT demo_user_id, id
  FROM diet_restrictions
  WHERE name IN ('Vegetarian', 'No Peanuts', 'Dairy Free');

  INSERT INTO user_dietary_plans (user_id, dietary_plan_id)
  SELECT demo_user_id, id
  FROM dietary_plans
  WHERE name IN ('Mediterranean', 'Pescatarian');
END $$;
