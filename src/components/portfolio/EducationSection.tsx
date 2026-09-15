import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import type { Education } from '@/types';

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) {
    return (
      <Section id="education" title="Education" subtitle="My academic journey">
        <p className="text-center text-gray-500">No education records yet.</p>
      </Section>
    );
  }

  return (
    <Section id="education" title="Education" subtitle="My academic journey">
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-cyan-400/50 sm:-translate-x-1/2" />

        <div className="space-y-8">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex ${i % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'}`}
            >
              <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20 sm:-translate-x-1/2 mt-6" />

              <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? '' : 'sm:text-right'}`}>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:border-blue-400/30 transition-colors">
                  <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? '' : 'sm:justify-end'}`}>
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                    <span className="text-cyan-400 text-sm font-semibold">
                      {edu.start_year} — {edu.end_year}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">{edu.qualification}</h3>
                  <p className="text-gray-400 text-sm mb-2">{edu.institution}</p>
                  {edu.description && <p className="text-gray-500 text-sm">{edu.description}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
