export interface Profile {
  id: string;
  name: string;
  job_title: string;
  tagline: string;
  photo_url: string | null;
  email: string;
  phone: string;
  location: string;
  short_intro: string;
  career_goal: string;
  updated_at: string;
}

export interface About {
  id: string;
  image_url: string | null;
  bio: string;
  projects_completed: number;
  technologies: number;
  clients: number;
  certificates: number;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  category: string;
  icon: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Education {
  id: string;
  institution: string;
  qualification: string;
  start_year: string;
  end_year: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  category: string;
  featured: boolean;
  display_order: number;
  project_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  price: string | null;
  display_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  display_order: number;
}

export interface WebsiteSettings {
  id: string;
  website_title: string;
  logo_url: string | null;
  favicon_url: string | null;
  meta_description: string;
  main_heading: string;
  main_subtitle: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  contact_phone: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string | null;
  updated_at: string;
}

export interface Resume {
  id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}
