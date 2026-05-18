-- rename existing enum type
ALTER TYPE profile_picture_type RENAME TO profile_picture_type_old;

-- create new enum type
CREATE TYPE profile_picture_type AS ENUM ('tomato', 'blueberry', 'watermelon', 'grape');

-- map legacy enum labels to the new ones (direct ::text::new_enum fails: fox/monkey/cat are not in the new type)
ALTER TABLE users
    ALTER COLUMN profile_picture TYPE profile_picture_type
    USING (
        CASE profile_picture::text
        WHEN 'fox' THEN 'tomato'::profile_picture_type
        WHEN 'monkey' THEN 'blueberry'::profile_picture_type
        WHEN 'cat' THEN 'watermelon'::profile_picture_type
        WHEN 'tomato' THEN 'tomato'::profile_picture_type
        WHEN 'blueberry' THEN 'blueberry'::profile_picture_type
        WHEN 'watermelon' THEN 'watermelon'::profile_picture_type
        WHEN 'grape' THEN 'grape'::profile_picture_type
        ELSE NULL::profile_picture_type
        END
    );

-- drop old enum type
DROP TYPE profile_picture_type_old;