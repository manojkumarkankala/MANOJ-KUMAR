import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard, AdminInput, AdminButton } from '@/components/admin/AdminUI';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { Education } from '@/types';

export function AdminEducation() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    const { data } = await supabase.from('education').select('*').order('display_order', { ascending: true });
    setItems((data ?? []) as Education[]);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing({ id: '', institution: '', qualification: '', start_year: '2020', end_year: '2024', description: '', display_order: items.length + 1, created_at: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from('education').update({
        institution: editing.institution, qualification: editing.qualification,
        start_year: editing.start_year, end_year: editing.end_year,
        description: editing.description, display_order: editing.display_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('education').insert({
        institution: editing.institution, qualification: editing.qualification,
        start_year: editing.start_year, end_year: editing.end_year,
        description: editing.description, display_order: editing.display_order,
      });
    }
    setSaving(false); setShowModal(false); setEditing(null); loadItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('education').delete().eq('id', deleteId);
    setDeleteId(null); loadItems();
  };

  const moveOrder = async (item: Education, dir: 'up' | 'down') => {
    const sorted = [...items].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((s) => s.id === item.id);
    const swapWith = dir === 'up' ? sorted[index - 1] : sorted[index + 1];
    if (!swapWith) return;
    await Promise.all([
      supabase.from('education').update({ display_order: swapWith.display_order }).eq('id', item.id),
      supabase.from('education').update({ display_order: item.display_order }).eq('id', swapWith.id),
    ]);
    loadItems();
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <AdminHeader title="Education Management" subtitle={`${items.length} items`} action={<AdminButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Education</AdminButton>} />

      <div className="space-y-3">
        {items.map((item) => (
          <AdminCard key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-cyan-400 text-sm font-semibold">{item.start_year} — {item.end_year}</span>
                </div>
                <h3 className="text-white font-medium">{item.qualification}</h3>
                <p className="text-gray-400 text-sm">{item.institution}</p>
                {item.description && <p className="text-gray-500 text-sm mt-1">{item.description}</p>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => moveOrder(item, 'up')} className="text-gray-500 hover:text-white p-1"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => moveOrder(item, 'down')} className="text-gray-500 hover:text-white p-1"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => { setEditing({ ...item }); setShowModal(true); }} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(item.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </AdminCard>
        ))}
        {items.length === 0 && <p className="text-center text-gray-500 py-8">No education records yet.</p>}
      </div>

      <AnimatePresence>
        {showModal && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">{editing.id ? 'Edit Education' : 'Add Education'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <AdminInput label="Institution" value={editing.institution} onChange={(v) => setEditing({ ...editing, institution: v })} required />
                <AdminInput label="Qualification" value={editing.qualification} onChange={(v) => setEditing({ ...editing, qualification: v })} required />
                <div className="grid grid-cols-2 gap-4">
                  <AdminInput label="Start Year" value={editing.start_year} onChange={(v) => setEditing({ ...editing, start_year: v })} required />
                  <AdminInput label="End Year" value={editing.end_year} onChange={(v) => setEditing({ ...editing, end_year: v })} required />
                </div>
                <AdminInput label="Description" value={editing.description || ''} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={3} />
                <div className="flex gap-3 pt-2">
                  <AdminButton variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</AdminButton>
                  <AdminButton onClick={handleSave} disabled={saving} className="flex-1">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</AdminButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} title="Delete Education" message="Are you sure you want to delete this education record?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
