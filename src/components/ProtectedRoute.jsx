import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="w-12 h-12 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Si pas connecté, rediriger vers sign-in
  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  // Si c'est un élève qui essaie d'accéder aux pages prof
  const role = user.user_metadata?.role
  if (role === 'eleve') {
    return <Navigate to="/parent" replace />
  }

  return children
}