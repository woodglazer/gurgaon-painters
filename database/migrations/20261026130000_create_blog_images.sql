CREATE TABLE IF NOT EXISTS blog_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type varchar(30) NOT NULL
    CHECK (content_type IN ('image/jpeg', 'image/png', 'image/webp')),
  image_data bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
