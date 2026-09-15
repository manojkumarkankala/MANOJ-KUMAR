import { Link } from 'react-router-dom';
import { Lock, Heart } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import type { Profile, SocialLink, WebsiteSettings } from '@/types';

interface FooterProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
  settings: WebsiteSettings | null;
}

export function Footer({ profile, socialLinks, settings }: FooterProps) {
  const footerText = settings?.footer_text || '© 2026 Manoj Kumar. All Rights Reserved.';
  const name = profile?.name || 'Manoj Kumar';

  return (
    <footer className="relative border-t border-white/10 bg-gray-950/50 backdrop-blur-lg py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">{name}</h3>
            <p className="text-gray-400 text-sm">{settings?.meta_description || 'Full Stack Developer'}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a>
              <a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#resume" className="text-gray-400 hover:text-white transition-colors">Resume</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Follow Me</h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = getIcon(link.icon);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-400/50 transition-all"
                    aria-label={link.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-gray-500 text-sm text-center sm:text-left">{footerText}</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="flex items-center gap-1 text-gray-500 hover:text-white text-sm transition-colors">
              <Lock className="w-3.5 h-3.5" /> Admin Login
            </Link>
            <span className="text-gray-600 text-sm flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-400" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
