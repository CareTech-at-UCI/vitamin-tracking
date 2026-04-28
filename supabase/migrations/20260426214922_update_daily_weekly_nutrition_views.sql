-- daily nutrition view
DROP VIEW IF EXISTS daily_nutrition_view;

CREATE VIEW daily_nutrition_view AS

SELECT m.user_id, 
    DATE(m.consumed_at AT TIME ZONE 'UTC') AS consumed_date,
    n.id,
    n.name AS nutrient_name,
    n.symbol,
    n.unit,

    -- in case SUM ever returns NULL, we want to return 0 instead
    COALESCE(SUM(mn.quantity), 0) AS total_quantity

FROM meals m
JOIN meal_items mi ON mi.meal_id = m.id
JOIN meal_nutrients mn ON mn.item_id = mi.id


JOIN nutrients n ON n.id = mn.nutrient_id

GROUP BY
    m.user_id,
    consumed_date,
    n.id,
    n.name,
    n.symbol,
    n.unit

ORDER BY
    consumed_date DESC,
    n.name ASC;




-- weekly nutrition view
DROP VIEW IF EXISTS weekly_nutrition_view;

CREATE OR REPLACE VIEW weekly_nutrition_view AS

SELECT
    m.user_id,

    -- start of the week (sunday)
    DATE_TRUNC('week', m.consumed_at AT TIME ZONE 'UTC')::DATE - INTERVAL '1 day' AS week_start,

    -- end of the week (saturday)
    DATE_TRUNC('week', m.consumed_at AT TIME ZONE 'UTC')::DATE - INTERVAL '1 day'
    + INTERVAL '6 days' AS week_end,

    n.id,
    n.name AS nutrient_name,
    n.symbol,
    n.unit,

    COALESCE(SUM(mn.quantity), 0) AS total_quantity

FROM meals m
JOIN meal_items mi ON mi.meal_id = m.id
JOIN meal_nutrients mn ON mn.item_id = mi.id
JOIN nutrients n ON n.id = mn.nutrient_id

GROUP BY
    m.user_id,
    week_start,
    week_end,
    n.id,
    n.name,
    n.symbol,
    n.unit

ORDER BY
  week_start DESC,
  n.name ASC;