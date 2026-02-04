import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const lastRefreshRef = useRef(Date.now())

  // Fonction de refresh de session réutilisable
  const refreshSession = useCallback(async () => {
    const now = Date.now()
    // Éviter les appels trop rapprochés (minimum 2 secondes entre chaque)
    if (now - lastRefreshRef.current < 2000) return

    lastRefreshRef.current = now
    console.log('🔐 Refresh session auth...')

    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
  }, [])

  useEffect(() => {
    // Récupérer la session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'auth (login, logout, token refresh automatique)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state change:', event)
      setUser(session?.user ?? null)
    })

    // Rafraîchir la session quand l'utilisateur revient sur la page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSession()
      }
    }

    // Rafraîchir la session quand la fenêtre gagne le focus
    const handleFocus = () => {
      refreshSession()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    // Polling de session toutes les 5 minutes pour garder la session fraîche
    const sessionInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshSession()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      clearInterval(sessionInterval)
    }
  }, [refreshSession])

  const signUp = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/sign-in` 
    }
  })
  return { data, error }
}

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    supabase
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { supabase }