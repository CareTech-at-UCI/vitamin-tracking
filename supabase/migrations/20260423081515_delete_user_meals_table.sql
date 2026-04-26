-- drop user_meals join table (unnecessary)
DROP TABLE IF EXISTS user_meals;


-- update the meals table
ALTER TABLE meals
  -- add user_id as an attribute
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
  