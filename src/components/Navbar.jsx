import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SignedIn from './SignedIn'
import SignedOut from './SignedOut'
import UserButton from './UserButton'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, supabase } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    checkIfAdmin()
  }, [user])

  const checkIfAdmin = async () => {
    if (!user) {
      setIsAdmin(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('users_roles')
        .select('is_admin')
        .eq('user_id', user.id)  // ✅ CORRIGÉ : user_id au lieu de id
        .maybeSingle()
      
      console.log('📊 Résultat:', { data, error })
      
      if (!error && data) {
        setIsAdmin(data.is_admin || false)
      } else {
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('❌ Erreur:', error)
      setIsAdmin(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 px-5 md:px-10 backdrop-blur-xl bg-gradient-to-b from-[var(--cream)] to-transparent">
      <nav className="flex justify-between items-center max-w-[1400px] mx-auto py-5">
        {/* Logo */}
        <Link
          to="/"
          className="font-fraunces text-5xl font-bold text-[var(--espresso)] no-underline tracking-tight hover:text-[var(--caramel)] transition-colors duration-300"
        >
          Doude
        </Link>

        {/* Navigation droite */}
        <div className="flex items-center gap-5">
          {/* Liens desktop */}
          <Link
            to="/tarifs"
            className="hidden md:flex items-center gap-2 py-2 px-4 text-[var(--espresso)] no-underline font-medium text-sm hover:text-[var(--sage)] hover:bg-[var(--cream)] rounded-lg transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            Tarifs
          </Link>
          <Link
            to="/contact"
            className="hidden md:flex items-center gap-2 py-2 px-4 text-[var(--espresso)] no-underline font-medium text-sm hover:text-[var(--sage)] hover:bg-[var(--cream)] rounded-lg transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Contact
          </Link>

          {/* NOUVEAU : Bouton Admin (visible seulement si admin) */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="hidden md:flex items-center gap-2 py-2 px-4 bg-red-600 text-white no-underline font-semibold text-sm hover:bg-red-700 rounded-lg transition-all duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Admin
            </Link>
          )}

          {/* Auth - Connecté */}
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* Auth - Non connecté */}
          <SignedOut>
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/sign-up"
                className="text-[var(--espresso)] font-medium text-sm hover:text-[var(--caramel)] transition-colors duration-300 no-underline"
              >
                Inscription
              </Link>
              <Link
                to="/sign-in"
                className="py-2 px-5 bg-[var(--caramel)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--caramel-dark)] transition-colors no-underline"
              >
                Connexion
              </Link>
            </div>
          </SignedOut>

          {/* Menu dropdown - uniquement si connecté */}
          <SignedIn>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-white text-[var(--espresso)] py-3 px-6 border-2 border-[var(--sand)] rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 hover:border-[var(--sage)] hover:shadow-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
                Menu
                <span className={`text-xs transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}>↓</span>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute top-[calc(100%+12px)] right-0 bg-white min-w-[240px] rounded-2xl overflow-hidden z-[1000] shadow-2xl border-2 border-[var(--sand)]">
                  {/* NOUVEAU : Lien Admin dans le dropdown mobile */}
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-4 px-6 bg-red-50 text-red-700 no-underline font-bold text-sm border-b-2 border-red-200 hover:bg-red-100 transition-all duration-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Dashboard Admin
                    </Link>
                  )}
                  
                  <Link
                    to="/suivi"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-4 px-6 text-[var(--espresso)] no-underline font-medium text-sm border-b border-[var(--cream)] hover:bg-[var(--cream)] hover:text-[var(--sage)] transition-all duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Suivi des élèves
                  </Link>
                  <Link
                    to="/emploi"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-4 px-6 text-[var(--espresso)] no-underline font-medium text-sm border-b border-[var(--cream)] hover:bg-[var(--cream)] hover:text-[var(--sage)] transition-all duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Emploi du temps
                  </Link>
                
                  <Link
                    to="/tarifs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-4 px-6 text-[var(--espresso)] no-underline font-medium text-sm border-b border-[var(--cream)] hover:bg-[var(--cream)] hover:text-[var(--sage)] transition-all duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    Tarifs
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-4 px-6 text-[var(--espresso)] no-underline font-medium text-sm hover:bg-[var(--cream)] hover:text-[var(--sage)] transition-all duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Contact
                  </Link>
                </div>
              )}
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}