import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Target } from 'lucide-react';
import { Section, GlassCard } from '@/components/ui/Section';
import type { Profile, About, Education } from '@/types';

interface AboutSectionProps {
  profile: Profile | null;
  about: About | null;
  education: Education[];
}

export function AboutSection({ profile, about, education }: AboutSectionProps) {
  const stats = [
    { label: 'Projects Completed', value: about?.projects_completed ?? 50, icon: '🚀' },
    { label: 'Technologies', value: about?.technologies ?? 20, icon: '⚡' },
    { label: 'Clients', value: about?.clients ?? 30, icon: '🤝' },
    { label: 'Certificates', value: about?.certificates ?? 10, icon: '🏆' },
  ];

  const latestEdu = education[0];

  return (
    <Section id="about" title="About Me" subtitle="Get to know me better">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-6 overflow-hidden">
            {about?.image_url ? (
              <img src={about.image_url} alt="About" className="w-full rounded-xl object-cover" />
            ) : profile?.photo_url ? (
              <img src={profile.photo_url} alt="About" className="w-full rounded-xl object-cover" />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-6xl text-white/20 rounded-xl bg-white/5">
                {profile?.name?.charAt(0) || 'M'}
              </div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {profile?.name || 'Manoj Kumar'}
          </h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            {about?.bio || profile?.short_intro || "Hi! I'm Manoj, a web developer passionate about creating modern websites and web applications."}
          </p>

          <div className="space-y-3 mb-6">
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={profile?.location || 'India'} />
            <InfoRow
              icon={<GraduationCap className="w-4 h-4" />}
              label="Education"
              value={latestEdu ? `${latestEdu.qualification} - ${latestEdu.institution}` : 'Computer Science'}
            />
            <InfoRow
              icon={<Target className="w-4 h-4" />}
              label="Career Goal"
              value={profile?.career_goal || 'To become a skilled full-stack developer.'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard className="p-4 text-center hover:border-blue-400/30 transition-colors">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">
                    <CountUp target={stat.value} />
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
        {icon}
      </div>
      <div>
        <span className="text-gray-500 text-sm">{label}: </span>
        <span className="text-gray-200 text-sm">{value}</span>
      </div>
    </div>
  );
}

function CountUp({ target }: { target: number }) {
  return <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>{target}+</motion.span>;
}
