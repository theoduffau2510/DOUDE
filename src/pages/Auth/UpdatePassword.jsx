import { useState } from 'react';
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      alert('Mot de passe modifié avec succès !');
      navigate('/sign-in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-5">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-3">
            Nouveau mot de passe
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-[var(--caramel)] to-[var(--sand)] mx-auto my-4 rounded-sm" />
          <p className="text-[var(--espresso-light)] text-[15px]">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>
        
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[var(--espresso)] mb-2">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[var(--sand)] rounded-xl focus:outline-none focus:border-[var(--caramel)] transition-colors text-[var(--espresso)]"
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[var(--espresso)] mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[var(--sand)] rounded-xl focus:outline-none focus:border-[var(--caramel)] transition-colors text-[var(--espresso)]"
              placeholder="Retapez votre mot de passe"
            />
          </div>

          {error && (
            <div className="bg-[var(--coral)]/10 border-2 border-[var(--coral)] text-[var(--coral)] px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-[var(--espresso)] text-[var(--cream)] rounded-full font-semibold text-[15px] hover:bg-[var(--caramel)] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}