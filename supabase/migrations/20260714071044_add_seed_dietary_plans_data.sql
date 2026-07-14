INSERT INTO dietary_plans (name, is_custom)
VALUES
    ('Mediterranean', FALSE),
    ('Paleo', FALSE),
    ('Vegan', FALSE),
    ('Pescatarian', FALSE),
    ('Keto', FALSE)
ON CONFLICT (name) DO NOTHING;