ALTER TABLE users
    ADD COLUMN profile_pic_public_id VARCHAR(255);

ALTER TABLE users
    ALTER COLUMN profile_pic TYPE TEXT;

-- Move legacy Cloudinary public IDs out of profile_pic so profile_pic stores displayable URLs.
UPDATE users
SET profile_pic_public_id = profile_pic,
    profile_pic = NULL
WHERE profile_pic IS NOT NULL
  AND profile_pic NOT LIKE 'http%';

