-- Create feedback_messages table for the feedback chat
CREATE TABLE public.feedback_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bot', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.feedback_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback messages
CREATE POLICY "Anyone can insert feedback messages"
ON public.feedback_messages
FOR INSERT
WITH CHECK (true);

-- Allow public read access to feedback messages
CREATE POLICY "Public read access to feedback messages"
ON public.feedback_messages
FOR SELECT
USING (true);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact submissions
CREATE POLICY "Anyone can insert contact submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to manage contact submissions
CREATE POLICY "Authenticated users can manage contact submissions"
ON public.contact_submissions
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');