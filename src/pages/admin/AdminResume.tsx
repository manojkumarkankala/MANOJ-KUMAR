import { useEffect, useState } from 'react';
import { Upload, Trash2, FileText, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadResumeFile, deleteFile } from '@/lib/storage';
import { AdminHeader, AdminCard, AdminButton } from '@/components/admin/AdminUI';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { Resume } from '@/types';

export function AdminResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    supabase.from('resume').select('*').order('uploaded_at', { ascending: false }).limit(1).maybeSingle().then(({ data }) => {
      setResume(data as Resume | null);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    const { url, error: uploadError } = await uploadResumeFile(file);
    if (uploadError) {
      setError(uploadError);
      setUploading(false);
      return;
    }

    if (resume) {
      await deleteFile(resume.file_url);
      await supabase.from('resume').delete().eq('id', resume.id);
    }

    const { data } = await supabase.from('resume').insert({ file_url: url, file_name: file.name }).select().maybeSingle();
    setResume(data as Resume | null);
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!resume) return;
    await deleteFile(resume.file_url);
    await supabase.from('resume').delete().eq('id', resume.id);
    setResume(null);
    setShowDelete(false);
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <AdminHeader title="Resume Management" subtitle="Upload and manage your resume PDF" />

      <div className="max-w-2xl">
        <AdminCard className="p-6">
          {resume ? (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center text-blue-400">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{resume.file_name}</h3>
                  <p className="text-gray-500 text-sm">Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                  <AdminButton variant="secondary"><FileText className="w-4 h-4" /> View</AdminButton>
                </a>
                <a href={resume.file_url} download>
                  <AdminButton variant="secondary"><Download className="w-4 h-4" /> Download</AdminButton>
                </a>
                <AdminButton variant="danger" onClick={() => setShowDelete(true)}><Trash2 className="w-4 h-4" /> Delete</AdminButton>
              </div>

              <div className="border-t border-white/10 pt-6">
                <label className="block text-sm text-gray-400 mb-2">Upload New Resume (replaces current)</label>
                <label className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-blue-400/30 transition-all cursor-pointer">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  <span className="text-sm">{uploading ? 'Uploading...' : 'Choose PDF file (max 10MB)'}</span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-gray-400 mb-4">No resume uploaded yet.</p>
              <label className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 font-medium rounded-xl cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-sm">{uploading ? 'Uploading...' : 'Upload Resume PDF'}</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              </label>
            </div>
          )}

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </AdminCard>
      </div>

      <ConfirmDialog open={showDelete} title="Delete Resume" message="Are you sure you want to delete your resume?" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </div>
  );
}
