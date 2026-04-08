CREATE TABLE meal_nutrients (
  -- FOREIGN KEY REFERENCES
  item_id INTEGER REFERENCES meal_items(item_id) ON DELETE CASCADE,
  nutrient_id INTEGER REFERENCES nutrients(nutrient_id) ON DELETE CASCADE,

  quantity DECIMAL,

  -- PRIMARY KEY: (item_id, nutrient_id)
  PRIMARY KEY (item_id, nutrient_id)
);