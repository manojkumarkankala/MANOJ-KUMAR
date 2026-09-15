import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock, Rocket } from 'lucide-react';
import type { Profile, WebsiteSettings } from '@/types';

interface NavbarProps {
  profile: Profile | null;
  settings: WebsiteSettings | null;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ profile, settings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoText = settings?.website_title?.split('|')[0]?.trim() || profile?.name || 'Portfolio';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/80 backdrop-blur-lg border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#home" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-black text-gray-950">
            {logoText.charAt(0)}
          </span>
          <span className="hidden sm:inline">{logoText}</span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <Lock className="w-4 h-4" />
            Admin
          </Link>
          <a
            href="#contact"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Rocket className="w-4 h-4" />
            Hire Me
          </a>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-gray-950/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 mt-2">
                <Link
                  to="/admin/login"
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm text-gray-300 border border-white/10 rounded-lg"
                >
                  <Lock className="w-4 h-4" /> Admin
                </Link>
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 rounded-lg"
                >
                  <Rocket className="w-4 h-4" /> Hire Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
