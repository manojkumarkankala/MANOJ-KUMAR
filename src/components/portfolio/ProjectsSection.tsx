import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Star } from 'lucide-react';
import { Section, GlassCard } from '@/components/ui/Section';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const categories = ['All', ...new Set(projects.map((p) => p.category))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <Section id="projects" title="My Projects" subtitle="Some of my recent work">
      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects added yet.</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 font-medium'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group"
                >
                  <GlassCard className="overflow-hidden h-full hover:border-blue-400/30 transition-all hover:shadow-xl hover:shadow-blue-500/10">
                    <div className="relative h-48 overflow-hidden bg-white/5">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/10">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      {project.featured && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full backdrop-blur-md border border-yellow-500/20">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                        <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {project.category}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                      )}
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech} className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded-md border border-white/10">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            <Github className="w-4 h-4" /> Code
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" /> Live
                          </a>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </Section>
  );
}
