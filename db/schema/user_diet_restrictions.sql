CREATE TABLE user_diet_restrictions (
  -- FOREIGN KEY REFERENCES
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  diet_id INTEGER REFERENCES diet_restrictions(diet_id) ON DELETE CASCADE,

  -- PRIMARY KEY: (user_id, diet_id)
  PRIMARY KEY (user_id, diet_id)
);