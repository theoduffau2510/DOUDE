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

export async function linkStudentAccount(linkCode, email, password) {
  try {
    // 1. Créer le compte Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error('Erreur lors de la création du compte');

    // 2. Appeler la fonction SQL sécurisée
    const { data, error } = await supabase.rpc('link_student_account', {
      p_link_code: linkCode,
      p_user_id: userId
    });

    if (error) throw error;

    return { success: true, data: data[0], user: authData.user };
  } catch (error) {
    console.error('Erreur liaison compte:', error);
    return { success: false, error: error.message };
  }
}

// Fonction pour lier un compte existant (utilisateur déjà connecté)
export async function linkExistingAccount(linkCode) {
  try {
    // Récupérer l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Vous devez être connecté pour lier un compte');
    }

    // Appeler la fonction SQL sécurisée
    const { data, error } = await supabase.rpc('link_student_account', {
      p_link_code: linkCode,
      p_user_id: user.id
    });

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Erreur liaison compte existant:', error);
    return { success: false, error: error.message };
  }
}