import { supabase } from './supabase';

export async function verifyLinkCode(code) {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('link_code', code)
      .eq('code_used', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { valid: false, error: 'Code invalide ou déjà utilisé' };
      }
      throw error;
    }

    return { valid: true, studentData: data };
  } catch (error) {
    console.error('Erreur vérification code:', error);
    return { valid: false, error: 'Erreur lors de la vérification du code' };
  }
}

export async function linkStudentAccount(linkCode, clerkUserId) {
  try {
    const { data, error } = await supabase
      .from('students')
      .update({
        student_clerk_id: clerkUserId,
        code_used: true
      })
      .eq('link_code', linkCode)
      .eq('code_used', false)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Erreur liaison compte:', error);
    return { success: false, error: error.message };
  }
}