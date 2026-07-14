-- create dietary_plans table
CREATE TABLE
    dietary_plans (
        -- PRIMARY KEY
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name TEXT UNIQUE NOT NULL,
        is_custom BOOLEAN DEFAULT FALSE
    );
