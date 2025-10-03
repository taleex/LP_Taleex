-- Add dark mode SVG URL column to skills table
ALTER TABLE skills ADD COLUMN IF NOT EXISTS svg_url_dark text;