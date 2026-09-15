import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye } from 'lucide-react';
import { Section, GlassCard } from '@/components/ui/Section';
import type { Resume } from '@/types';

interface ResumeSectionProps {
  resume: Resume | null;
}

export function ResumeSection({ resume }: ResumeSectionProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Section id="resume" title="Resume" subtitle="My professional background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <GlassCard className="p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center text-blue-400 mb-4">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">My Resume</h3>
          <p className="text-gray-400 text-sm mb-6">
            {resume ? resume.file_name : 'No resume uploaded yet. Check back soon!'}
          </p>

          {resume && (
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                <Eye className="w-4 h-4" /> View Resume
              </button>
              <a
                href={resume.file_url}
                download
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {showPreview && resume && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="w-full max-w-4xl h-[90vh] bg-gray-900 rounded-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-medium">Resume Preview</span>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-white/5">
                Close
              </button>
            </div>
            <iframe src={resume.file_url} className="flex-1 w-full" title="Resume Preview" />
          </div>
        </div>
      )}
    </Section>
  );
}
