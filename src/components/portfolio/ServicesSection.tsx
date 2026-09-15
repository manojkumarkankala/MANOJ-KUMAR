import { motion } from 'framer-motion';
import { Section, GlassCard } from '@/components/ui/Section';
import { getIcon } from '@/lib/icons';
import type { Service } from '@/types';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <Section id="services" title="My Services" subtitle="What I can do for you">
      {services.length === 0 ? (
        <p className="text-center text-gray-500">No services added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 h-full hover:border-blue-400/30 transition-colors group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    {service.description || 'No description provided.'}
                  </p>
                  {service.price && (
                    <p className="text-cyan-400 font-semibold text-sm">Starting at {service.price}</p>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
