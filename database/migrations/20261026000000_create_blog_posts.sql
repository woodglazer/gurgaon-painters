CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(180) NOT NULL UNIQUE,
  category varchar(100) NOT NULL,
  title varchar(180) NOT NULL,
  seo_title varchar(180) NOT NULL,
  description varchar(320) NOT NULL,
  body text NOT NULL,
  checks text NOT NULL DEFAULT '',
  image varchar(500) NOT NULL,
  image_alt varchar(250) NOT NULL,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_posts_published_updated_at_idx
  ON blog_posts (published, updated_at DESC);

INSERT INTO blog_posts (
  slug, category, title, seo_title, description, body, checks, image,
  image_alt, published
) VALUES
(
  'choose-paint-finish-for-each-room',
  'Interior planning',
  'How to choose the right paint finish for each room',
  'Choosing Paint Finishes in Gurgaon | Gurgaon Painters',
  'Choose a paint finish by balancing how a room is used, wall condition, appearance, and the product''s care instructions.',
  $$Paint finish affects how a wall reflects light and how visible small surface marks may be. Before choosing a sheen, consider how the room is used, the wall's condition, and the finish recommended for the paint product. There is no single finish that is right for every room.

For bedrooms and quieter spaces, many homeowners prefer a softer, less reflective look. Busy areas may need a finish that the manufacturer identifies as more washable. Kitchens, bathrooms, and utility areas also need product choices suitable for their moisture and cleaning conditions; paint alone does not solve leaks or persistent damp.

In Gurgaon homes, daylight, warm artificial lighting, and room orientation can make the same shade look different. Test a sample on the actual wall and view it at different times of day before confirming the colour. Ask your painter to assess unevenness, old coatings, cracks, or repairs, since surface preparation can affect the final appearance.$$,
  $$Decide how often the wall will be touched or cleaned.
Check the product label for recommended surfaces and care guidance.
Test the colour in the room's natural and evening light.
Agree on repairs and preparation before the painting starts.$$,
  '/images/service-interior.webp',
  'Freshly painted home interior',
  true
),
(
  'exterior-house-repainting-checklist-gurgaon',
  'Exterior painting',
  'What to check before repainting your home''s exterior',
  'Exterior Repainting Checklist for Gurgaon | Gurgaon Painters',
  'Inspect the existing coating and resolve surface or moisture problems before selecting an exterior paint system.',
  $$A good exterior repaint starts with an inspection, not just a new colour. Look for peeling or blistering paint, powdery or chalky patches, cracks, flaking plaster, and stains that return after rain. These signs can have different causes, so identify the affected areas before covering them.

Ask what preparation is included in the quote: cleaning, removal of loose paint, crack or plaster repairs, primer, number of coats, and protection of nearby fixtures. The exact scope depends on the condition of the facade. Any recurring damp should be investigated and addressed at its source before repainting that area.

Gurgaon's heat, dust, monsoon rain, and sun exposure can affect when exterior work is practical. The surface needs to be suitable and dry for the selected product, and its instructions should guide application conditions. Ask the contractor to explain the proposed materials and sequence for your property rather than relying on a generic promise of durability.$$,
  $$Walk around the facade and note cracks, peeling, and damp marks.
Confirm which repairs, primer, and coats are included in writing.
Ask how windows, plants, flooring, and fixtures will be protected.
Agree on timing based on site conditions and product instructions.$$,
  '/images/service-exterior.webp',
  'Exterior painting work on a modern home',
  true
),
(
  'early-signs-wall-waterproofing-gurgaon',
  'Damp & waterproofing',
  'Early signs that a wall may need waterproofing',
  'Signs of Wall Damp in Gurgaon | Gurgaon Painters',
  'Recurring damp marks and peeling paint may signal moisture; find the source before repainting the wall.',
  $$Watch for damp patches that return, paint that bubbles or peels, powdery white deposits, dark spotting, a persistent musty smell, or plaster that feels soft. These signs can be related to moisture, but they do not identify its source by themselves.

Moisture may come from a plumbing leak, a terrace or bathroom above, an exposed exterior wall, a window joint, or another building detail. Note when the patch appears and whether it changes after rain or water use. A qualified site inspection can help determine what should be checked next.

Painting over a damp patch can hide it temporarily while the underlying issue remains. Repair the source and allow the surface to reach the condition required by the chosen treatment and coating. For recurring or extensive damp, seek an appropriate building or plumbing professional; the right fix depends on the cause and site assessment.$$,
  $$Photograph the area and note when the stain or smell occurs.
Check nearby plumbing, bathrooms, balconies, windows, and terrace areas.
Ask for the suspected source and proposed repair to be explained.
Repaint only after the moisture issue and surface condition are addressed.$$,
  '/images/service-waterproofing.webp',
  'Waterproof coating being applied to a terrace',
  true
)
ON CONFLICT (slug) DO NOTHING;
