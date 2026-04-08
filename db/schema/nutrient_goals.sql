CREATE TABLE nutrient_goals (
  -- FOREIGN KEY REFERENCES
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nutrient_id INTEGER REFERENCES nutrients(nutrient_id) ON DELETE CASCADE,

  quantity DECIMAL,

  -- PRIMARY KEY: (user_id, nutrient_id)
  PRIMARY KEY (user_id, nutrient_id)
);