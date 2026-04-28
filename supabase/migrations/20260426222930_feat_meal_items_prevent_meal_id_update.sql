CREATE OR REPLACE FUNCTION prevent_meal_items_meal_id_update()
RETURNS trigger AS $$
BEGIN
  IF NEW.meal_id IS DISTINCT FROM OLD.meal_id THEN
    RAISE EXCEPTION 'meal_id is immutable for meal_items';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_meal_items_meal_id_update ON meal_items;

CREATE TRIGGER trg_prevent_meal_items_meal_id_update
BEFORE UPDATE ON meal_items
FOR EACH ROW
EXECUTE FUNCTION prevent_meal_items_meal_id_update();