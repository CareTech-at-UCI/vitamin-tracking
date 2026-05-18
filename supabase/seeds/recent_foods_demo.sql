-- Demo meals for the Recent Foods page (user 869d8252-7373-4741-b888-8ee8a17a46ec).
-- Safe to re-run: removes prior demo rows for these dates before inserting.

DO $$
DECLARE
  demo_user_id UUID := '869d8252-7373-4741-b888-8ee8a17a46ec';
  meal_id INTEGER;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = demo_user_id) THEN
    RAISE EXCEPTION 'User % not found. Create the user before seeding recent foods.', demo_user_id;
  END IF;

  DELETE FROM meals
  WHERE user_id = demo_user_id
    AND consumed_at >= TIMESTAMPTZ '2026-05-07 00:00:00+00'
    AND consumed_at < TIMESTAMPTZ '2026-05-09 00:00:00+00';

  -- 2026-05-08
  INSERT INTO meals (user_id, type, consumed_at, notes)
  VALUES (demo_user_id, 'breakfast', '2026-05-08 08:15:00+00', 'Demo seed')
  RETURNING id INTO meal_id;
  INSERT INTO meal_items (meal_id, item_name, weight) VALUES
    (meal_id, 'Greek yogurt with honey', 180),
    (meal_id, 'Banana', 120),
    (meal_id, 'Whole grain toast', 70);

  INSERT INTO meals (user_id, type, consumed_at, notes)
  VALUES (demo_user_id, 'lunch', '2026-05-08 12:30:00+00', 'Demo seed')
  RETURNING id INTO meal_id;
  INSERT INTO meal_items (meal_id, item_name, weight) VALUES
    (meal_id, 'Grilled chicken salad', 320),
    (meal_id, 'Brown rice', 150);

  INSERT INTO meals (user_id, type, consumed_at, notes)
  VALUES (demo_user_id, 'snack', '2026-05-08 15:45:00+00', 'Demo seed')
  RETURNING id INTO meal_id;
  INSERT INTO meal_items (meal_id, item_name, weight) VALUES
    (meal_id, 'Almonds', 30),
    (meal_id, 'Green apple', 180);

  INSERT INTO meals (user_id, type, consumed_at, notes)
  VALUES (demo_user_id, 'dinner', '2026-05-08 19:00:00+00', 'Demo seed')
  RETURNING id INTO meal_id;
  INSERT INTO meal_items (meal_id, item_name, weight) VALUES
    (meal_id, 'Baked salmon', 200),
    (meal_id, 'Roasted broccoli', 120),
    (meal_id, 'Quinoa', 140);

  -- 2026-05-07
  INSERT INTO meals (user_id, type, consumed_at, notes)
  VALUES (demo_user_id, 'breakfast', '2026-05-07 07:50:00+00', 'Demo seed')
  RETURNING id INTO meal_id;
  INSERT INTO meal_items (meal_id, item_name, weight) VALUES
    (meal_id, 'Scrambled eggs', 160),
    (meal_id, 'Avocado toast', 110);

  INSERT INTO meals (user_id, type, consumed_at, notes)
  VALUES (demo_user_id, 'lunch', '2026-05-07 13:00:00+00', 'Demo seed')
  RETURNING id INTO meal_id;
  INSERT INTO meal_items (meal_id, item_name, weight) VALUES
    (meal_id, 'Turkey sandwich', 240),
    (meal_id, 'Carrot sticks', 90);

  INSERT INTO meals (user_id, type, consumed_at, notes)
  VALUES (demo_user_id, 'snack', '2026-05-07 16:20:00+00', 'Demo seed')
  RETURNING id INTO meal_id;
  INSERT INTO meal_items (meal_id, item_name, weight) VALUES
    (meal_id, 'Protein bar', 60);

  INSERT INTO meals (user_id, type, consumed_at, notes)
  VALUES (demo_user_id, 'dinner', '2026-05-07 18:30:00+00', 'Demo seed')
  RETURNING id INTO meal_id;
  INSERT INTO meal_items (meal_id, item_name, weight) VALUES
    (meal_id, 'Tofu stir-fry', 280),
    (meal_id, 'Mixed vegetables', 200);
END $$;
