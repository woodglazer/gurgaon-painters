ALTER TABLE enquiries
ADD COLUMN IF NOT EXISTS city varchar(30) NOT NULL DEFAULT 'gurgaon';

CREATE INDEX IF NOT EXISTS enquiries_city_idx
ON enquiries (city);

CREATE INDEX IF NOT EXISTS enquiries_city_created_at_idx
ON enquiries (city, created_at DESC);
