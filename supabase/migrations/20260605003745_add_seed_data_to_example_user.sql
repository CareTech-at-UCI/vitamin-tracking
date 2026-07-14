BEGIN;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM users
		WHERE id = '869d8252-7373-4741-b888-8ee8a17a46ec'::uuid
	) THEN
		RAISE EXCEPTION 'User % does not exist in public.users',
			'869d8252-7373-4741-b888-8ee8a17a46ec';
	END IF;
END $$;

WITH vitamins(name, symbol, unit) AS (
	VALUES
		('Vitamin A',  'A',   'mcg'),
		('Vitamin C',  'C',   'mg'),
		('Vitamin D',  'D',   'mcg'),
		('Vitamin E',  'E',   'mg'),
		('Vitamin K',  'K',   'mcg'),
		('Vitamin B6', 'B6',  'mg'),
		('Vitamin B12','B12', 'mcg'),
		('Folate',     'B9',  'mcg')
)
INSERT INTO nutrients (name, symbol, unit)
SELECT name, symbol, unit
FROM vitamins
ON CONFLICT (symbol) DO UPDATE
SET
	name = EXCLUDED.name,
	unit = EXCLUDED.unit;

WITH params AS (
	SELECT '869d8252-7373-4741-b888-8ee8a17a46ec'::uuid AS user_id
),
goal_values(symbol, quantity) AS (
	VALUES
		('A',   900),
		('C',   90),
		('D',   20),
		('E',   15),
		('K',   120),
		('B6',  1.7),
		('B12', 2.4),
		('B9',  400)
)
INSERT INTO nutrient_goals (user_id, nutrient_id, quantity)
SELECT p.user_id, n.id, gv.quantity
FROM params p
JOIN goal_values gv ON TRUE
JOIN nutrients n ON n.symbol = gv.symbol
ON CONFLICT (user_id, nutrient_id) DO UPDATE
SET quantity = EXCLUDED.quantity;

WITH params AS (
	SELECT
		'869d8252-7373-4741-b888-8ee8a17a46ec'::uuid AS user_id,
		(date_trunc('week', CURRENT_DATE)::date - INTERVAL '1 day')::date AS week_start
),
days AS (
	SELECT generate_series(0, 6)::int AS day_offset
),
meal_templates AS (
	SELECT *
	FROM (
		VALUES
			('breakfast'::meal_type, 'Weekly seed breakfast', time '08:00'),
			('lunch'::meal_type,     'Weekly seed lunch',     time '12:30'),
			('dinner'::meal_type,    'Weekly seed dinner',    time '18:30'),
			('snack'::meal_type,     'Weekly seed snack',     time '15:30')
	) AS t(meal_type, note, meal_time_utc)
),
inserted_meals AS (
	INSERT INTO meals (user_id, type, notes, consumed_at)
	SELECT
		p.user_id,
		mt.meal_type,
		mt.note,
		(((p.week_start + d.day_offset)::timestamp + mt.meal_time_utc) AT TIME ZONE 'UTC')
	FROM params p
	CROSS JOIN days d
	CROSS JOIN meal_templates mt
	RETURNING id, type
),
inserted_items AS (
	INSERT INTO meal_items (meal_id, item_name, weight)
	SELECT
		m.id,
		CASE m.type
			WHEN 'breakfast' THEN 'Fortified Oatmeal Bowl'
			WHEN 'lunch' THEN 'Spinach Citrus Salad'
			WHEN 'dinner' THEN 'Salmon Rice Plate'
			WHEN 'snack' THEN 'Greek Yogurt with Berries'
		END AS item_name,
		CASE m.type
			WHEN 'breakfast' THEN 250
			WHEN 'lunch' THEN 300
			WHEN 'dinner' THEN 350
			WHEN 'snack' THEN 180
		END AS weight
	FROM inserted_meals m
	RETURNING id, meal_id
),
nutrient_payload AS (
	SELECT *
	FROM (
		VALUES
			('breakfast', 'A',   180::numeric),
			('breakfast', 'C',    12::numeric),
			('breakfast', 'D',     5::numeric),
			('breakfast', 'B12',   1.2::numeric),

			('lunch',     'A',   320::numeric),
			('lunch',     'C',    55::numeric),
			('lunch',     'K',   210::numeric),
			('lunch',     'B9',  130::numeric),

			('dinner',    'D',    14::numeric),
			('dinner',    'E',     4.5::numeric),
			('dinner',    'B6',    0.8::numeric),
			('dinner',    'B12',   3.5::numeric),

			('snack',     'C',    22::numeric),
			('snack',     'D',     2.2::numeric),
			('snack',     'B12',   0.9::numeric)
	) AS t(meal_type_text, symbol, quantity)
)
INSERT INTO meal_nutrients (item_id, nutrient_id, quantity)
SELECT
	i.id AS item_id,
	n.id AS nutrient_id,
	np.quantity
FROM inserted_items i
JOIN meals m ON m.id = i.meal_id
JOIN nutrient_payload np ON np.meal_type_text = m.type::text
JOIN nutrients n ON n.symbol = np.symbol;

COMMIT;
