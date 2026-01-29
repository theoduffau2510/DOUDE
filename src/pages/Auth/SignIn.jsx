import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react'

export default function SignIn() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await signIn(formData.email, formData.password)

    setLoading(false)

    if (error) {
      setError('Email ou mot de passe incorrect')
    } else {
      // Redirection selon le rôle
      const role = data.user.user_metadata?.role
      if (role === 'eleve') {
        navigate('/parent')
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        {/* Retour */}
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--espresso)] hover:text-[var(--caramel)] mb-8 transition-colors no-underline">
          <ArrowLeft size={20} />
          Retour à l'accueil
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[var(--caramel)]/10 rounded-full text-sm font-medium text-[var(--caramel)]">
              <Sparkles size={16} />
              Bon retour !
            </div>
            <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-2">
              Connexion
            </h1>
            <p className="text-[var(--espresso-light)]">
              Accédez à votre espace
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--espresso-light)]" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full py-3 pl-12 pr-4 border-2 border-[var(--sand)] rounded-xl focus:border-[var(--caramel)] focus:outline-none"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--espresso-light)]" size={20} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full py-3 pl-12 pr-4 border-2 border-[var(--sand)] rounded-xl focus:border-[var(--caramel)] focus:outline-none"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--caramel)] text-white rounded-xl font-semibold hover:bg-[var(--caramel-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--espresso-light)] mt-6">
            Pas encore de compte ?{' '}
            <Link to="/sign-up" className="text-[var(--caramel)] font-semibold hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}