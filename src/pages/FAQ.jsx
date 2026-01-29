import { useState } from 'react'

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-[var(--cream)] transition-colors"
      >
        <span className="font-semibold text-[var(--espresso)]">{question}</span>
        <span className={`text-2xl text-[var(--caramel)] transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-[var(--espresso-light)] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqCategories = [
    {
      title: "Compte et inscription",
      questions: [
        {
          question: "Comment créer un compte Doude ?",
          answer: "Cliquez sur le bouton 'Essai gratuit 14 jours' sur la page d'accueil ou sur 'Connexion' dans le menu. Vous pouvez vous inscrire avec votre email ou via Google. La création de compte est gratuite et ne prend que quelques secondes."
        },
        {
          question: "Puis-je essayer Doude gratuitement ?",
          answer: "Oui ! Nous offrons une période d'essai de 14 jours pour les formules Premium et Pro. Vous avez accès à toutes les fonctionnalités sans engagement. Aucune carte bancaire n'est requise pour commencer l'essai."
        },
        {
          question: "Comment modifier mes informations personnelles ?",
          answer: "Connectez-vous à votre compte, cliquez sur votre avatar en haut à droite, puis sur 'Gérer le compte'. Vous pourrez y modifier votre email, mot de passe et autres informations."
        },
        {
          question: "Comment supprimer mon compte ?",
          answer: "Pour supprimer votre compte, envoyez un email à contactdoude@gmail.com. Nous procéderons à la suppression dans un délai de 48h. Attention : toutes vos données seront définitivement effacées."
        }
      ]
    },
    {
      title: "Abonnements et facturation",
      questions: [
        {
          question: "Quels sont les différents abonnements disponibles ?",
          answer: "Doude propose trois formules : Gratuit (7€/mois, jusqu'à 5 élèves), Premium (12€/mois, jusqu'à 15 élèves avec stats avancées) et Pro (20€/mois, élèves illimités avec toutes les fonctionnalités). Une réduction de 20% est accordée pour les abonnements annuels."
        },
        {
          question: "Comment changer de formule d'abonnement ?",
          answer: "Vous pouvez passer à une formule supérieure à tout moment depuis votre espace personnel. Le changement prend effet immédiatement et le montant est calculé au prorata. Pour passer à une formule inférieure, le changement s'appliquera à la prochaine période de facturation."
        },
        {
          question: "Quels moyens de paiement acceptez-vous ?",
          answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) via notre prestataire de paiement sécurisé. Les paiements sont automatiquement renouvelés à chaque échéance."
        },
        {
          question: "Comment obtenir une facture ?",
          answer: "Vos factures sont automatiquement envoyées par email après chaque paiement. Vous pouvez également les télécharger depuis votre espace personnel dans la section 'Facturation'."
        },
        {
          question: "Comment résilier mon abonnement ?",
          answer: "Vous pouvez résilier à tout moment depuis votre espace personnel ou en envoyant un email à contactdoude@gmail.com. La résiliation prend effet à la fin de la période en cours. Vous conservez l'accès jusqu'à cette date."
        }
      ]
    },
    {
      title: "Suivi des élèves",
      questions: [
        {
          question: "Comment ajouter un nouvel élève ?",
          answer: "Dans l'onglet 'Suivi', cliquez sur '+ Ajouter un élève'. Renseignez les informations de l'élève (nom, niveau, matière, objectif de note) puis validez. L'élève apparaîtra dans votre liste."
        },
        {
          question: "Comment enregistrer une note ?",
          answer: "Cliquez sur la fiche d'un élève pour ouvrir le détail. Utilisez le bouton '+ Ajouter une note' pour saisir la note, la date et une description (ex: 'Contrôle chapitre 3'). La progression se met à jour automatiquement."
        },
        {
          question: "Comment fonctionne la courbe de progression ?",
          answer: "La courbe de progression (disponible en version Pro) affiche l'évolution des notes de l'élève dans le temps. Elle compare les résultats à l'objectif défini et calcule les statistiques (min, max, moyenne, évolution)."
        },
        {
          question: "Puis-je exporter les données d'un élève ?",
          answer: "Oui, en version Pro, vous pouvez exporter la fiche complète d'un élève (informations, notes, progression, appréciation) au format PDF. Cliquez sur 'Exporter PDF' dans la fiche de l'élève."
        }
      ]
    },
    {
      title: "Emploi du temps",
      questions: [
        {
          question: "Comment gérer mon emploi du temps ?",
          answer: "L'onglet 'Emploi du temps' affiche votre semaine avec des créneaux horaires de 8h à 20h. Cliquez sur un créneau pour le marquer comme disponible, réservé ou effectué. Utilisez les flèches pour naviguer entre les semaines."
        },
        {
          question: "Puis-je synchroniser avec Google Calendar ?",
          answer: "Cette fonctionnalité est en cours de développement. Elle sera disponible prochainement pour les abonnés Premium et Pro."
        }
      ]
    },
    {
      title: "Comptabilité",
      questions: [
        {
          question: "Comment créer une facture ?",
          answer: "Dans l'onglet 'Compta', cliquez sur '+ Nouvelle facture'. Sélectionnez un client (ou créez-en un), indiquez le montant, la date et une description. La facture est automatiquement numérotée."
        },
        {
          question: "Comment ajouter un client ?",
          answer: "Cliquez sur '+ Nouveau client' dans l'onglet 'Compta'. Renseignez les coordonnées du client (nom, prénom, adresse, email, téléphone, RIB si nécessaire). Ces informations seront utilisées pour vos factures."
        },
        {
          question: "Comment marquer une facture comme payée ?",
          answer: "Dans la liste des factures, cliquez sur le badge de statut ('En attente') pour le basculer en 'Payée'. Vos statistiques (total payé, en attente) se mettent à jour automatiquement."
        },
        {
          question: "Doude gère-t-il le crédit d'impôt SAP ?",
          answer: "Nous travaillons sur l'intégration avec l'API URSSAF pour faciliter les démarches de crédit d'impôt pour les services à la personne. Cette fonctionnalité sera disponible dans une prochaine mise à jour."
        }
      ]
    },
    {
      title: "Sécurité et données",
      questions: [
        {
          question: "Mes données sont-elles sécurisées ?",
          answer: "Oui, nous utilisons les meilleures pratiques de sécurité : chiffrement des données en transit (HTTPS), authentification sécurisée via Supabase, contrôle d'accès strict (chaque utilisateur n'accède qu'à ses propres données), hébergement sur des serveurs certifiés."
        },
        {
          question: "Où sont stockées mes données ?",
          answer: "Vos données sont stockées sur les serveurs de Supabase, principalement en Europe. L'authentification est gérée par Supabase Auth. Tous nos prestataires sont conformes au RGPD."
        },
        {
          question: "Puis-je récupérer mes données ?",
          answer: "Oui, conformément au RGPD, vous avez le droit à la portabilité de vos données. Contactez-nous à contactdoude@gmail.com pour obtenir une copie de toutes vos données dans un format standard."
        }
      ]
    }
  ]

  const handleToggle = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <main className="flex-1 py-12 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-4">Questions fréquentes</h1>
          <p className="text-[var(--espresso-light)]">
            Trouvez rapidement les réponses à vos questions sur Doude
          </p>
        </div>

        <div className="space-y-10">
          {faqCategories.map((category, categoryIndex) => (
            <section key={categoryIndex}>
              <h2 className="font-fraunces text-xl font-bold text-[var(--espresso)] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[var(--caramel)] text-white rounded-full flex items-center justify-center text-sm">
                  {categoryIndex + 1}
                </span>
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.questions.map((item, questionIndex) => (
                  <FAQItem
                    key={questionIndex}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openIndex === `${categoryIndex}-${questionIndex}`}
                    onClick={() => handleToggle(categoryIndex, questionIndex)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact section */}
        <div className="mt-12 bg-[var(--sand)] rounded-2xl p-8 text-center">
          <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold mb-2">
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p className="text-[var(--espresso-light)] mb-4">
            Notre équipe est là pour vous aider
          </p>
          <a
            href="/contact"
            className="inline-block py-3 px-6 bg-[var(--espresso)] text-[var(--cream)] rounded-full font-semibold text-sm hover:bg-[var(--caramel-dark)] transition-colors"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </main>
  )
}
