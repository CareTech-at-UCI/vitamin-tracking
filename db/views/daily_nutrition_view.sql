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