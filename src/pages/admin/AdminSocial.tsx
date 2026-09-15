import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard, AdminInput, AdminButton } from '@/components/admin/AdminUI';
import { availableIcons, getIcon } from '@/lib/icons';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { SocialLink } from '@/types';

export function AdminSocial() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { loadLinks(); }, []);

  const loadLinks = async () => {
    const { data } = await supabase.from('social_links').select('*').order('display_order', { ascending: true });
    setLinks((data ?? []) as SocialLink[]);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    for (const link of links) {
      if (link.id) {
        await supabase.from('social_links').update({
          platform: link.platform, label: link.label, url: link.url, icon: link.icon, display_order: link.display_order,
        }).eq('id', link.id);
      } else {
        await supabase.from('social_links').insert({
          platform: link.platform, label: link.label, url: link.url, icon: link.icon, display_order: link.display_order,
        });
      }
    }
    setSaving(false);
    setToast('Social links saved!');
    setTimeout(() => setToast(null), 3000);
    loadLinks();
  };

  const addLink = () => {
    setLinks([...links, { id: '', platform: '', label: '', url: '', icon: 'Globe', display_order: links.length + 1 }]);
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string | number) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  };

  const removeLink = async (id: string, index: number) => {
    if (id) {
      await supabase.from('social_links').delete().eq('id', id);
    }
    setLinks(links.filter((_, i) => i !== index));
    setDeleteId(null);
    if (id) loadLinks();
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <AdminHeader
        title="Social Links Management"
        subtitle="Manage your social media links"
        action={<div className="flex gap-2"><AdminButton onClick={addLink}><Plus className="w-4 h-4" /> Add</AdminButton><AdminButton onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save All</AdminButton></div>}
      />

      {toast && <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl text-sm bg-green-500/10 text-green-300 border border-green-500/20">{toast}</div>}

      <div className="space-y-3 max-w-2xl">
        {links.map((link, index) => {
          const Icon = getIcon(link.icon);
          return (
            <AdminCard key={link.id || index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <AdminInput label="Label" value={link.label} onChange={(v) => updateLink(index, 'label', v)} />
                  <AdminInput label="Platform" value={link.platform} onChange={(v) => updateLink(index, 'platform', v)} placeholder="github, linkedin..." />
                  <AdminInput label="URL" value={link.url} onChange={(v) => updateLink(index, 'url', v)} />
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Icon</label>
                    <select value={link.icon} onChange={(e) => updateLink(index, 'icon', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 text-sm">
                      {availableIcons.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => link.id ? setDeleteId(link.id) : setLinks(links.filter((_, i) => i !== index))}
                  className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 flex-shrink-0 mt-6">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </AdminCard>
          );
        })}
        {links.length === 0 && <p className="text-center text-gray-500 py-8">No social links yet. Click "Add" to create one.</p>}
      </div>

      <ConfirmDialog open={!!deleteId} title="Delete Social Link" message="Are you sure you want to delete this social link?" onConfirm={() => { const id = deleteId; if (!id) return; const idx = links.findIndex((l) => l.id === id); if (idx >= 0) removeLink(id, idx); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
