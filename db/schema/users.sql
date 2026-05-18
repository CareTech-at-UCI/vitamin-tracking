CREATE TABLE users (
  -- PRIMARY key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  -- sex_type: ENUM('male', 'female', 'other')
  sex sex_type NOT NULL,
  -- NUMERIC(5, 2) allows up to 999.99
  height NUMERIC(5, 2) NOT NULL CHECK (height > 0),
  weight NUMERIC(5, 2) NOT NULL CHECK (weight > 0),
  activity_level INTEGER NOT NULL CHECK (activity_level >= 1 AND activity_level <= 5),
  is_pregnant BOOLEAN,
  -- profile_picture_type: ENUM('fox', 'monkey', 'cat')
  profile_picture profile_picture_type,
  goal_type TEXT,
  -- Diet restriction labels (preset + custom), e.g. {"Vegetarian", "No Gluten"}
  recommendations TEXT[] DEFAULT '{}',

  -- DEFAULT set to NOW() (current time)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)