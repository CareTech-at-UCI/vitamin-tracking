-- drop dependent views first
DROP VIEW IF EXISTS daily_nutrition_view;
DROP VIEW IF EXISTS weekly_nutrition_view;


-- update the meals table
ALTER TABLE meals 
  -- rename the primary key column
  RENAME COLUMN meal_id TO id;

ALTER TABLE meals
  -- remove the user_id column and its foreign key constraint
  DROP COLUMN user_id;



-- update the meal items table
ALTER TABLE meal_items
  -- rename the primary key column
  RENAME COLUMN item_id TO id;



-- update the nutrients table
ALTER TABLE nutrients
  -- rename the primary key column
  RENAME COLUMN nutrient_id TO id;



-- update the diet restrictions table
ALTER TABLE diet_restrictions
  -- rename the primary key column
  RENAME COLUMN diet_id TO id;