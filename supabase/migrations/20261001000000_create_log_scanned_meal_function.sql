-- class_id maps YOLO model classes to food_items (values populated by seeds/populate_food_items_class_id.sql)
ALTER TABLE public.food_items
    ADD COLUMN IF NOT EXISTS class_id INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS food_items_class_id_key
    ON public.food_items (class_id);


-- log a meal plus its items and per-serving-scaled nutrients in a single transaction
-- p_items: [{"food_item_id": int, "servings": int}, ...]
CREATE OR REPLACE FUNCTION public.log_scanned_meal(
    p_user_id UUID,
    p_type meal_type,
    p_consumed_at TIMESTAMPTZ,
    p_notes TEXT,
    p_items JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_meal_id INTEGER;
    v_item_id INTEGER;
    v_item RECORD;
BEGIN
    INSERT INTO meals (user_id, type, consumed_at, notes)
    VALUES (p_user_id, p_type, p_consumed_at, p_notes)
    RETURNING id INTO v_meal_id;

    FOR v_item IN
        SELECT f.id AS food_item_id, f.name, x.servings
        FROM jsonb_to_recordset(p_items) AS x(food_item_id INTEGER, servings INTEGER)
        JOIN food_items f ON f.id = x.food_item_id
    LOOP
        INSERT INTO meal_items (meal_id, food_item_id, item_name, serving_size)
        VALUES (v_meal_id, v_item.food_item_id, replace(v_item.name, '-', ' '), v_item.servings)
        RETURNING id INTO v_item_id;

        INSERT INTO meal_nutrients (item_id, nutrient_id, quantity)
        SELECT v_item_id, fin.nutrient_id, fin.quantity * v_item.servings
        FROM food_item_nutrients fin
        WHERE fin.food_item_id = v_item.food_item_id;
    END LOOP;

    RETURN v_meal_id;
END;
$$;

-- only the backend (service role) may log meals on behalf of a user
REVOKE EXECUTE ON FUNCTION public.log_scanned_meal(UUID, meal_type, TIMESTAMPTZ, TEXT, JSONB)
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_scanned_meal(UUID, meal_type, TIMESTAMPTZ, TEXT, JSONB)
    TO service_role;
