import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, About, Skill, Education, Project, Service, SocialLink, WebsiteSettings, Resume } from '@/types';

export interface PortfolioData {
  profile: Profile | null;
  about: About | null;
  skills: Skill[];
  education: Education[];
  projects: Project[];
  services: Service[];
  socialLinks: SocialLink[];
  settings: WebsiteSettings | null;
  resume: Resume | null;
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>({
    profile: null,
    about: null,
    skills: [],
    education: [],
    projects: [],
    services: [],
    socialLinks: [],
    settings: null,
    resume: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profileRes, aboutRes, skillsRes, educationRes, projectsRes, servicesRes, socialRes, settingsRes, resumeRes] =
          await Promise.all([
            supabase.from('profiles').select('*').maybeSingle(),
            supabase.from('about').select('*').maybeSingle(),
            supabase.from('skills').select('*').order('display_order', { ascending: true }),
            supabase.from('education').select('*').order('display_order', { ascending: true }),
            supabase.from('projects').select('*').order('display_order', { ascending: true }),
            supabase.from('services').select('*').order('display_order', { ascending: true }),
            supabase.from('social_links').select('*').order('display_order', { ascending: true }),
            supabase.from('website_settings').select('*').maybeSingle(),
            supabase.from('resume').select('*').order('uploaded_at', { ascending: false }).limit(1).maybeSingle(),
          ]);

        if (cancelled) return;

        if (profileRes.error) throw profileRes.error;

        setData({
          profile: profileRes.data as Profile | null,
          about: aboutRes.data as About | null,
          skills: (skillsRes.data ?? []) as Skill[],
          education: (educationRes.data ?? []) as Education[],
          projects: (projectsRes.data ?? []) as Project[],
          services: (servicesRes.data ?? []) as Service[],
          socialLinks: (socialRes.data ?? []) as SocialLink[],
          settings: settingsRes.data as WebsiteSettings | null,
          resume: resumeRes.data as Resume | null,
        });
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
