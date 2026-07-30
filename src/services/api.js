import { supabase } from '../supabaseClient';

/**
 * Submit an infrastructure report.
 * Uploads photo to Supabase Storage (if provided), then inserts the report row.
 */
export async function submitReport({ category, title, description, latitude, longitude }, photoFile) {
  let photo_url = null;

  // Upload photo if provided
  if (photoFile) {
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `reports/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(filePath, photoFile);

    if (uploadError) return { data: null, error: uploadError };

    const { data: urlData } = supabase.storage
      .from('report-photos')
      .getPublicUrl(filePath);

    photo_url = urlData.publicUrl;
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: 'You must be logged in to submit a report.' } };

  const { data, error } = await supabase
    .from('reports')
    .insert([{
      user_id: user.id,
      category,
      title,
      description,
      photo_url,
      latitude: latitude || null,
      longitude: longitude || null,
      status: 'Pending',
    }])
    .select()
    .single();

  return { data, error };
}

/**
 * Fetch all reports for the currently logged-in user.
 */
export async function getMyReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}
