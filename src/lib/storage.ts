import { supabase, STORAGE_BUCKET } from './supabase';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 5MB limit.';
  }
  return null;
}

export async function uploadImage(file: File, folder: string): Promise<{ url: string; error: string | null }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { url: '', error: validationError };
  }

  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
  if (error) {
    return { url: '', error: error.message };
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

export async function uploadResumeFile(file: File): Promise<{ url: string; error: string | null }> {
  if (file.type !== 'application/pdf') {
    return { url: '', error: 'Only PDF files are allowed for resume.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { url: '', error: 'Resume file size exceeds 10MB limit.' };
  }

  const fileName = `resume/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
  if (error) {
    return { url: '', error: error.message };
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split(`/${STORAGE_BUCKET}/`)[1];
    if (path) {
      await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    }
  } catch {
    // If URL parsing fails, skip deletion
  }
}
