export default function MentionsLegales() {
  return (
    <main className="flex-1 py-12 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-8">Mentions Légales</h1>

        <div className="space-y-8 text-[var(--espresso)]">
          {/* Éditeur du site */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">1. Éditeur du site</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
              <p><strong>Nom :</strong> DUFFAU</p>
              <p><strong>Statut :</strong> Auto-entrepreneur</p>
              <p><strong>SIRET :</strong> 99221410600013</p>
              <p><strong>Adresse :</strong> 323 avenue Paul Emile Victor, 77000 Melun, France</p>
              <p><strong>Email :</strong> contactdoude@gmail.com</p>
              <p><strong>Directeur de la publication :</strong> DUFFAU</p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">2. Hébergement</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              <p><strong>Site web :</strong> vercel.com</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">3. Propriété intellectuelle</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, logiciels, etc.)
                est la propriété exclusive de Doude, à l'exception des marques, logos ou contenus appartenant
                à d'autres sociétés partenaires ou auteurs.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie
                des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf
                autorisation écrite préalable de Doude.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">4. Données personnelles</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Les informations recueillies sur ce site sont traitées conformément au Règlement Général
                sur la Protection des Données (RGPD). Pour plus d'informations sur la collecte et le
                traitement de vos données personnelles, veuillez consulter notre{' '}
                <a href="/confidentialite" className="text-[var(--caramel)] hover:underline">
                  Politique de Confidentialité
                </a>.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">5. Cookies</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Ce site utilise des cookies nécessaires à son bon fonctionnement, notamment pour
                l'authentification des utilisateurs. Ces cookies sont essentiels et ne peuvent pas
                être désactivés. Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
              </p>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">6. Limitation de responsabilité</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Doude s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur
                ce site. Toutefois, Doude ne peut garantir l'exactitude, la précision ou l'exhaustivité
                des informations mises à disposition sur ce site.
              </p>
              <p className="text-[var(--espresso-light)] leading-relaxed mt-4">
                Doude décline toute responsabilité pour toute imprécision, inexactitude ou omission
                portant sur des informations disponibles sur ce site.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">7. Droit applicable</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Les présentes mentions légales sont régies par le droit français. En cas de litige,
                les tribunaux français seront seuls compétents.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-fraunces text-xl font-bold mb-4 text-[var(--espresso)]">8. Contact</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[var(--espresso-light)] leading-relaxed">
                Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à
                l'adresse suivante :{' '}
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
