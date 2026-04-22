CREATE TABLE user_meals (
    -- FOREIGN KEY REFERENCES
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_id INTEGER REFERENCES meals(meal_id) ON DELETE CASCADE,


  -- PRIMARY KEY: (user_id, nutrient_id)
  PRIMARY KEY (user_id, meal_id)
)