-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for all admin-manageable tables
-- Profiles table
DROP POLICY IF EXISTS "Allow authenticated users to manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Projects table
DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON public.projects;
CREATE POLICY "Admins can manage projects"
ON public.projects
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Experiences table
DROP POLICY IF EXISTS "Allow authenticated users to manage experiences" ON public.experiences;
CREATE POLICY "Admins can manage experiences"
ON public.experiences
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Skills table
DROP POLICY IF EXISTS "Allow authenticated users to manage skills" ON public.skills;
CREATE POLICY "Admins can manage skills"
ON public.skills
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Skill categories table
DROP POLICY IF EXISTS "Allow authenticated users to manage skill_categories" ON public.skill_categories;
CREATE POLICY "Admins can manage skill_categories"
ON public.skill_categories
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact info table
DROP POLICY IF EXISTS "Allow authenticated users to manage contact_info" ON public.contact_info;
CREATE POLICY "Admins can manage contact_info"
ON public.contact_info
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site content table
DROP POLICY IF EXISTS "Allow authenticated users to manage site_content" ON public.site_content;
CREATE POLICY "Admins can manage site_content"
ON public.site_content
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site images table
DROP POLICY IF EXISTS "Allow authenticated users to manage site_images" ON public.site_images;
CREATE POLICY "Admins can manage site_images"
ON public.site_images
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Page sections table
DROP POLICY IF EXISTS "Allow authenticated users to manage page_sections" ON public.page_sections;
CREATE POLICY "Admins can manage page_sections"
ON public.page_sections
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact submissions - admins can manage, keep public insert
DROP POLICY IF EXISTS "Authenticated users can manage contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can manage contact submissions"
ON public.contact_submissions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));