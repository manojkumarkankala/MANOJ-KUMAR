import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, Github, Linkedin, Instagram } from 'lucide-react';
import { TypingText } from '@/components/ui/TypingText';
import type { Profile, SocialLink, WebsiteSettings, Resume } from '@/types';
import { getIcon } from '@/lib/icons';

interface HeroProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
  settings: WebsiteSettings | null;
  resume: Resume | null;
}

export function Hero({ profile, socialLinks, settings, resume }: HeroProps) {
  const name = profile?.name || 'Manoj Kumar';
  const tagline = settings?.main_subtitle || profile?.tagline || 'I create modern and responsive websites and web applications.';
  const heading = settings?.main_heading || profile?.job_title || 'Full Stack Developer';
  const photoUrl = profile?.photo_url;

  const phrases = ['Full Stack Developer', 'Web Developer', 'React Developer', 'Software Developer', 'Freelancer'];

  const getSocialUrl = (platform: string) => socialLinks.find((s) => s.platform === platform)?.url || '#';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          <p className="text-gray-400 text-lg mb-2">Hi, I'm</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
            {name}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            <TypingText phrases={phrases} />
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
            <a
              href="#projects"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              View My Work <ArrowRight className="w-4 h-4" />
            </a>
            {resume?.file_url && (
              <a
                href={resume.file_url}
                download
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all"
              >
                <Download className="w-4 h-4" /> Download Resume
              </a>
            )}
            <a
              href="#contact"
              className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all"
            >
              <Mail className="w-4 h-4" /> Contact Me
            </a>
          </div>

          <div className="flex gap-4 justify-center lg:justify-start">
            {socialLinks.map((link) => {
              const Icon = getIcon(link.icon);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-blue-400/50 hover:bg-blue-500/10 transition-all"
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
            {!socialLinks.length && (
              <>
                <SocialPlaceholder Icon={Github} url={getSocialUrl('github')} />
                <SocialPlaceholder Icon={Linkedin} url={getSocialUrl('linkedin')} />
                <SocialPlaceholder Icon={Instagram} url={getSocialUrl('instagram')} />
                <SocialPlaceholder Icon={Mail} url={getSocialUrl('email')} />
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="order-1 lg:order-2 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white/10 bg-white/5 backdrop-blur-lg">
              {photoUrl ? (
                <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white/30">
                  {name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white transition-colors"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </a>
    </section>
  );
}

function SocialPlaceholder({ Icon, url }: { Icon: React.ComponentType<{ className?: string }>; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-blue-400/50 hover:bg-blue-500/10 transition-all"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}
