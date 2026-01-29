export default function Confidentialite() {
  return (
    <main className="flex-1 py-12 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-8">Politique de Confidentialité</h1>

        <div className="space-y-8 text-[var(--espresso)]">
          {/* Introduction */}
          <section>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                La présente politique de confidentialité décrit comment Doude collecte, utilise et protège
                vos données personnelles conformément au Règlement Général sur la Protection des Données
                (RGPD) et à la loi Informatique et Libertés.
              </p>
            </div>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">1. Responsable du traitement</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
              <p><strong>Responsable :</strong> DUFFAU</p>
              <p><strong>Adresse :</strong> 323 avenue Paul Emile Victor, 77000 Melun, France</p>
              <p><strong>Email :</strong> contactdoude@gmail.com</p>
              <p><strong>SIRET :</strong> 99221410600013</p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">2. Données collectées</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] mb-4">Nous collectons les données suivantes :</p>
              <ul className="space-y-3 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données d'identification :</strong> nom, prénom, adresse email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données de contact :</strong> numéro de téléphone, adresse postale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données de vos élèves :</strong> nom, niveau scolaire, notes, progression</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données de facturation :</strong> informations clients, montants, dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données bancaires :</strong> RIB/IBAN (pour la facturation de vos clients)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données de connexion :</strong> adresse IP, type de navigateur, pages visitées</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Finalités */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">3. Finalités du traitement</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] mb-4">Vos données sont utilisées pour :</p>
              <ul className="space-y-3 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>La création et la gestion de votre compte utilisateur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>La fourniture de nos services (suivi élèves, comptabilité, emploi du temps)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>La facturation et le paiement de l'abonnement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>L'envoi de communications relatives à votre compte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>L'amélioration de nos services et de l'expérience utilisateur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Le respect de nos obligations légales</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">4. Base légale du traitement</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <ul className="space-y-3 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Exécution du contrat :</strong> traitement nécessaire à la fourniture de nos services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Consentement :</strong> pour l'envoi de newsletters (si applicable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Obligation légale :</strong> conservation des factures, déclarations fiscales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Intérêt légitime :</strong> amélioration des services, sécurité du site</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Destinataires */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">5. Destinataires des données</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] mb-4">Vos données peuvent être partagées avec :</p>
              <ul className="space-y-3 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Supabase :</strong> hébergement de la base de données (Union Européenne)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Vercel :</strong> hébergement du site web (États-Unis)</span>
                </li>
              </ul>
              <p className="text-[var(--espresso-light)] mt-4">
                Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </div>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">6. Durée de conservation</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <ul className="space-y-3 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données de compte :</strong> pendant la durée de votre abonnement + 3 ans</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données de facturation :</strong> 10 ans (obligation légale comptable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Données de connexion :</strong> 1 an</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Cookies :</strong> 13 mois maximum</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">7. Vos droits</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="space-y-3 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span><strong>Droit de rectification :</strong> corriger des données inexactes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span><strong>Droit à l'effacement :</strong> demander la suppression de vos données</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span><strong>Droit à la limitation :</strong> limiter le traitement de vos données</span>
                </li>
              </ul>
              <p className="text-[var(--espresso-light)] mt-4">
                Pour exercer ces droits, contactez-nous à :{' '}
                <a href="mailto:contactdoude@gmail.com" className="text-[var(--caramel)] hover:underline">
                  contactdoude@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">8. Sécurité des données</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
                protéger vos données personnelles contre la destruction, la perte, l'altération,
                la divulgation ou l'accès non autorisé, notamment :
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)] mt-4">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Chiffrement des données en transit (HTTPS/TLS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Contrôle d'accès aux données (Row Level Security)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--sage)]">✓</span>
                  <span>Hébergement sécurisé chez des prestataires certifiés</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">9. Cookies</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed mb-4">
                Notre site utilise uniquement des cookies strictement nécessaires au fonctionnement
                du service :
              </p>
              <ul className="space-y-2 text-[var(--espresso-light)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Cookies d'authentification :</strong> pour maintenir votre session de connexion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--caramel)]">•</span>
                  <span><strong>Cookies de préférences :</strong> pour mémoriser vos choix d'interface</span>
                </li>
              </ul>
              <p className="text-[var(--espresso-light)] mt-4">
                Nous n'utilisons pas de cookies publicitaires ni de cookies de tracking tiers.
              </p>
            </div>
          </section>

          {/* Réclamation */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">10. Réclamation</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Si vous estimez que le traitement de vos données personnelles constitue une violation
                du RGPD, vous avez le droit d'introduire une réclamation auprès de la CNIL
                (Commission Nationale de l'Informatique et des Libertés) :{' '}
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[var(--caramel)] hover:underline">
                  www.cnil.fr
                </a>
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">11. Modifications</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
                En cas de modification substantielle, nous vous en informerons par email ou via une
                notification sur le site.
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
