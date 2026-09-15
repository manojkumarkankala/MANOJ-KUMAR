import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, ArrowUp, ArrowDown, Star, ExternalLink, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard, AdminInput, AdminButton } from '@/components/admin/AdminUI';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Project } from '@/types';

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
    setProjects((data ?? []) as Project[]);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing({ id: '', title: '', description: '', image_url: null, technologies: [], github_url: '', live_url: '', category: 'Web', featured: false, display_order: projects.length + 1, project_date: null, created_at: '', updated_at: '' });
    setTechInput('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      title: editing.title,
      description: editing.description,
      image_url: editing.image_url,
      technologies: editing.technologies,
      github_url: editing.github_url || null,
      live_url: editing.live_url || null,
      category: editing.category,
      featured: editing.featured,
      display_order: editing.display_order,
      project_date: editing.project_date,
      updated_at: new Date().toISOString(),
    };
    if (editing.id) {
      await supabase.from('projects').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('projects').insert(payload);
    }
    setSaving(false); setShowModal(false); setEditing(null); loadProjects();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('projects').delete().eq('id', deleteId);
    setDeleteId(null); loadProjects();
  };

  const moveOrder = async (project: Project, dir: 'up' | 'down') => {
    const sorted = [...projects].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((s) => s.id === project.id);
    const swapWith = dir === 'up' ? sorted[index - 1] : sorted[index + 1];
    if (!swapWith) return;
    await Promise.all([
      supabase.from('projects').update({ display_order: swapWith.display_order }).eq('id', project.id),
      supabase.from('projects').update({ display_order: project.display_order }).eq('id', swapWith.id),
    ]);
    loadProjects();
  };

  const addTech = () => {
    if (techInput.trim() && editing && !editing.technologies.includes(techInput.trim())) {
      setEditing({ ...editing, technologies: [...editing.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <AdminHeader title="Projects Management" subtitle={`${projects.length} projects`} action={<AdminButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Project</AdminButton>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <AdminCard key={project.id} className="overflow-hidden">
            <div className="relative h-36 bg-white/5">
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/10">{project.title.charAt(0)}</div>
              )}
              {project.featured && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-white font-medium text-sm">{project.title}</h3>
                <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">{project.category}</span>
              </div>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">{project.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Github className="w-4 h-4" /></a>}
                  {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400"><ExternalLink className="w-4 h-4" /></a>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveOrder(project, 'up')} className="text-gray-500 hover:text-white p-1"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveOrder(project, 'down')} className="text-gray-500 hover:text-white p-1"><ArrowDown className="w-4 h-4" /></button>
                  <button onClick={() => { setEditing({ ...project }); setTechInput(''); setShowModal(true); }} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(project.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </AdminCard>
        ))}
        {projects.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No projects yet. Click "Add Project" to create one.</p>}
      </div>

      <AnimatePresence>
        {showModal && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">{editing.id ? 'Edit Project' : 'Add Project'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <AdminInput label="Project Name" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} required />
                <AdminInput label="Description" value={editing.description || ''} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={3} />
                <ImageUpload label="Project Image" value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} folder="projects" />
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Technologies</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                      placeholder="Add technology..." className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-400/50 text-sm" />
                    <AdminButton onClick={addTech}><Plus className="w-4 h-4" /></AdminButton>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {editing.technologies.map((tech) => (
                      <span key={tech} className="flex items-center gap-1 text-xs px-2 py-1 bg-white/5 text-gray-300 rounded-md border border-white/10">
                        {tech}
                        <button onClick={() => setEditing({ ...editing, technologies: editing.technologies.filter((t) => t !== tech) })} className="text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <AdminInput label="GitHub URL" value={editing.github_url || ''} onChange={(v) => setEditing({ ...editing, github_url: v })} placeholder="https://github.com/..." />
                  <AdminInput label="Live URL" value={editing.live_url || ''} onChange={(v) => setEditing({ ...editing, live_url: v })} placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <AdminInput label="Category" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} />
                  <AdminInput label="Project Date" value={editing.project_date || ''} onChange={(v) => setEditing({ ...editing, project_date: v })} placeholder="YYYY-MM-DD" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="w-4 h-4 accent-blue-500" />
                  <span className="text-gray-300 text-sm">Featured Project</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <AdminButton variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</AdminButton>
                  <AdminButton onClick={handleSave} disabled={saving} className="flex-1">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</AdminButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} title="Delete Project" message="Are you sure you want to delete this project?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
