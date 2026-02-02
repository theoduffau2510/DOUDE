import { useState } from 'react';
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Email envoyé ! Vérifiez votre boîte mail.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-5">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-3">
            Mot de passe oublié ?
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-[var(--caramel)] to-[var(--sand)] mx-auto my-4 rounded-sm" />
          <p className="text-[var(--espresso-light)] text-[15px]">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>
        
        <form onSubmit={handleResetRequest} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[var(--espresso)] mb-2">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[var(--sand)] rounded-xl focus:outline-none focus:border-[var(--caramel)] transition-colors text-[var(--espresso)]"
              placeholder="votre@email.com"
            />
          </div>

          {error && (
            <div className="bg-[var(--coral)]/10 border-2 border-[var(--coral)] text-[var(--coral)] px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-[var(--sage)]/10 border-2 border-[var(--sage)] text-[var(--sage)] px-4 py-3 rounded-xl text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-[var(--espresso)] text-[var(--cream)] rounded-full font-semibold text-[15px] hover:bg-[var(--caramel)] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/sign-in')}
            className="text-sm text-[var(--caramel)] hover:text-[var(--caramel-dark)] font-semibold transition-colors"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}