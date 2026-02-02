export default function CGU() {
  return (
    <main className="flex-1 py-12 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-8">
          Conditions Générales d'Utilisation
        </h1>

        <div className="space-y-8 text-[var(--espresso)]">
          {/* Préambule */}
          <section>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) définissent les règles
                d'utilisation de la plateforme Doude, accessible à l'adresse [VOTRE URL].
                En accédant et en utilisant Doude, vous acceptez sans réserve les présentes CGU.
              </p>
            </div>
          </section>

          {/* Objet */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 1 - Objet
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Doude est une plateforme en ligne destinée aux professeurs particuliers,
                leur permettant de gérer leurs élèves, leur emploi du temps et leur comptabilité.
                Ces CGU ont pour objet de définir les conditions d'accès et d'utilisation
                de cette plateforme.
              </p>
            </div>
          </section>

          {/* Acceptation */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 2 - Acceptation des CGU
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                L'utilisation de Doude implique l'acceptation pleine et entière des présentes CGU.
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                Nous nous réservons le droit de modifier ces CGU à tout moment.
                Les modifications prendront effet dès leur publication sur le site.
              </p>
            </div>
          </section>

          {/* Inscription */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 3 - Inscription et compte utilisateur
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                Pour utiliser Doude, vous devez créer un compte en fournissant des informations
                exactes, à jour et complètes. Vous êtes seul responsable de :
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>La confidentialité de vos identifiants de connexion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Toute activité effectuée depuis votre compte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>La mise à jour de vos informations personnelles</span>
                </li>
              </ul>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Vous devez avoir au moins 18 ans pour créer un compte. Vous vous engagez à
                informer immédiatement Doude de toute utilisation non autorisée de votre compte.
              </p>
            </div>
          </section>

          {/* Utilisation */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 4 - Utilisation de la plateforme
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                <strong>Vous vous engagez à :</strong>
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)] mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Utiliser Doude conformément à sa destination (gestion de cours particuliers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Respecter les lois et réglementations en vigueur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Ne pas porter atteinte aux droits de tiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Respecter la confidentialité des données de vos élèves</span>
                </li>
              </ul>
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                <strong>Il est strictement interdit de :</strong>
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Utiliser Doude à des fins illégales ou frauduleuses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Tenter d'accéder aux comptes d'autres utilisateurs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Diffuser des virus ou tout code malveillant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Extraire ou copier de manière automatisée des données du site</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Revendre ou transférer votre compte à un tiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Tenter de contourner les mesures de sécurité</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contenu utilisateur */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 5 - Contenu utilisateur
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Vous conservez la propriété de toutes les données que vous saisissez sur Doude
                (informations sur vos élèves, notes, factures, etc.). Vous accordez à Doude
                une licence limitée pour héberger, stocker et traiter ces données dans le seul
                but de vous fournir nos services.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Vous êtes seul responsable du contenu que vous publiez et devez disposer de
                tous les droits nécessaires. Vous vous engagez à ne pas publier de contenu
                illégal, offensant ou portant atteinte aux droits de tiers.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 6 - Propriété intellectuelle
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Doude, son interface, ses fonctionnalités, son design et tous les éléments
                qui le composent (textes, images, graphismes, logo, etc.) sont protégés
                par le droit de la propriété intellectuelle. Toute reproduction, représentation,
                modification ou exploitation non autorisée est interdite et constitue une
                contrefaçon sanctionnée par le Code de la propriété intellectuelle.
              </p>
            </div>
          </section>

          {/* Disponibilité */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 7 - Disponibilité du service
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Nous nous efforçons d'assurer une disponibilité maximale de Doude (objectif de 99%).
                Toutefois, des interruptions peuvent survenir pour des raisons de maintenance,
                de mise à jour ou pour des causes indépendantes de notre volonté (panne,
                cas de force majeure, etc.).
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Nous ne saurions être tenus responsables des interruptions temporaires du service
                et des conséquences qui pourraient en découler.
              </p>
            </div>
          </section>

          {/* Résiliation */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 8 - Suspension et résiliation
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                Doude se réserve le droit de suspendre ou de résilier votre accès au service,
                sans préavis ni indemnité, en cas de :
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Violation des présentes CGU</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Non-paiement de votre abonnement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Utilisation frauduleuse ou abusive du service</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Activité portant atteinte à la sécurité ou à la réputation de Doude</span>
                </li>
              </ul>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Vous pouvez également résilier votre compte à tout moment depuis votre espace
                personnel ou en nous contactant.
              </p>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 9 - Limitation de responsabilité
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Doude est fourni "en l'état". Nous ne garantissons pas que le service sera
                exempt d'erreurs, de bugs ou d'interruptions. Notre responsabilité est limitée
                au montant des sommes effectivement versées par l'utilisateur au cours des
                12 derniers mois.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Nous ne saurions être tenus responsables des dommages indirects, tels que
                pertes de données, pertes de revenus, préjudice commercial ou autres
                dommages immatériels résultant de l'utilisation ou de l'impossibilité
                d'utiliser Doude.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 10 - Données personnelles
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Le traitement de vos données personnelles est décrit dans notre{' '}
                <a href="/confidentialite" className="text-[var(--caramel)] hover:underline">
                  Politique de Confidentialité
                </a>.
                En utilisant Doude, vous acceptez cette politique.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 11 - Droit applicable et litiges
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Les présentes CGU sont régies par le droit français. En cas de litige,
                une solution amiable sera recherchée avant toute action judiciaire.
                À défaut, les tribunaux français seront seuls compétents.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">
              Article 12 - Contact
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Pour toute question relative aux présentes CGU, contactez-nous à :{' '}
                <a href="mailto:contactdoude@gmail.com" className="text-[var(--caramel)] hover:underline">
                  contactdoude@gmail.com
                </a>
              </p>
            </div>
          </section>

          <p className="text-sm text-[var(--espresso-light)] text-center pt-8">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </div>
    </main>
  )
}