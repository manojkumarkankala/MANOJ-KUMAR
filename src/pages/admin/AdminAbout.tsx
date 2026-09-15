import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard, AdminInput, AdminButton } from '@/components/admin/AdminUI';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { About } from '@/types';

export function AdminAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    supabase.from('about').select('*').maybeSingle().then(({ data }) => {
      setAbout(data as About | null);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!about) return;
    setSaving(true);
    const { error } = await supabase.from('about').update({
      image_url: about.image_url,
      bio: about.bio,
      projects_completed: about.projects_completed,
      technologies: about.technologies,
      clients: about.clients,
      certificates: about.certificates,
      updated_at: new Date().toISOString(),
    }).eq('id', about.id);

    setSaving(false);
    setToast({ msg: error ? error.message : 'About section updated!', type: error ? 'error' : 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (!about) {
    return (
      <div>
        <AdminHeader title="About" />
        <AdminCard className="p-6 text-center">
          <p className="text-gray-400 mb-4">No about section found. Create one to get started.</p>
          <AdminButton onClick={async () => {
            const { data } = await supabase.from('about').insert({}).select().maybeSingle();
            if (data) setAbout(data as About);
          }}>Create About Section</AdminButton>
        </AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="About Management"
        subtitle="Update your about section and statistics"
        action={<AdminButton onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes</AdminButton>}
      />

      {toast && <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl text-sm ${toast.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>{toast.msg}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <AdminCard className="p-6">
          <ImageUpload
            label="About Image"
            value={about.image_url}
            onChange={(url) => setAbout({ ...about, image_url: url })}
            folder="about"
          />
        </AdminCard>

        <AdminCard className="p-6 lg:col-span-2 space-y-4">
          <AdminInput label="Bio" value={about.bio} onChange={(v) => setAbout({ ...about, bio: v })} textarea rows={4} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Projects Completed</label>
              <input type="number" value={about.projects_completed} onChange={(e) => setAbout({ ...about, projects_completed: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Technologies</label>
              <input type="number" value={about.technologies} onChange={(e) => setAbout({ ...about, technologies: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Clients</label>
              <input type="number" value={about.clients} onChange={(e) => setAbout({ ...about, clients: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Certificates</label>
              <input type="number" value={about.certificates} onChange={(e) => setAbout({ ...about, certificates: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 text-sm" />
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
