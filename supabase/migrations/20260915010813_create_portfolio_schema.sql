/*
# Portfolio Website Schema with Admin CMS

## Overview
Creates a complete database schema for a developer portfolio website with a full CMS admin panel.
All portfolio content is stored in Supabase and managed via the admin dashboard.

## New Tables
1. `profiles` - Personal profile info (name, title, intro, photo, email, phone, location)
2. `about` - About me section content, statistics
3. `skills` - Technical skills with proficiency, category, icon, display order
4. `education` - Education timeline items
5. `projects` - Portfolio projects with images, tech, URLs, category, featured
6. `services` - Service cards with icon, description, pricing
7. `messages` - Contact form submissions with read/unread status
8. `social_links` - Social media links (GitHub, LinkedIn, Instagram, etc.)
9. `website_settings` - Site-wide settings (title, colors, SEO, footer)
10. `resume` - Resume file metadata (URL, filename, upload date)

## Security
- RLS enabled on ALL tables
- Public (anon) can SELECT all portfolio content tables
- Public (anon) can INSERT into messages (contact form)
- Only authenticated admin users can INSERT/UPDATE/DELETE
- Messages can only be read/managed by authenticated users
- Storage bucket `portfolio-media` is public for reads, admin-only for writes
*/

-- ============ PROFILES TABLE ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Manoj Kumar',
  job_title text NOT NULL DEFAULT 'Full Stack Developer',
  tagline text NOT NULL DEFAULT 'I create modern and responsive websites and web applications.',
  photo_url text,
  email text NOT NULL DEFAULT 'manoj@example.com',
  phone text NOT NULL DEFAULT '+91 0000000000',
  location text NOT NULL DEFAULT 'India',
  short_intro text NOT NULL DEFAULT 'Hi! I''m Manoj, a web developer passionate about creating modern websites and web applications.',
  career_goal text NOT NULL DEFAULT 'To become a skilled full-stack developer and contribute to impactful software projects.',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles" ON profiles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_profiles" ON profiles;
CREATE POLICY "auth_update_profiles" ON profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_insert_profiles" ON profiles;
CREATE POLICY "auth_insert_profiles" ON profiles FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_profiles" ON profiles;
CREATE POLICY "auth_delete_profiles" ON profiles FOR DELETE TO authenticated USING (true);

-- ============ ABOUT TABLE ============
CREATE TABLE IF NOT EXISTS about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  bio text NOT NULL DEFAULT 'Hi! I''m Manoj, a web developer passionate about creating modern websites and web applications.',
  projects_completed integer NOT NULL DEFAULT 50,
  technologies integer NOT NULL DEFAULT 20,
  clients integer NOT NULL DEFAULT 30,
  certificates integer NOT NULL DEFAULT 10,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_about" ON about;
CREATE POLICY "public_read_about" ON about FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_about" ON about;
CREATE POLICY "auth_update_about" ON about FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_insert_about" ON about;
CREATE POLICY "auth_insert_about" ON about FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_about" ON about;
CREATE POLICY "auth_delete_about" ON about FOR DELETE TO authenticated USING (true);

-- ============ SKILLS TABLE ============
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'New Skill',
  percentage integer NOT NULL DEFAULT 80 CHECK (percentage >= 0 AND percentage <= 100),
  category text NOT NULL DEFAULT 'Frontend',
  icon text DEFAULT 'Code',
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_skills" ON skills;
CREATE POLICY "auth_insert_skills" ON skills FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_skills" ON skills;
CREATE POLICY "auth_update_skills" ON skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_skills" ON skills;
CREATE POLICY "auth_delete_skills" ON skills FOR DELETE TO authenticated USING (true);

-- ============ EDUCATION TABLE ============
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL DEFAULT 'Institution',
  qualification text NOT NULL DEFAULT 'Qualification',
  start_year text NOT NULL DEFAULT '2020',
  end_year text NOT NULL DEFAULT '2024',
  description text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_education" ON education;
CREATE POLICY "auth_insert_education" ON education FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_education" ON education;
CREATE POLICY "auth_update_education" ON education FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_education" ON education;
CREATE POLICY "auth_delete_education" ON education FOR DELETE TO authenticated USING (true);

-- ============ PROJECTS TABLE ============
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New Project',
  description text DEFAULT '',
  image_url text,
  technologies text[] DEFAULT '{}',
  github_url text,
  live_url text,
  category text NOT NULL DEFAULT 'Web',
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  project_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE TO authenticated USING (true);

-- ============ SERVICES TABLE ============
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New Service',
  description text DEFAULT '',
  icon text NOT NULL DEFAULT 'Code',
  price text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE TO authenticated USING (true);

-- ============ MESSAGES TABLE ============
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_insert_messages" ON messages;
CREATE POLICY "public_insert_messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_messages" ON messages;
CREATE POLICY "auth_read_messages" ON messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_messages" ON messages;
CREATE POLICY "auth_update_messages" ON messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_messages" ON messages;
CREATE POLICY "auth_delete_messages" ON messages FOR DELETE TO authenticated USING (true);

-- ============ SOCIAL_LINKS TABLE ============
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL DEFAULT 'github',
  label text NOT NULL DEFAULT 'GitHub',
  url text NOT NULL DEFAULT '#',
  icon text NOT NULL DEFAULT 'Github',
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_social_links" ON social_links;
CREATE POLICY "public_read_social_links" ON social_links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_social_links" ON social_links;
CREATE POLICY "auth_insert_social_links" ON social_links FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_social_links" ON social_links;
CREATE POLICY "auth_update_social_links" ON social_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_social_links" ON social_links;
CREATE POLICY "auth_delete_social_links" ON social_links FOR DELETE TO authenticated USING (true);

-- ============ WEBSITE_SETTINGS TABLE ============
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_title text NOT NULL DEFAULT 'Manoj Kumar | Full Stack Developer',
  logo_url text,
  favicon_url text,
  meta_description text NOT NULL DEFAULT 'Portfolio of Manoj Kumar, a full stack developer specializing in modern web applications.',
  main_heading text NOT NULL DEFAULT 'Full Stack Developer',
  main_subtitle text NOT NULL DEFAULT 'I create modern and responsive websites and web applications.',
  primary_color text NOT NULL DEFAULT '#3b82f6',
  secondary_color text NOT NULL DEFAULT '#06b6d4',
  contact_email text NOT NULL DEFAULT 'manoj@example.com',
  contact_phone text NOT NULL DEFAULT '+91 0000000000',
  footer_text text NOT NULL DEFAULT '© 2026 Manoj Kumar. All Rights Reserved.',
  seo_title text NOT NULL DEFAULT 'Manoj Kumar | Full Stack Developer Portfolio',
  seo_description text NOT NULL DEFAULT 'Portfolio of Manoj Kumar, a full stack developer.',
  seo_keywords text NOT NULL DEFAULT 'web developer, full stack, react, typescript, portfolio',
  og_image_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_website_settings" ON website_settings;
CREATE POLICY "public_read_website_settings" ON website_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_website_settings" ON website_settings;
CREATE POLICY "auth_update_website_settings" ON website_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_insert_website_settings" ON website_settings;
CREATE POLICY "auth_insert_website_settings" ON website_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_website_settings" ON website_settings;
CREATE POLICY "auth_delete_website_settings" ON website_settings FOR DELETE TO authenticated USING (true);

-- ============ RESUME TABLE ============
CREATE TABLE IF NOT EXISTS resume (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_resume" ON resume;
CREATE POLICY "public_read_resume" ON resume FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_resume" ON resume;
CREATE POLICY "auth_insert_resume" ON resume FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_resume" ON resume;
CREATE POLICY "auth_delete_resume" ON resume FOR DELETE TO authenticated USING (true);

-- ============ SEED DATA ============
INSERT INTO profiles (name, job_title, tagline, email, phone, location)
SELECT 'Manoj Kumar', 'Full Stack Developer', 'I create modern and responsive websites and web applications.', 'manoj@example.com', '+91 9876543210', 'India'
WHERE NOT EXISTS (SELECT 1 FROM profiles);

INSERT INTO about (bio, projects_completed, technologies, clients, certificates)
SELECT 'Hi! I''m Manoj, a web developer passionate about creating modern websites and web applications.', 50, 20, 30, 10
WHERE NOT EXISTS (SELECT 1 FROM about);

INSERT INTO website_settings (website_title, meta_description)
SELECT 'Manoj Kumar | Full Stack Developer', 'Portfolio of Manoj Kumar, a full stack developer specializing in modern web applications.'
WHERE NOT EXISTS (SELECT 1 FROM website_settings);

INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'HTML', 95, 'Frontend', 'Code', 1
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'HTML');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'CSS', 90, 'Frontend', 'Palette', 2
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'CSS');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'JavaScript', 85, 'Frontend', 'Code', 3
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'JavaScript');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'React', 88, 'Frontend', 'Atom', 4
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'React');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'TypeScript', 80, 'Frontend', 'Code', 5
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'TypeScript');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'Python', 75, 'Backend', 'Code', 6
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Python');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'SQL', 78, 'Backend', 'Database', 7
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'SQL');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'Git', 82, 'Tools', 'GitBranch', 8
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Git');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'Tailwind CSS', 90, 'Frontend', 'Wind', 9
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Tailwind CSS');
INSERT INTO skills (name, percentage, category, icon, display_order)
SELECT 'Supabase', 75, 'Backend', 'Database', 10
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Supabase');

INSERT INTO services (title, description, icon, display_order)
SELECT 'Web Development', 'Modern responsive websites and web applications.', 'Code', 1
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'Web Development');
INSERT INTO services (title, description, icon, display_order)
SELECT 'E-Commerce', 'Online stores with product management and ordering.', 'ShoppingCart', 2
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'E-Commerce');
INSERT INTO services (title, description, icon, display_order)
SELECT 'Mobile App Development', 'Modern mobile applications.', 'Smartphone', 3
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'Mobile App Development');
INSERT INTO services (title, description, icon, display_order)
SELECT 'UI/UX Development', 'Clean and responsive user interfaces.', 'Layout', 4
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'UI/UX Development');
INSERT INTO services (title, description, icon, display_order)
SELECT 'AI Solutions', 'AI-powered applications and automation.', 'Brain', 5
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'AI Solutions');
INSERT INTO services (title, description, icon, display_order)
SELECT 'Website Maintenance', 'Website updates, optimization and maintenance.', 'Wrench', 6
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'Website Maintenance');

INSERT INTO social_links (platform, label, url, icon, display_order)
SELECT 'github', 'GitHub', 'https://github.com/manoj', 'Github', 1
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'github');
INSERT INTO social_links (platform, label, url, icon, display_order)
SELECT 'linkedin', 'LinkedIn', 'https://linkedin.com/in/manoj', 'Linkedin', 2
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'linkedin');
INSERT INTO social_links (platform, label, url, icon, display_order)
SELECT 'instagram', 'Instagram', 'https://instagram.com/manoj', 'Instagram', 3
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'instagram');
INSERT INTO social_links (platform, label, url, icon, display_order)
SELECT 'email', 'Email', 'mailto:manoj@example.com', 'Mail', 4
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'email');

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public)
SELECT 'portfolio-media', 'portfolio-media', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'portfolio-media');

DROP POLICY IF EXISTS "public_read_portfolio_media" ON storage.objects;
CREATE POLICY "public_read_portfolio_media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_upload_portfolio_media" ON storage.objects;
CREATE POLICY "auth_upload_portfolio_media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_update_portfolio_media" ON storage.objects;
CREATE POLICY "auth_update_portfolio_media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-media') WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_delete_portfolio_media" ON storage.objects;
CREATE POLICY "auth_delete_portfolio_media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'portfolio-media');

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON education(display_order);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
