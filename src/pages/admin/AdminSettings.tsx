import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminHeader, AdminCard, AdminInput, AdminButton } from '@/components/admin/AdminUI';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { WebsiteSettings } from '@/types';

export function AdminSettings() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    supabase.from('website_settings').select('*').maybeSingle().then(({ data }) => {
      setSettings(data as WebsiteSettings | null);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from('website_settings').update({
      website_title: settings.website_title,
      logo_url: settings.logo_url,
      favicon_url: settings.favicon_url,
      meta_description: settings.meta_description,
      main_heading: settings.main_heading,
      main_subtitle: settings.main_subtitle,
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      footer_text: settings.footer_text,
      seo_title: settings.seo_title,
      seo_description: settings.seo_description,
      seo_keywords: settings.seo_keywords,
      og_image_url: settings.og_image_url,
      updated_at: new Date().toISOString(),
    }).eq('id', settings.id);

    setSaving(false);
    setToast({ msg: error ? error.message : 'Settings saved successfully!', type: error ? 'error' : 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (!settings) {
    return (
      <div>
        <AdminHeader title="Website Settings" />
        <AdminCard className="p-6 text-center">
          <p className="text-gray-400 mb-4">No settings found. Create default settings.</p>
          <AdminButton onClick={async () => { const { data } = await supabase.from('website_settings').insert({}).select().maybeSingle(); if (data) setSettings(data as WebsiteSettings); }}>Create Settings</AdminButton>
        </AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Website Settings"
        subtitle="Configure your website, SEO, and branding"
        action={<AdminButton onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes</AdminButton>}
      />

      {toast && <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl text-sm ${toast.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>{toast.msg}</div>}

      <div className="space-y-6">
        <AdminCard className="p-6">
          <h3 className="text-white font-semibold mb-4">General</h3>
          <div className="space-y-4">
            <AdminInput label="Website Title" value={settings.website_title} onChange={(v) => setSettings({ ...settings, website_title: v })} />
            <AdminInput label="Meta Description" value={settings.meta_description} onChange={(v) => setSettings({ ...settings, meta_description: v })} textarea rows={2} />
            <div className="grid sm:grid-cols-2 gap-4">
              <AdminInput label="Main Heading" value={settings.main_heading} onChange={(v) => setSettings({ ...settings, main_heading: v })} />
              <AdminInput label="Main Subtitle" value={settings.main_subtitle} onChange={(v) => setSettings({ ...settings, main_subtitle: v })} />
            </div>
            <AdminInput label="Footer Text" value={settings.footer_text} onChange={(v) => setSettings({ ...settings, footer_text: v })} />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Branding</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <ImageUpload label="Logo" value={settings.logo_url} onChange={(url) => setSettings({ ...settings, logo_url: url })} folder="logo" />
            <ImageUpload label="Favicon" value={settings.favicon_url} onChange={(url) => setSettings({ ...settings, favicon_url: url })} folder="favicon" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Primary Color</label>
              <div className="flex gap-2">
                <input type="color" value={settings.primary_color} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-12 h-10 rounded-lg bg-transparent cursor-pointer" />
                <input type="text" value={settings.primary_color} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Secondary Color</label>
              <div className="flex gap-2">
                <input type="color" value={settings.secondary_color} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="w-12 h-10 rounded-lg bg-transparent cursor-pointer" />
                <input type="text" value={settings.secondary_color} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput label="Contact Email" value={settings.contact_email} onChange={(v) => setSettings({ ...settings, contact_email: v })} type="email" />
            <AdminInput label="Contact Phone" value={settings.contact_phone} onChange={(v) => setSettings({ ...settings, contact_phone: v })} />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-white font-semibold mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <AdminInput label="SEO Title" value={settings.seo_title} onChange={(v) => setSettings({ ...settings, seo_title: v })} />
            <AdminInput label="SEO Description" value={settings.seo_description} onChange={(v) => setSettings({ ...settings, seo_description: v })} textarea rows={2} />
            <AdminInput label="SEO Keywords" value={settings.seo_keywords} onChange={(v) => setSettings({ ...settings, seo_keywords: v })} placeholder="web developer, react, portfolio" />
            <ImageUpload label="Open Graph Image" value={settings.og_image_url} onChange={(url) => setSettings({ ...settings, og_image_url: url })} folder="seo" />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
