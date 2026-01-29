export default function CGV() {
  return (
    <main className="flex-1 py-12 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-8">Conditions Générales de Vente</h1>

        <div className="space-y-8 text-[var(--espresso)]">
          {/* Préambule */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 1 - Objet</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles
                entre DUFFAU, auto-entrepreneur, SIRET 99221410600013, ci-après dénommé "Doude",
                et toute personne physique ou morale souscrivant à un abonnement aux services Doude,
                ci-après dénommée "l'Utilisateur" ou "le Client".
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                L'inscription aux services Doude implique l'acceptation pleine et entière des présentes CGV.
              </p>
            </div>
          </section>

          {/* Description des services */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 2 - Description des services</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                Doude est une plateforme en ligne destinée aux professeurs particuliers, proposant :
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Un outil de suivi des élèves (notes, progression, appréciations)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Un module de gestion de l'emploi du temps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Un outil de comptabilité (factures, gestion clients)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Des fonctionnalités avancées selon la formule choisie</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Formules et tarifs */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 3 - Formules et tarifs</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                Doude propose trois formules d'abonnement :
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-[var(--sand)] pl-4">
                  <p className="font-semibold text-[var(--espresso)]">Gratuit - 7€/mois</p>
                  <p className="text-sm text-[var(--espresso-light)]">Jusqu'à 5 élèves, fonctionnalités de base</p>
                </div>
                <div className="border-l-4 border-[var(--caramel)] pl-4">
                  <p className="font-semibold text-[var(--espresso)]">Premium - 12€/mois</p>
                  <p className="text-sm text-[var(--espresso-light)]">Jusqu'à 15 élèves, statistiques avancées</p>
                </div>
                <div className="border-l-4 border-[var(--sage)] pl-4">
                  <p className="font-semibold text-[var(--espresso)]">Pro - 20€/mois</p>
                  <p className="text-sm text-[var(--espresso-light)]">Élèves illimités, toutes fonctionnalités, support prioritaire</p>
                </div>
              </div>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Une réduction de 20% est accordée pour tout abonnement annuel. Les prix sont indiqués
                en euros TTC. Doude se réserve le droit de modifier ses tarifs, les nouveaux tarifs
                s'appliquant au renouvellement suivant.
              </p>
            </div>
          </section>

          {/* Essai gratuit */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 4 - Période d'essai</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Une période d'essai gratuite de 14 jours est offerte pour les formules Premium et Pro.
                Durant cette période, l'Utilisateur bénéficie de l'intégralité des fonctionnalités
                de la formule choisie. À l'issue de la période d'essai, l'abonnement est automatiquement
                activé, sauf résiliation par l'Utilisateur avant la fin de la période d'essai.
              </p>
            </div>
          </section>

          {/* Paiement */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 5 - Modalités de paiement</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Le paiement s'effectue par carte bancaire via notre prestataire de paiement sécurisé.
                L'abonnement est payable d'avance, mensuellement ou annuellement selon l'option choisie.
                Le renouvellement est automatique à chaque échéance, sauf résiliation préalable.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                En cas de défaut de paiement, Doude se réserve le droit de suspendre l'accès aux
                services jusqu'à régularisation de la situation.
              </p>
            </div>
          </section>

          {/* Droit de rétractation */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 6 - Droit de rétractation</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai
                de 14 jours à compter de la souscription pour exercer votre droit de rétractation,
                sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Pour exercer ce droit, envoyez un email à{' '}
                <a href="mailto:contactdoude@gmail.com" className="text-[var(--caramel)] hover:underline">
                  contactdoude@gmail.com
                </a>{' '}
                en indiquant clairement votre volonté de vous rétracter. Le remboursement sera effectué
                dans un délai de 14 jours suivant la réception de votre demande.
              </p>
            </div>
          </section>

          {/* Résiliation */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 7 - Résiliation</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                <strong>Par l'Utilisateur :</strong> L'Utilisateur peut résilier son abonnement à tout
                moment depuis son espace personnel ou par email. La résiliation prend effet à la fin
                de la période d'abonnement en cours. Aucun remboursement au prorata n'est effectué.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed">
                <strong>Par Doude :</strong> Doude se réserve le droit de résilier l'abonnement en cas
                de non-respect des présentes CGV, d'utilisation frauduleuse ou de non-paiement.
                L'Utilisateur en sera informé par email avec un préavis de 15 jours, sauf en cas
                de manquement grave nécessitant une suspension immédiate.
              </p>
            </div>
          </section>

          {/* Responsabilités */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 8 - Responsabilités</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                <strong>Obligations de Doude :</strong>
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)] mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Assurer la disponibilité du service (objectif de 99% de disponibilité)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Protéger les données personnelles conformément au RGPD</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Informer les Utilisateurs des évolutions majeures du service</span>
                </li>
              </ul>
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                <strong>Obligations de l'Utilisateur :</strong>
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Fournir des informations exactes lors de l'inscription</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Préserver la confidentialité de ses identifiants de connexion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Utiliser le service conformément à sa destination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span>Respecter les droits des tiers et la législation en vigueur</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 9 - Limitation de responsabilité</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Doude ne saurait être tenu responsable des dommages indirects, pertes de données,
                pertes de revenus ou de bénéfices, résultant de l'utilisation ou de l'impossibilité
                d'utiliser le service. La responsabilité de Doude est limitée au montant des sommes
                effectivement versées par l'Utilisateur au cours des 12 derniers mois.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Doude ne garantit pas que le service sera exempt d'erreurs ou d'interruptions.
                Des maintenances programmées peuvent occasionner des interruptions temporaires.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 10 - Propriété intellectuelle</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Le service Doude, son interface, ses fonctionnalités et son code source sont protégés
                par le droit de la propriété intellectuelle. L'Utilisateur bénéficie d'un droit d'usage
                personnel, non exclusif et non transférable, limité à la durée de son abonnement.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                L'Utilisateur conserve la propriété de toutes les données qu'il saisit sur la plateforme.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 11 - Données personnelles</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Le traitement des données personnelles est décrit dans notre{' '}
                <a href="/confidentialite" className="text-[var(--caramel)] hover:underline">
                  Politique de Confidentialité
                </a>.
                En utilisant nos services, l'Utilisateur accepte cette politique.
              </p>
            </div>
          </section>

          {/* Modification des CGV */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 12 - Modification des CGV</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Doude se réserve le droit de modifier les présentes CGV à tout moment. Les modifications
                seront notifiées par email au moins 30 jours avant leur entrée en vigueur. L'utilisation
                continue du service après cette date vaut acceptation des nouvelles CGV.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 13 - Droit applicable et litiges</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Les présentes CGV sont soumises au droit français. En cas de litige, une solution
                amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux
                français seront seuls compétents.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Conformément à l'article L612-1 du Code de la consommation, vous pouvez recourir
                gratuitement à un médiateur de la consommation en cas de litige.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">Article 14 - Contact</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Pour toute question relative aux présentes CGV :{' '}
                <a href="mailto:contactdoude@gmail.com" className="text-[var(--caramel)] hover:underline">
                  contactdoude@gmail.com
                </a>
              </p>
              <p className="text-[var(--espresso-light)] mt-2">
                DUFFAU - 323 avenue Paul Emile Victor, 77000 Melun, France
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
