import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CheckCircle, Loader2 } from 'lucide-react'
import { stripeAPI, handleAPIError } from '../lib/api';


export default function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id')

      if (!sessionId) {
        setStatus('error')
        setMessage('Session invalide')
        return
      }

      try {
        // Vérifier la session auprès du serveur
       const { data, error } = await stripeAPI.verifySession(sessionId);

if (error || !data?.success) {
  setStatus('error');
  setMessage(error || 'Erreur lors de la vérification');
  return;
}

        if (data.success) {
  // Mettre à jour le tier dans les métadonnées utilisateur
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // 🆕 Recharger le tier depuis users_roles
    const { data: userData } = await supabase
      .from('users_roles')
      .select('tier, subscription_status')
      .eq('user_id', user.id)
      .eq('role', 'prof')
      .single();

    console.log('✅ Tier rechargé:', userData);

    // Forcer le rafraîchissement de la session
    await supabase.auth.refreshSession()
  }

  setStatus('success')
  setMessage(`Bienvenue dans l'offre ${data.tier} !`)

  // 🆕 Redirection avec refresh complet
  setTimeout(() => {
    window.location.href = '/'; // ← CHANGÉ
  }, 2000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Erreur lors de la vérification')
        }
      } catch (error) {
        console.error('Erreur vérification:', error)
        setStatus('error')
        setMessage('Erreur de connexion au serveur')
      }
    }

    verifyPayment()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-5">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-[var(--caramel)] mx-auto mb-6 animate-spin" />
            <h1 className="font-fraunces text-2xl text-[var(--espresso)] mb-3">
              Vérification du paiement...
            </h1>
            <p className="text-[var(--espresso-light)]">
              Merci de patienter quelques instants
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-[var(--sage)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-[var(--sage)]" />
            </div>
            <h1 className="font-fraunces text-3xl text-[var(--espresso)] mb-3">
              Paiement réussi !
            </h1>
            <p className="text-[var(--espresso-light)] mb-6">
              {message}
            </p>
            <p className="text-sm text-[var(--espresso-light)]">
              Redirection vers votre tableau de bord...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-[var(--coral)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="font-fraunces text-2xl text-[var(--espresso)] mb-3">
              Une erreur est survenue
            </h1>
            <p className="text-[var(--espresso-light)] mb-6">
              {message}
            </p>
            <button
              onClick={() => navigate('/tarifs')}
              className="bg-[var(--espresso)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--caramel)] transition-colors"
            >
              Retour aux tarifs
            </button>
          </>
        )}
      </div>
    </div>
  )
}
