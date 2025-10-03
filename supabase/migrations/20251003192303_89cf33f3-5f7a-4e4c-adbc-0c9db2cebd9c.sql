-- Add category column to projects table
ALTER TABLE public.projects 
ADD COLUMN category text NOT NULL DEFAULT 'Professional' 
CHECK (category IN ('Personal', 'Professional', 'Open Source'));