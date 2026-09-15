import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard, AdminInput, AdminButton } from '@/components/admin/AdminUI';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { availableIcons, getIcon } from '@/lib/icons';
import type { Skill } from '@/types';

export function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const { data } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
    setSkills((data ?? []) as Skill[]);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing({ id: '', name: '', percentage: 80, category: 'Frontend', icon: 'Code', description: '', display_order: skills.length + 1, created_at: '' });
    setShowModal(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing({ ...skill });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    if (editing.id) {
      await supabase.from('skills').update({
        name: editing.name,
        percentage: editing.percentage,
        category: editing.category,
        icon: editing.icon,
        description: editing.description,
        display_order: editing.display_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('skills').insert({
        name: editing.name,
        percentage: editing.percentage,
        category: editing.category,
        icon: editing.icon,
        description: editing.description,
        display_order: editing.display_order,
      });
    }

    setSaving(false);
    setShowModal(false);
    setEditing(null);
    loadSkills();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('skills').delete().eq('id', deleteId);
    setDeleteId(null);
    loadSkills();
  };

  const moveOrder = async (skill: Skill, direction: 'up' | 'down') => {
    const sorted = [...skills].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((s) => s.id === skill.id);
    const swapWith = direction === 'up' ? sorted[index - 1] : sorted[index + 1];
    if (!swapWith) return;

    await Promise.all([
      supabase.from('skills').update({ display_order: swapWith.display_order }).eq('id', skill.id),
      supabase.from('skills').update({ display_order: skill.display_order }).eq('id', swapWith.id),
    ]);
    loadSkills();
  };

  const categories = ['Frontend', 'Backend', 'Tools', 'Database', 'Other'];

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <AdminHeader
        title="Skills Management"
        subtitle={`${skills.length} skills`}
        action={<AdminButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Skill</AdminButton>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => {
          const Icon = getIcon(skill.icon);
          return (
            <AdminCard key={skill.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{skill.name}</div>
                    <div className="text-gray-500 text-xs">{skill.category}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveOrder(skill, 'up')} className="text-gray-500 hover:text-white p-1"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveOrder(skill, 'down')} className="text-gray-500 hover:text-white p-1"><ArrowDown className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${skill.percentage}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 text-sm font-semibold">{skill.percentage}%</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(skill)} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(skill.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">{editing.id ? 'Edit Skill' : 'Add Skill'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <AdminInput label="Skill Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required />
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Category</label>
                  <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 text-sm">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Percentage: {editing.percentage}%</label>
                  <input type="range" min="0" max="100" value={editing.percentage} onChange={(e) => setEditing({ ...editing, percentage: parseInt(e.target.value) })}
                    className="w-full accent-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Icon</label>
                  <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/10">
                    {availableIcons.map((iconName) => {
                      const Icon = getIcon(iconName);
                      return (
                        <button key={iconName} type="button" onClick={() => setEditing({ ...editing, icon: iconName })}
                          className={`p-2 rounded-lg flex items-center justify-center ${editing.icon === iconName ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}>
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <AdminInput label="Description (optional)" value={editing.description || ''} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={2} />

                <div className="flex gap-3 pt-2">
                  <AdminButton variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</AdminButton>
                  <AdminButton onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                  </AdminButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
