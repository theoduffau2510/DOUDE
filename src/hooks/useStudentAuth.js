import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useStudentAuth() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer le rôle
  const fetchUserRole = async (userId) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('users_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erreur récupération rôle:', error);
        return null;
      }
      
      console.log('🎭 Rôle récupéré:', data?.role);
      return data?.role;
    } catch (err) {
      // Ignore les erreurs d'abort (normales quand le composant se démonte)
      if (err.name === 'AbortError' || err.message?.includes('AbortError')) {
        console.log('⏸️ Requête rôle annulée (normal)');
        return null;
      }
      console.error('Erreur fetchUserRole:', err);
      return null;
    }
  };

  // Fonction pour récupérer les données élève
  const fetchStudentData = async (userId) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erreur recherche élève:', error);
        return null;
      }
      
      console.log('✅ Données élève trouvées:', data);
      return data;
    } catch (err) {
      // Ignore les erreurs d'abort
      if (err.name === 'AbortError' || err.message?.includes('AbortError')) {
        console.log('⏸️ Requête élève annulée (normal)');
        return null;
      }
      console.error('Erreur fetchStudentData:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const currentUser = session?.user ?? null;
        
        if (!isMounted) return;
        setUser(currentUser);

        if (currentUser) {
          const role = await fetchUserRole(currentUser.id);
          if (!isMounted) return;
          setUserRole(role);

          if (role === 'eleve') {
            console.log('🔍 Recherche des données élève pour:', currentUser.id);
            const student = await fetchStudentData(currentUser.id);
            if (!isMounted) return;
            setStudentData(student);
          } else {
            setStudentData(null);
          }
        }
      } catch (err) {
        console.error('Erreur initialisation Auth:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // Écouteur pour les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      const currentUser = session?.user ?? null;
      
      if (!isMounted) return;
      setUser(currentUser);

      if (currentUser) {
        const role = await fetchUserRole(currentUser.id);
        if (!isMounted) return;
        setUserRole(role);

        if (role === 'eleve') {
          const student = await fetchStudentData(currentUser.id);
          if (!isMounted) return;
          setStudentData(student);
        } else {
          setStudentData(null);
        }
      } else {
        setUserRole(null);
        setStudentData(null);
      }
      
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Fonction refetch pour recharger les données
  const refetch = async () => {
    if (user && userRole === 'eleve') {
      const student = await fetchStudentData(user.id);
      setStudentData(student);
    }
  };
  
  return {
    user,
    userRole,
    loading,
    error,
    isAuthenticated: !!user,
    isStudent: userRole === 'eleve',
    studentData,
    supabaseClient: supabase
  };
}