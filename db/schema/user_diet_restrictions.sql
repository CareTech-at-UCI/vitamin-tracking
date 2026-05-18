CREATE TABLE user_diet_restrictions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  diet_id INTEGER NOT NULL REFERENCES diet_restrictions(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, diet_id)
);
