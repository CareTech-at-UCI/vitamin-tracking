-- create dietary_plans table
CREATE TABLE
    dietary_plans (
        -- PRIMARY KEY
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name TEXT UNIQUE NOT NULL,
        is_custom BOOLEAN DEFAULT FALSE
    );


-- create user_dietary_plans table
CREATE TABLE
    user_dietary_plans (
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        dietary_plan_id INTEGER NOT NULL REFERENCES dietary_plans (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        PRIMARY KEY (user_id, dietary_plan_id)
    );