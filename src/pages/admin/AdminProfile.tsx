import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard, AdminInput, AdminButton } from '@/components/admin/AdminUI';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Profile } from '@/types';

export function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    supabase.from('profiles').select('*').maybeSingle().then(({ data }) => {
      setProfile(data as Profile | null);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      name: profile.name,
      job_title: profile.job_title,
      tagline: profile.tagline,
      photo_url: profile.photo_url,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      short_intro: profile.short_intro,
      career_goal: profile.career_goal,
      updated_at: new Date().toISOString(),
    }).eq('id', profile.id);

    setSaving(false);
    setToast({ msg: error ? error.message : 'Profile updated successfully!', type: error ? 'error' : 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (!profile) {
    return (
      <div>
        <AdminHeader title="Profile" />
        <AdminCard className="p-6 text-center">
          <p className="text-gray-400 mb-4">No profile found. Create one to get started.</p>
          <AdminButton onClick={async () => {
            const { data } = await supabase.from('profiles').insert({}).select().maybeSingle();
            if (data) setProfile(data as Profile);
          }}>Create Profile</AdminButton>
        </AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Profile Management"
        subtitle="Update your personal information"
        action={<AdminButton onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes</AdminButton>}
      />

      {toast && <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl text-sm ${toast.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>{toast.msg}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <AdminCard className="p-6 lg:col-span-1">
          <ImageUpload
            label="Profile Photo"
            value={profile.photo_url}
            onChange={(url) => setProfile({ ...profile, photo_url: url })}
            folder="profile"
          />
        </AdminCard>

        <AdminCard className="p-6 lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput label="Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} required />
            <AdminInput label="Job Title" value={profile.job_title} onChange={(v) => setProfile({ ...profile, job_title: v })} required />
          </div>
          <AdminInput label="Tagline" value={profile.tagline} onChange={(v) => setProfile({ ...profile, tagline: v })} />
          <AdminInput label="Short Intro" value={profile.short_intro} onChange={(v) => setProfile({ ...profile, short_intro: v })} textarea rows={3} />
          <AdminInput label="Career Goal" value={profile.career_goal} onChange={(v) => setProfile({ ...profile, career_goal: v })} textarea rows={2} />
          <div className="grid sm:grid-cols-3 gap-4">
            <AdminInput label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} type="email" />
            <AdminInput label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
            <AdminInput label="Location" value={profile.location} onChange={(v) => setProfile({ ...profile, location: v })} />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
