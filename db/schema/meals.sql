CREATE TABLE meals (
  -- PRIMARY KEY
  -- GENERATED ALWAYS AS IDENTITY: tells db to handle numbering automatically
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  -- FOREIGN KEY
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- meal_type: ENUM('breakfast', 'lunch', 'dinner', 'snack')
  type meal_type NOT NULL,
  notes TEXT,

  consumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);