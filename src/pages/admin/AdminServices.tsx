import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard, AdminInput, AdminButton } from '@/components/admin/AdminUI';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { availableIcons, getIcon } from '@/lib/icons';
import type { Service } from '@/types';

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    const { data } = await supabase.from('services').select('*').order('display_order', { ascending: true });
    setServices((data ?? []) as Service[]);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing({ id: '', title: '', description: '', icon: 'Code', price: '', display_order: services.length + 1, created_at: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from('services').update({
        title: editing.title, description: editing.description, icon: editing.icon,
        price: editing.price, display_order: editing.display_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('services').insert({
        title: editing.title, description: editing.description, icon: editing.icon,
        price: editing.price, display_order: editing.display_order,
      });
    }
    setSaving(false); setShowModal(false); setEditing(null); loadServices();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('services').delete().eq('id', deleteId);
    setDeleteId(null); loadServices();
  };

  const moveOrder = async (service: Service, dir: 'up' | 'down') => {
    const sorted = [...services].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((s) => s.id === service.id);
    const swapWith = dir === 'up' ? sorted[index - 1] : sorted[index + 1];
    if (!swapWith) return;
    await Promise.all([
      supabase.from('services').update({ display_order: swapWith.display_order }).eq('id', service.id),
      supabase.from('services').update({ display_order: service.display_order }).eq('id', swapWith.id),
    ]);
    loadServices();
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <AdminHeader title="Services Management" subtitle={`${services.length} services`} action={<AdminButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Service</AdminButton>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <AdminCard key={service.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center text-blue-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveOrder(service, 'up')} className="text-gray-500 hover:text-white p-1"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveOrder(service, 'down')} className="text-gray-500 hover:text-white p-1"><ArrowDown className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{service.title}</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-3">{service.description || 'No description'}</p>
              {service.price && <p className="text-cyan-400 text-sm font-semibold mb-3">Starting at {service.price}</p>}
              <div className="flex gap-1 justify-end">
                <button onClick={() => { setEditing({ ...service }); setShowModal(true); }} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(service.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            </AdminCard>
          );
        })}
        {services.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No services yet.</p>}
      </div>

      <AnimatePresence>
        {showModal && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">{editing.id ? 'Edit Service' : 'Add Service'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <AdminInput label="Service Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} required />
                <AdminInput label="Description" value={editing.description || ''} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={3} />
                <AdminInput label="Price (optional)" value={editing.price || ''} onChange={(v) => setEditing({ ...editing, price: v })} placeholder="$99" />
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
                <div className="flex gap-3 pt-2">
                  <AdminButton variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</AdminButton>
                  <AdminButton onClick={handleSave} disabled={saving} className="flex-1">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</AdminButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteId} title="Delete Service" message="Are you sure you want to delete this service?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
