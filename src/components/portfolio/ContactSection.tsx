import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Section, GlassCard } from '@/components/ui/Section';
import { supabase } from '@/lib/supabase';
import { getIcon } from '@/lib/icons';
import type { Profile, SocialLink, WebsiteSettings } from '@/types';

interface ContactSectionProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
  settings: WebsiteSettings | null;
}

export function ContactSection({ profile, socialLinks, settings }: ContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const contactEmail = settings?.contact_email || profile?.email || 'manoj@example.com';
  const contactPhone = settings?.contact_phone || profile?.phone || '';
  const contactLocation = profile?.location || 'India';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('messages').insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });

      if (error) throw error;

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return (
    <Section id="contact" title="Get In Touch" subtitle="Let's work together">
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
          <div className="space-y-4 mb-8">
            <ContactInfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={contactEmail} href={`mailto:${contactEmail}`} />
            <ContactInfoRow icon={<Phone className="w-5 h-5" />} label="Phone" value={contactPhone} href={`tel:${contactPhone}`} />
            <ContactInfoRow icon={<MapPin className="w-5 h-5" />} label="Location" value={contactLocation} />
          </div>

          <div className="flex gap-3">
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
                placeholder="Your name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
                placeholder="your.email@example.com"
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+91 1234567890"
              />
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-400/50 transition-colors resize-none"
                />
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" /> Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" /> {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : <>Send Message <Send className="w-4 h-4" /></>}
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </Section>
  );
}

function ContactInfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-3 group">
      <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-gray-500 text-xs">{label}</div>
        <div className="text-gray-200 text-sm">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-400/50 transition-colors"
      />
    </div>
  );
}
