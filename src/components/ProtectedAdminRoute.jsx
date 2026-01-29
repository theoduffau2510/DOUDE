import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { user, loading: authLoading, supabase } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
  }, [user])

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Vérifier dans la base si l'utilisateur est admin
      const { data, error } = await supabase
  .from('users_roles')
  .select('is_admin')
  .eq('user_id', user.id)
  .maybeSingle()  // ✅ Ajoute ça

      if (error) {
        console.error('Erreur vérification admin:', error)
        setIsAdmin(false)
      } else {
        setIsAdmin(data?.is_admin || false)
      }
    } catch (error) {
      console.error('Erreur:', error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--espresso-light)]">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // Vérifier si l'utilisateur est connecté
  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  // Vérifier si l'utilisateur est admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-5">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="font-fraunces text-2xl font-bold text-[var(--espresso)] mb-2">
            Accès refusé
          </h1>
          <p className="text-[var(--espresso-light)] mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="w-full py-3 bg-[var(--caramel)] text-white rounded-xl font-semibold hover:bg-[var(--caramel-dark)] transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  return children
}