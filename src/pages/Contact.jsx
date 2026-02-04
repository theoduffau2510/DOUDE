import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }

      setFormSubmitted(true)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Réessayez plus tard.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewsletter = (e) => {
    e.preventDefault()
    setNewsletterSubmitted(true)
  }

  return (
    <main className="flex-1 py-15 px-5 md:py-20">
      {/* Header */}
      <div className="text-center max-w-[700px] mx-auto mb-15">
        <h1 className="font-fraunces text-[var(--espresso)] text-4xl md:text-5xl mb-4 font-bold tracking-tight">
          Contactez-nous
        </h1>
        <div className="w-15 h-1 bg-gradient-to-r from-[var(--caramel)] to-[var(--sand)] mx-auto my-4 mb-6 rounded-sm" />
        <p className="text-[var(--espresso-light)] text-lg leading-relaxed">
          Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous accompagner.
        </p>
      </div>

      {/* Contact Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[1100px] mx-auto">
        {/* Info Cards */}
        <div className="space-y-5">
          {/* Email Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-fraunces text-lg text-[var(--espresso)] mb-2">Email</h3>
            <p className="text-[var(--espresso-light)] text-sm mb-3">Pour toute question générale ou demande de partenariat.</p>
            <a href="mailto:contact@doude.app" className="text-[var(--caramel)] font-semibold text-sm hover:text-[var(--caramel-dark)] transition-colors">
              contact@doude.app
            </a>
          </div>

          {/* Support Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-fraunces text-lg text-[var(--espresso)] mb-2">Support technique</h3>
            <p className="text-[var(--espresso-light)] text-sm mb-3">Un problème avec votre compte ? Notre équipe technique vous aide.</p>
            <a href="mailto:contact@doude.app" className="text-[var(--caramel)] font-semibold text-sm hover:text-[var(--caramel-dark)] transition-colors">
              contact@doude.app
            </a>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-fraunces text-lg text-[var(--espresso)] mb-2">Adresse</h3>
            <p className="text-[var(--espresso-light)] text-sm">
              Doude SAS<br />
              123 Avenue des Professeurs<br />
              75011 Paris, France
            </p>
          </div>

          {/* Response Time Card */}
          <div className="bg-gradient-to-br from-[var(--cream-dark)] to-[var(--sand)] rounded-2xl p-6">
            <h3 className="font-fraunces text-lg text-[var(--espresso)] mb-4">⏱️ Temps de réponse moyen</h3>
            <div className="flex justify-between py-2 border-b border-[var(--cream)]">
              <span className="text-[var(--espresso-light)] text-sm">Questions générales</span>
              <span className="font-semibold text-[var(--espresso)] text-sm">&lt; 72h</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--cream)]">
              <span className="text-[var(--espresso-light)] text-sm">Support Premium</span>
              <span className="font-semibold text-[var(--espresso)] text-sm">&lt; 48h</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--espresso-light)] text-sm">Support Pro (téléphone)</span>
              <span className="font-semibold text-[var(--espresso)] text-sm">&lt; 4h</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {!formSubmitted ? (
            <form onSubmit={handleSubmit}>
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] mb-2">Envoyez-nous un message</h2>
              <p className="text-[var(--espresso-light)] text-sm mb-6">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--espresso-light)] uppercase tracking-wide mb-2">
                    Prénom <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--caramel)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--espresso-light)] uppercase tracking-wide mb-2">
                    Nom <span className="text-[var(--coral)]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--caramel)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-[var(--espresso-light)] uppercase tracking-wide mb-2">
                  Email <span className="text-[var(--coral)]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--caramel)] focus:outline-none transition-colors"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-[var(--espresso-light)] uppercase tracking-wide mb-2">
                  Sujet <span className="text-[var(--coral)]">*</span>
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--caramel)] focus:outline-none transition-colors bg-white"
                >
                  <option value="" disabled>Choisissez un sujet</option>
                  <option value="general">Question générale</option>
                  <option value="support">Support technique</option>
                  <option value="billing">Facturation & abonnement</option>
                  <option value="feature">Suggestion de fonctionnalité</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-[var(--espresso-light)] uppercase tracking-wide mb-2">
                  Message <span className="text-[var(--coral)]">*</span>
                </label>
                <textarea
                  placeholder="Décrivez votre demande en détail..."
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--caramel)] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-4 h-4" />
                  <span className="text-sm text-[var(--espresso-light)]">
                    J'accepte la <Link to="/confidentialite" className="text-[var(--caramel)] hover:underline">politique de confidentialité</Link> et le traitement de mes données pour répondre à ma demande.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-[var(--espresso)] text-[var(--cream)] rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[var(--caramel-dark)] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-[var(--sage)] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
              <h3 className="font-fraunces text-2xl text-[var(--espresso)] mb-3">Message envoyé !</h3>
              <p className="text-[var(--espresso-light)] text-[15px] leading-relaxed">
                Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais. Consultez votre boîte mail pour notre réponse.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-white rounded-3xl p-10 max-w-[700px] mx-auto mt-20 text-center shadow-lg">
        <h2 className="font-fraunces text-2xl text-[var(--espresso)] mb-3">Restez informé</h2>
        <p className="text-[var(--espresso-light)] text-[15px] mb-6">Recevez nos conseils pour professeurs particuliers et les nouveautés Doude.</p>

        {!newsletterSubmitted ? (
          <form onSubmit={handleNewsletter} className="flex gap-3 max-w-[450px] mx-auto mb-6 flex-wrap justify-center">
            <input
              type="email"
              placeholder="Votre adresse email"
              required
              className="flex-1 min-w-[200px] py-3 px-5 border-2 border-[var(--sand)] rounded-full text-sm focus:border-[var(--caramel)] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-[var(--caramel)] text-white rounded-full font-semibold text-sm hover:bg-[var(--caramel-dark)] transition-colors cursor-pointer border-none"
            >
              S'inscrire
            </button>
          </form>
        ) : (
          <p className="text-[var(--sage)] font-semibold mb-6">✓ Inscrit !</p>
        )}

        <div className="flex gap-4 justify-center">
          <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Facebook">📘</a>
          <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Instagram">📷</a>
          <a href="#" className="text-2xl hover:scale-110 transition-transform" title="LinkedIn">💼</a>
          <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Twitter">🐦</a>
        </div>
      </section>
    </main>
  )
}
