import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { stripeAPI, handleAPIError } from '../lib/api';


// Tes Price IDs Stripe (tier_periode: priceId)
const STRIPE_PRICES = {
  gratuit_monthly: 'price_1SuACOFEu2lrL216y4C6PbuP',
  gratuit_yearly: 'price_1SuADVFEu2lrL216SQm5agHc',
  pro_monthly: 'price_1SuACnFEu2lrL216xouwXPm0',
  pro_yearly: 'price_1SuADhFEu2lrL21638mz6Oij',
  premium_monthly: 'price_1SuAD4FEu2lrL2160uwZdxG4',
  premium_yearly: 'price_1SuAEWFEu2lrL216eLG8DOiB'
}

// Fonction pour créer une session Stripe
const handleSubscribe = async (priceId, user, navigate) => {
  if (!user) {
    navigate('/Sign-Up')
    return
  }

  try {
    console.log('Envoi de la requête avec priceId:', priceId)
    
    const { data, error } = await stripeAPI.createCheckoutSession(
      priceId,
      user.id,
      user.email
    );

    if (error) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error}`);
      return;
    }

    console.log('Données reçues:', data);
    
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert('Pas d\'URL de redirection reçue');
    }
  } catch (error) {
    console.error('Erreur complète:', error);
    alert(`Erreur: ${error.message}`);
  }
}

export default function Tarifs() {
    const navigate = useNavigate()
  const [activeFaq, setActiveFaq] = useState(null)
  const [billingPeriod, setBillingPeriod] = useState('monthly')
 const [user, setUser] = useState(null)

useEffect(() => {
  supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })

  return () => subscription.unsubscribe()
}, [])

  const faqItems = [
    {
      question: "Puis-je changer de formule à tout moment ?",
      answer: "Oui, vous pouvez passer à une formule supérieure ou inférieure à tout moment. Le changement prend effet immédiatement et le prorata est calculé automatiquement."
    },
    {
      question: "Comment fonctionne la période d'essai ?",
      answer: "Vous bénéficiez de 14 jours d'accès complet à toutes les fonctionnalités Premium. Aucune carte bancaire n'est requise. À la fin de l'essai, vous choisissez votre formule."
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, CB), PayPal et le prélèvement SEPA pour les abonnements annuels."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Vos données sont chiffrées et hébergées en France sur des serveurs certifiés. Nous sommes conformes au RGPD et ne revendons jamais vos données."
    },
    {
      question: "Puis-je annuler mon abonnement ?",
      answer: "Oui, vous pouvez annuler à tout moment depuis votre espace personnel. Votre accès reste actif jusqu'à la fin de la période payée."
    }
  ]

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <main className="flex-1 py-15 px-5 md:py-20">
      {/* Header */}
      <div className="text-center max-w-[700px] mx-auto mb-15">
        <h1 className="font-fraunces text-[var(--espresso)] text-4xl md:text-5xl mb-4 font-bold tracking-tight">
          Nos tarifs
        </h1>
        <div className="w-15 h-1 bg-gradient-to-r from-[var(--caramel)] to-[var(--sand)] mx-auto my-4 mb-6 rounded-sm" />
        <p className="text-[var(--espresso-light)] text-lg leading-relaxed">
          Des formules adaptées à votre activité, que vous débutiez ou que vous ayez déjà une clientèle établie.
        </p>
      </div>

      {/* Trial Banner */}
      <div className="bg-gradient-to-br from-[var(--caramel)] to-[var(--caramel-dark)] text-white py-5 px-8 rounded-2xl max-w-[600px] mx-auto mb-12 text-center shadow-xl">
        <h3 className="font-fraunces text-[22px] mb-2">🎁 14 jours d'essai gratuit</h3>
        <p className="opacity-95 text-[15px]">Testez toutes les fonctionnalités Premium sans engagement, sans carte bancaire requise.</p>
      </div>

      {/* Toggle Mensuel/Annuel */}
      <div className="flex justify-center items-center gap-3 mb-10">
        <button
          onClick={() => setBillingPeriod('monthly')}
          className={`py-3 px-8 rounded-full font-semibold text-sm transition-all duration-300 ${
            billingPeriod === 'monthly'
              ? 'bg-[var(--espresso)] text-[var(--cream)] shadow-lg'
              : 'bg-white text-[var(--espresso)] border-2 border-[var(--sand)]'
          }`}
        >
          Mensuel
        </button>
        <button
          onClick={() => setBillingPeriod('yearly')}
          className={`py-3 px-8 rounded-full font-semibold text-sm transition-all duration-300 relative ${
            billingPeriod === 'yearly'
              ? 'bg-[var(--espresso)] text-[var(--cream)] shadow-lg'
              : 'bg-white text-[var(--espresso)] border-2 border-[var(--sand)]'
          }`}
        >
          Annuel
          <span className="ml-2 text-xs bg-[var(--caramel)] text-white py-1 px-2 rounded-full">-15%</span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
        {/* Gratuit */}
        <div className="bg-white rounded-3xl py-10 px-9 shadow-lg border-2 border-transparent hover:-translate-y-2 hover:shadow-xl transition-all duration-400">
          <h2 className="font-fraunces text-[26px] text-[var(--espresso)] mb-2 font-bold">Gratuit</h2>
          <p className="text-[var(--espresso-light)] text-sm mb-6 leading-relaxed">Pour découvrir Doude.</p>
          <div className="mb-8 pb-8 border-b border-[var(--cream-dark)]">
            <div className="font-fraunces text-5xl text-[var(--espresso)] font-bold leading-none">
              {billingPeriod === 'monthly' ? '0€' : '0€'} 
              <span className="text-lg font-medium text-[var(--espresso-light)]">
                {billingPeriod === 'monthly' ? ' / mois' : ' / an'}
              </span>
            </div>
            {billingPeriod === 'yearly' && (
              <p className="text-[13px] text-[var(--sage)] mt-2 font-semibold">1 mois offert !</p>
            )}
          </div>
          <ul className="mb-9 space-y-0">
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Jusqu'à 3 élèves
            </li>
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Emploi du temps intéractif basique
            </li>
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Suivi des élèves et notes
            </li>
             <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Historique 3 mois
            </li>
          </ul>
          <button 
            onClick={() => handleSubscribe(
  billingPeriod === 'monthly' ? STRIPE_PRICES.gratuit_monthly : STRIPE_PRICES.gratuit_yearly, 
  user,
  navigate // ← Ajoutez ce paramètre
)}
            className="block w-full py-4 px-6 rounded-full font-semibold text-[15px] cursor-pointer transition-all duration-300 text-center bg-[var(--cream)] text-[var(--espresso)] border-2 border-[var(--sand)] hover:bg-[var(--cream-dark)] hover:border-[var(--caramel)]"
          >
            Commencer gratuitement
          </button>
        </div>

        {/* Premium - Populaire */}
        <div className="bg-white rounded-3xl py-10 px-9 shadow-lg border-2 border-[var(--caramel)] hover:-translate-y-2 hover:shadow-xl transition-all duration-400 relative">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--caramel)] text-white py-2 px-5 rounded-full text-xs font-semibold uppercase tracking-wide">
            Le plus populaire
          </span>
          <h2 className="font-fraunces text-[26px] text-[var(--espresso)] mb-2 font-bold">Pro</h2>
          <p className="text-[var(--espresso-light)] text-sm mb-6 leading-relaxed">L'essentiel pour les professeurs actifs.</p>
          <div className="mb-8 pb-8 border-b border-[var(--cream-dark)]">
            <div className="font-fraunces text-5xl text-[var(--espresso)] font-bold leading-none">
              {billingPeriod === 'monthly' ? '5,99€' : '60€'} 
              <span className="text-lg font-medium text-[var(--espresso-light)]">
                {billingPeriod === 'monthly' ? ' / mois' : ' / an'}
              </span>
            </div>
            {billingPeriod === 'yearly' && (
              <p className="text-[13px] text-[var(--sage)] mt-2 font-semibold">2 mois offerts !</p>
            )}
          </div>
          <ul className="mb-9 space-y-0">
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Jusqu'à 6 élèves
            </li>
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Courbe de progression
            </li>
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Export PDF des fiches élèves
            </li>
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Historique 1 an
            </li>
          </ul>
          <button 
            onClick={() => handleSubscribe(
  billingPeriod === 'monthly' ? STRIPE_PRICES.pro_monthly : STRIPE_PRICES.pro_yearly, 
  user,
  navigate // ← Ajoutez ce paramètre
)}
            className="block w-full py-4 px-6 rounded-full font-semibold text-[15px] cursor-pointer transition-all duration-300 text-center bg-[var(--espresso)] text-[var(--cream)] shadow-lg hover:bg-[var(--caramel-dark)] hover:-translate-y-0.5"
          >
            Essayer 14 jours gratuit
          </button>
        </div>

        {/* Pro */}
        <div className="bg-white rounded-3xl py-10 px-9 shadow-lg border-2 border-transparent hover:-translate-y-2 hover:shadow-xl transition-all duration-400">
          <h2 className="font-fraunces text-[26px] text-[var(--espresso)] mb-2 font-bold">Premium</h2>
          <p className="text-[var(--espresso-light)] text-sm mb-6 leading-relaxed">Pour les professeurs à temps plein.</p>
          <div className="mb-8 pb-8 border-b border-[var(--cream-dark)]">
            <div className="font-fraunces text-5xl text-[var(--espresso)] font-bold leading-none">
              {billingPeriod === 'monthly' ? '8,99€' : '90€'} 
              <span className="text-lg font-medium text-[var(--espresso-light)]">
                {billingPeriod === 'monthly' ? ' / mois' : ' / an'}
              </span>
            </div>
            {billingPeriod === 'yearly' && (
              <p className="text-[13px] text-[var(--sage)] mt-2 font-semibold">2 mois offerts !</p>
            )}
          </div>
          <ul className="mb-9 space-y-0">
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Élèves illimités
            </li>
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Créneaux récurrents hebdo
            </li>
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3 border-b border-[var(--cream)]">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Tableau de bord global
            </li>
            <li className="py-3 text-[var(--espresso)] text-[15px] flex items-start gap-3">
              <span className="text-[var(--sage)] font-bold text-base flex-shrink-0">✓</span>
              Support prioritaire : moins de 24h
            </li>
          </ul>
          <button 
           onClick={() => handleSubscribe(
  billingPeriod === 'monthly' ? STRIPE_PRICES.premium_monthly : STRIPE_PRICES.premium_yearly, 
  user,
  navigate // ← Ajoutez ce paramètre
)}
            className="block w-full py-4 px-6 rounded-full font-semibold text-[15px] cursor-pointer transition-all duration-300 text-center bg-[var(--cream)] text-[var(--espresso)] border-2 border-[var(--sand)] hover:bg-[var(--cream-dark)] hover:border-[var(--caramel)]"
          >
            Essayer 14 jours gratuit
          </button>
        </div>
      </div>

      {/* Guarantee */}
      <div className="text-center mt-15 py-10 px-10 bg-white rounded-2xl max-w-[700px] mx-auto shadow-lg">
        <div className="text-5xl mb-4">🛡️</div>
        <h3 className="font-fraunces text-2xl text-[var(--espresso)] mb-3">Satisfait ou remboursé</h3>
        <p className="text-[var(--espresso-light)] text-[15px] leading-relaxed">
          Vous n'êtes pas convaincu après votre période d'essai ? Pas de problème. Nous vous remboursons intégralement votre premier mois si vous n'êtes pas satisfait, sans condition.
        </p>
      </div>

      {/* FAQ Section */}
      <section className="max-w-[800px] mx-auto mt-20">
        <h2 className="font-fraunces text-4xl text-[var(--espresso)] text-center mb-10">Questions fréquentes</h2>

        {faqItems.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl mb-4 shadow-md overflow-hidden">
            <div
              onClick={() => toggleFaq(index)}
              className="py-6 px-8 cursor-pointer flex justify-between items-center font-semibold text-[var(--espresso)] hover:bg-[var(--cream)] transition-colors duration-300"
            >
              {item.question}
              <span className={`text-2xl text-[var(--caramel)] transition-transform duration-300 ${activeFaq === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </div>
            <div className={`px-8 overflow-hidden transition-all duration-300 ${activeFaq === index ? 'pb-6 max-h-[200px]' : 'max-h-0'}`}>
              <p className="text-[var(--espresso-light)] leading-relaxed text-[15px]">{item.answer}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}