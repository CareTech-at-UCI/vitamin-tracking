-- update the meal items table
ALTER TABLE meal_items
  -- add item_name as an attribute
  ADD COLUMN item_name TEXT;

-- backfill existing rows
UPDATE meal_items
SET item_name = 'unknown'
WHERE item_name IS NULL;

ALTER TABLE meal_items
  ALTER COLUMN item_name SET NOT NULL;