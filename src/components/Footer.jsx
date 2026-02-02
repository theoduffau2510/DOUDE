import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Footer({ showTransition = false }) {
  const { user } = useAuth()
  const isStudent = user?.user_metadata?.role === 'eleve'

  // Dégradé complet si transition, sinon juste espresso
  const footerBg = showTransition
    ? 'bg-gradient-to-b from-[var(--cream)] via-[var(--caramel)] via-30% to-[var(--espresso)] to-60%'
    : 'bg-[var(--espresso)]'

  return (
    <footer className={`${footerBg} text-[var(--cream)]`}>
      {/* Section CTA (sauf page Home) */}
      {showTransition && (
        <div className="py-20 px-5 md:px-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-fraunces text-3xl md:text-4xl font-bold mb-4">
              Une question ?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Notre équipe est là pour vous accompagner.
            </p>
            <Link
              to="/contact"
              className="inline-block py-3 px-8 bg-white text-[var(--caramel)] rounded-full font-semibold hover:shadow-xl transition-all no-underline"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      )}

      {/* Contenu du footer */}
      <div className="pt-16 px-5 md:px-10 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Section Doude */}
          <div>
            <h4 className="font-fraunces text-2xl mb-4 text-white">Doude</h4>
            <p className="opacity-80 text-sm leading-relaxed">
              L'outil de gestion pensé pour les professeurs particuliers. Simplifiez votre quotidien.
            </p>
          </div>

          {/* Section Dynamique : Produit ou Espace Parent */}
          <div>
            {isStudent ? (
              <>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--caramel)]">Mon Espace</h4>
                <Link to="/parent/suivi" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
                  Mon suivi
                </Link>
                <Link to="/parent/emploi" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
                  Mon emploi du temps
                </Link>
              </>
            ) : (
              <>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--caramel)]">Produit</h4>
                <Link to="/suivi" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
                  Suivi des élèves
                </Link>
                <Link to="/emploi" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
                  Emploi du temps
                </Link>
                <Link to="/tarifs" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
                  Tarifs
                </Link>
              </>
            )}
          </div>

          {/* Section Support */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--caramel)]">Support</h4>
            <Link to="/contact" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
              Nous contacter
            </Link>
            <Link to="/faq" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
              FAQ
            </Link>
            <Link to="/aide" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
              Centre d'aide
            </Link>
          </div>

          {/* Section Légal */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--caramel)]">Légal</h4>
            <Link to="/mentions-legales" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
              Confidentialité
            </Link>
            <Link to="/cgv" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
              CGV
            </Link>
            <Link to="/cgu" className="block text-[var(--cream)] opacity-80 no-underline py-2 text-sm hover:opacity-100 hover:translate-x-1 hover:text-[var(--caramel)] transition-all duration-200">
            CGU
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm opacity-60">
          © 2025 Doude. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
