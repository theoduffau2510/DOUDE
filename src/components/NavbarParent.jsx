import { useState } from 'react'
import { Link } from 'react-router-dom'
import SignedIn from './SignedIn'
import UserButton from './UserButton'

export default function NavbarParent() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-5 md:px-10 backdrop-blur-xl bg-gradient-to-b from-[var(--cream)] to-transparent">
      <nav className="flex justify-between items-center max-w-[1400px] mx-auto py-5">
        {/* Logo */}
        <Link
          to="/parent"
          className="font-fraunces text-5xl font-bold text-[var(--espresso)] no-underline tracking-tight hover:text-[var(--caramel)] transition-colors duration-300"
        >
          Doude
        </Link>

        {/* Navigation droite */}
        <div className="flex items-center gap-5">
          {/* Liens desktop */}
          <Link
            to="/parent/emploi"
            className="hidden md:block text-[var(--espresso)] no-underline font-medium text-[15px] hover:text-[var(--caramel)] transition-colors duration-300"
          >
            Emploi du temps
          </Link>
          <Link
            to="/parent/suivi"
            className="hidden md:block text-[var(--espresso)] no-underline font-medium text-[15px] hover:text-[var(--caramel)] transition-colors duration-300"
          >
            Suivi
          </Link>

          {/* User Button */}
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* Menu dropdown mobile */}
          <div className="relative md:hidden">
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
                <Link
                  to="/parent"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-4 px-6 text-[var(--espresso)] no-underline font-medium text-sm border-b border-[var(--cream)] hover:bg-[var(--cream)] hover:text-[var(--sage)] transition-all duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Tableau de bord
                </Link>
                <Link
                  to="/parent/emploi"
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
                  to="/parent/suivi"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-4 px-6 text-[var(--espresso)] no-underline font-medium text-sm hover:bg-[var(--cream)] hover:text-[var(--sage)] transition-all duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                  Suivi scolaire
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}