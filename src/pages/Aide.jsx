import { useState } from 'react'

function GuideSection({ title, icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-[var(--cream)] transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold text-[var(--espresso)]">{title}</span>
        </span>
        <span className={`text-xl text-[var(--caramel)] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-[var(--cream)]">
          {children}
        </div>
      )}
    </div>
  )
}

function Step({ number, title, children }) {
  return (
    <div className="flex gap-4 py-4">
      <div className="flex-shrink-0 w-8 h-8 bg-[var(--caramel)] text-white rounded-full flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-[var(--espresso)] mb-1">{title}</h4>
        <p className="text-[var(--espresso-light)] text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

export default function Aide() {
  return (
    <main className="flex-1 py-12 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-4">Centre d'aide</h1>
          <p className="text-[var(--espresso-light)]">
            Guides et tutoriels pour bien utiliser Doude
          </p>
        </div>

        {/* Quick start */}
        <div className="bg-[var(--sand)] rounded-2xl p-6 mb-8">
          <h2 className="font-fraunces text-xl text-[var(--espresso)] font-bold mb-4">🚀 Démarrage rapide</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="#suivi" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">👨‍🎓</div>
              <h3 className="font-semibold text-[var(--espresso)] text-sm">Suivi des élèves</h3>
              <p className="text-xs text-[var(--espresso-light)] mt-1">Gérer vos élèves et leurs notes</p>
            </a>
            <a href="#emploi" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold text-[var(--espresso)] text-sm">Emploi du temps</h3>
              <p className="text-xs text-[var(--espresso-light)] mt-1">Organiser votre planning</p>
            </a>
            <a href="#compta" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-[var(--espresso)] text-sm">Comptabilité</h3>
              <p className="text-xs text-[var(--espresso-light)] mt-1">Factures et clients</p>
            </a>
          </div>
        </div>

        {/* Guides détaillés */}
        <div className="space-y-4">

          {/* Premiers pas */}
          <GuideSection title="Premiers pas avec Doude" icon="🎯" defaultOpen={true}>
            <div className="pt-4 space-y-0 divide-y divide-[var(--cream)]">
              <Step number="1" title="Créez votre compte">
                Cliquez sur "Essai gratuit 14 jours" sur la page d'accueil. Inscrivez-vous avec votre email ou connectez-vous via Google. Aucune carte bancaire n'est requise pour l'essai.
              </Step>
              <Step number="2" title="Explorez le tableau de bord">
                Une fois connecté, vous accédez à votre espace personnel. Utilisez le menu pour naviguer entre les différentes sections : Suivi, Emploi du temps, Comptabilité.
              </Step>
              <Step number="3" title="Ajoutez votre premier élève">
                Dans "Suivi", cliquez sur "+ Ajouter un élève". Renseignez son nom, niveau scolaire, matière enseignée et objectif de note. Vous pourrez ensuite suivre sa progression.
              </Step>
              <Step number="4" title="Configurez votre emploi du temps">
                Dans "Emploi du temps", définissez vos disponibilités en cliquant sur les créneaux horaires. Vous pouvez marquer les créneaux comme disponibles, réservés ou effectués.
              </Step>
            </div>
          </GuideSection>

          {/* Suivi des élèves */}
          <GuideSection title="Suivi des élèves" icon="👨‍🎓" id="suivi">
            <div className="pt-4 space-y-0 divide-y divide-[var(--cream)]">
              <Step number="1" title="Ajouter un élève">
                Cliquez sur "+ Ajouter un élève" et remplissez les informations : nom complet, niveau (6ème à Terminale+), matière, téléphone (optionnel), et objectif de note sur 20.
              </Step>
              <Step number="2" title="Consulter une fiche élève">
                Cliquez sur la ligne d'un élève dans le tableau pour ouvrir sa fiche détaillée. Vous y verrez ses statistiques, notes, courbe de progression et appréciation.
              </Step>
              <Step number="3" title="Ajouter une note">
                Dans la fiche élève, cliquez sur "+ Ajouter une note". Saisissez la note sur 20, la date et une description (ex: "Contrôle chapitre 3"). La moyenne et progression se calculent automatiquement.
              </Step>
              <Step number="4" title="Définir un objectif personnalisé">
                En version Pro, vous pouvez modifier l'objectif de note pour chaque élève. La progression est calculée par rapport à cet objectif (ex: 12/20 avec objectif 14 = 85%).
              </Step>
              <Step number="5" title="Rédiger une appréciation">
                Dans la fiche élève, utilisez le champ "Appréciation générale" pour noter vos observations. Ces notes sont sauvegardées automatiquement.
              </Step>
              <Step number="6" title="Exporter en PDF (Pro)">
                En version Pro, cliquez sur "Exporter PDF" pour générer une fiche complète de l'élève avec toutes ses informations, notes et appréciation.
              </Step>
            </div>
          </GuideSection>

          {/* Emploi du temps */}
          <GuideSection title="Emploi du temps" icon="📅" id="emploi">
            <div className="pt-4 space-y-0 divide-y divide-[var(--cream)]">
              <Step number="1" title="Naviguer dans le calendrier">
                Utilisez les flèches ← → pour naviguer entre les semaines. La semaine en cours est affichée par défaut avec les jours de lundi à dimanche.
              </Step>
              <Step number="2" title="Gérer les créneaux horaires">
                Cliquez sur un créneau pour ouvrir le menu de gestion. Vous pouvez le marquer comme : Disponible (vert), Réservé (orange), Effectué (gris) ou Indisponible (rouge).
              </Step>
              <Step number="3" title="Visualiser votre semaine">
                Les créneaux sont affichés par heure (8h-20h) et par jour. Les couleurs vous permettent de voir d'un coup d'œil vos disponibilités et cours planifiés.
              </Step>
            </div>
            <div className="mt-4 p-4 bg-[var(--cream)] rounded-xl">
              <p className="text-sm text-[var(--espresso-light)]">
                <strong>💡 Astuce :</strong> La synchronisation avec Google Calendar sera bientôt disponible pour les abonnés Premium et Pro.
              </p>
            </div>
          </GuideSection>

          {/* Comptabilité */}
          <GuideSection title="Comptabilité" icon="💰" id="compta">
            <div className="pt-4 space-y-0 divide-y divide-[var(--cream)]">
              <Step number="1" title="Ajouter un client">
                Cliquez sur "+ Nouveau client". Renseignez les informations : nom, prénom, adresse, email, téléphone. Vous pouvez aussi ajouter les coordonnées bancaires (RIB/IBAN) pour vos factures.
              </Step>
              <Step number="2" title="Créer une facture">
                Cliquez sur "+ Nouvelle facture". Sélectionnez un client existant, indiquez le montant, la date et une description du service. Un numéro de facture est généré automatiquement.
              </Step>
              <Step number="3" title="Suivre les paiements">
                Chaque facture a un statut : "En attente" ou "Payée". Cliquez sur le badge de statut pour le modifier. Le tableau de bord affiche vos totaux en temps réel.
              </Step>
              <Step number="4" title="Consulter les statistiques">
                L'onglet "Statistiques" affiche un résumé : nombre de factures, total facturé, montant payé, en attente, et taux de paiement.
              </Step>
            </div>
            <div className="mt-4 p-4 bg-[var(--cream)] rounded-xl">
              <p className="text-sm text-[var(--espresso-light)]">
                <strong>💡 Note :</strong> Les informations bancaires de vos clients sont stockées de manière sécurisée et ne sont accessibles que par vous.
              </p>
            </div>
          </GuideSection>

          {/* Raccourcis et astuces */}
          <GuideSection title="Astuces et bonnes pratiques" icon="💡">
            <div className="pt-4 space-y-4">
              <div className="p-4 bg-[var(--cream)] rounded-xl">
                <h4 className="font-semibold text-[var(--espresso)] mb-2">🎯 Définissez des objectifs réalistes</h4>
                <p className="text-sm text-[var(--espresso-light)]">
                  Un objectif bien calibré motive l'élève. Commencez par +2 points par rapport à sa moyenne actuelle.
                </p>
              </div>
              <div className="p-4 bg-[var(--cream)] rounded-xl">
                <h4 className="font-semibold text-[var(--espresso)] mb-2">📝 Notez régulièrement</h4>
                <p className="text-sm text-[var(--espresso-light)]">
                  Enregistrez les notes après chaque cours pour avoir une courbe de progression précise et motivante.
                </p>
              </div>
              <div className="p-4 bg-[var(--cream)] rounded-xl">
                <h4 className="font-semibold text-[var(--espresso)] mb-2">💰 Facturez rapidement</h4>
                <p className="text-sm text-[var(--espresso-light)]">
                  Créez vos factures en fin de mois pour garder une comptabilité à jour et faciliter vos déclarations.
                </p>
              </div>
              <div className="p-4 bg-[var(--cream)] rounded-xl">
                <h4 className="font-semibold text-[var(--espresso)] mb-2">📅 Bloquez vos indisponibilités</h4>
                <p className="text-sm text-[var(--espresso-light)]">
                  Marquez vos créneaux personnels comme indisponibles pour mieux visualiser vos vraies disponibilités.
                </p>
              </div>
            </div>
          </GuideSection>

        </div>

        {/* Contact support */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm text-center">
          <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold mb-2">
            Besoin d'aide supplémentaire ?
          </h3>
          <p className="text-[var(--espresso-light)] mb-6">
            Notre équipe répond généralement sous 24h
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/faq"
              className="py-3 px-6 bg-[var(--cream)] text-[var(--espresso)] rounded-full font-semibold text-sm hover:bg-[var(--sand)] transition-colors"
            >
              Consulter la FAQ
            </a>
            <a
              href="/contact"
              className="py-3 px-6 bg-[var(--espresso)] text-[var(--cream)] rounded-full font-semibold text-sm hover:bg-[var(--caramel-dark)] transition-colors"
            >
              Contacter le support
            </a>
          </div>
        </div>

        {/* Raccourcis contact */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-[var(--sand)] rounded-2xl p-6">
            <h4 className="font-semibold text-[var(--espresso)] mb-2">📧 Par email</h4>
            <a href="mailto:contact@doude.app" className="text-[var(--caramel)] hover:underline">
              contact@doude.app
            </a>
          </div>
          <div className="bg-[var(--sand)] rounded-2xl p-6">
            <h4 className="font-semibold text-[var(--espresso)] mb-2">🐦 Sur Twitter</h4>
            <a href="https://twitter.com/doude_app" target="_blank" rel="noopener noreferrer" className="text-[var(--caramel)] hover:underline">
              @doude_app
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
