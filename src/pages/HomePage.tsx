import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Navbar } from '@/components/portfolio/Navbar';
import { Hero } from '@/components/portfolio/Hero';
import { AboutSection } from '@/components/portfolio/AboutSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { EducationSection } from '@/components/portfolio/EducationSection';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { ServicesSection } from '@/components/portfolio/ServicesSection';
import { ResumeSection } from '@/components/portfolio/ResumeSection';
import { ContactSection } from '@/components/portfolio/ContactSection';
import { Footer } from '@/components/portfolio/Footer';
import { LoadingSpinner } from '@/components/admin/AdminUI';

export function HomePage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg mb-2">Failed to load portfolio data</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Navbar profile={data.profile} settings={data.settings} />
      <main>
        <Hero profile={data.profile} socialLinks={data.socialLinks} settings={data.settings} resume={data.resume} />
        <AboutSection profile={data.profile} about={data.about} education={data.education} />
        <SkillsSection skills={data.skills} />
        <EducationSection education={data.education} />
        <ProjectsSection projects={data.projects} />
        <ServicesSection services={data.services} />
        <ResumeSection resume={data.resume} />
        <ContactSection profile={data.profile} socialLinks={data.socialLinks} settings={data.settings} />
      </main>
      <Footer profile={data.profile} socialLinks={data.socialLinks} settings={data.settings} />
    </div>
  );
}
