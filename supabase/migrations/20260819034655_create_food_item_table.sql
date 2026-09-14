-- create food_items table
CREATE TABLE
    food_items (
        -- PRIMARY KEY
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name TEXT UNIQUE NOT NULL,
        description TEXT UNIQUE NOT NULL,
        serving_description TEXT NOT NULL,
        serving_size_g INTEGER NOT NULL
    );


-- create food_item_nutrients table
CREATE TABLE
    food_item_nutrients (
        -- PRIMARY KEY
        PRIMARY KEY (food_item_id, nutrient_id),
        food_item_id INTEGER NOT NULL REFERENCES food_items(id),
        nutrient_id INTEGER NOT NULL REFERENCES nutrients(id),
        quantity DECIMAL NOT NULL
    );


-- link meal_items to food_items
ALTER TABLE meal_items
    ADD COLUMN food_item_id INTEGER REFERENCES food_items(id);

-- rename weight to serving_size
ALTER TABLE meal_items
    RENAME COLUMN weight TO serving_size;

