CREATE OR REPLACE VIEW weekly_nutrition_view AS

SELECT
    m.user_id,

    -- start of the week (sunday)
    DATE_TRUNC('week', m.consumed_at AT TIME ZONE 'UTC')::DATE - INTERVAL '1 day' AS week_start,

    -- end of the week (saturday)
    DATE_TRUNC('week', m.consumed_at AT TIME ZONE 'UTC')::DATE - INTERVAL '1 day'
    + INTERVAL '6 days' AS week_end,

    n.nutrient_id,
    n.name AS nutrient_name,
    n.symbol,
    n.unit,

    COALESCE(SUM(mn.quantity), 0) AS total_quantity

FROM meals m
JOIN meal_items mi ON mi.meal_id = m.meal_id
JOIN meal_nutrients mn ON mn.item_id = mi.item_id
JOIN nutrients n ON n.nutrient_id = mn.nutrient_id

GROUP BY
    m.user_id,
    DATE_TRUNC('week', m.consumed_at AT TIME ZONE 'UTC')::DATE,
    n.nutrient_id,
    n.name,
    n.symbol,
    n.unit;