import { motion } from 'framer-motion';
import { Section, GlassCard } from '@/components/ui/Section';
import { getIcon } from '@/lib/icons';
import type { Skill } from '@/types';

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <Section id="skills" title="My Skills" subtitle="Technologies I work with">
      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No skills added yet.</p>
      ) : (
        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full" />
                {category}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill, i) => {
                    const Icon = getIcon(skill.icon);
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <GlassCard className="p-4 hover:border-blue-400/30 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm">{skill.name}</div>
                              {skill.description && (
                                <div className="text-gray-500 text-xs">{skill.description}</div>
                              )}
                            </div>
                            <span className="text-cyan-400 text-sm font-semibold">{skill.percentage}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            />
                          </div>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
