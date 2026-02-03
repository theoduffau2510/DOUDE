import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, Mail, Lock, User, Sparkles, Key, CheckCircle } from 'lucide-react'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp, supabase } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'prof',
    linkCode: '' // Code de liaison pour les élèves
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Si c'est un élève, vérifier le code de liaison
      if (formData.role === 'eleve') {
        if (!formData.linkCode) {
          setError('Le code de liaison est requis pour les élèves')
          setLoading(false)
          return
        }

console.log('=== DÉBOGAGE LINK CODE ===')
console.log('Valeur brute:', `"${formData.linkCode}"`)
console.log('Longueur:', formData.linkCode.length)
console.log('Après trim:', `"${formData.linkCode.trim()}"`)
console.log('Après trim + upper:', `"${formData.linkCode.trim().toUpperCase()}"`)
console.log('Longueur finale:', formData.linkCode.trim().toUpperCase().length)

const cleanCode = formData.linkCode.trim().toUpperCase()

        // Vérifier que le code existe dans la table students
       const { data: student, error: studentError } = await supabase
  .from('students')
  .select('*')
  .eq('link_code', formData.linkCode.toUpperCase())
  .single()

console.log('Code recherché:', cleanCode)
console.log('Résultat:', student)
console.log('Erreur:', studentError)

        if (studentError || !student) {
          setError(`Code de liaison invalide. ${studentError?.message || 'Code non trouvé'}`)
          setLoading(false)
          return
        }

        // Vérifier que l'email correspond (si renseigné par le prof)
        if (student.parent_email && student.parent_email !== formData.email) {
          setError(`Ce code est réservé à l'email : ${student.parent_email}`)
          setLoading(false)
          return
        }

        // Vérifier que le compte n'est pas déjà lié
        if (student.student_user_id) {
          setError('Ce code a déjà été utilisé')
          setLoading(false)
          return
        }
      }

      // Créer le compte Supabase Auth
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role
        }
      )

      console.log('🔍 Résultat signUp:', { data, error })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // ✅ NOUVEAU : Créer/mettre à jour la ligne dans users_roles avec le bon rôle
      if (data.user) {
        console.log('👤 User créé avec ID:', data.user.id)
        console.log('📋 Role:', formData.role)
        
        const { error: userRoleError } = await supabase
          .from('users_roles')
          .insert({
            user_id: data.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,  // ← Le bon rôle (prof ou eleve)
            is_admin: false,
            created_at: new Date().toISOString()
          })

        console.log('📝 Résultat insert users_roles:', userRoleError)

        if (userRoleError) {
          console.error('Erreur création users_roles:', userRoleError)
          // On continue quand même, c'est pas bloquant
        } else {
          console.log('✅ User créé dans users_roles avec succès !')
        }
      } else {
        console.log('❌ Pas de data.user ! Data complète:', data)
      }

      // Si c'est un élève, mettre à jour la table students avec le student_user_id
      if (formData.role === 'eleve' && data.user) {
        const { error: updateError } = await supabase
          .from('students')
          .update({
            student_user_id: data.user.id,
            parent_email: formData.email // Mettre à jour l'email si pas déjà renseigné
          })
          .eq('link_code', formData.linkCode.toUpperCase())

        if (updateError) {
          console.error('Erreur mise à jour student:', updateError)
        }
      }

      // Afficher le message de confirmation email
      setShowEmailConfirmation(true)
      setLoading(false)

    } catch (err) {
      setError('Une erreur est survenue. Réessayez.')
      console.error(err)
      setLoading(false)
    }
  }

  // Écran de confirmation email
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            
            <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-4">
              Vérifiez votre email
            </h1>
            
            <p className="text-[var(--espresso-light)] mb-6">
              Nous avons envoyé un email de confirmation à :
            </p>
            
            <div className="bg-[var(--sand)] rounded-xl p-4 mb-6">
              <p className="font-semibold text-[var(--espresso)]">
                {formData.email}
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-900">
                <strong>📧 Prochaine étape :</strong><br/>
                Cliquez sur le lien dans l'email pour confirmer votre compte et accéder à la plateforme.
              </p>
            </div>
            
            <p className="text-xs text-[var(--espresso-light)] mb-6">
              Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou contactez le support.
            </p>
            
            <Link 
              to="/sign-in" 
              className="inline-block w-full py-3 bg-[var(--caramel)] text-white rounded-xl font-semibold hover:bg-[var(--caramel-dark)] transition-colors no-underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    )
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
              Créer un compte
            </div>
            <h1 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-2">
              Inscription
            </h1>
            <p className="text-[var(--espresso-light)]">
              {formData.role === 'prof' ? 'Commencez votre essai gratuit de 14 jours' : 'Accédez à votre suivi scolaire'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type de compte */}
            <div>
              <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                Type de compte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'prof', linkCode: ''})}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all ${
                    formData.role === 'prof'
                      ? 'bg-[var(--caramel)] text-white border-[var(--caramel)]'
                      : 'bg-white text-[var(--espresso)] border-[var(--sand)] hover:border-[var(--caramel)]'
                  }`}
                >
                  Professeur
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'eleve'})}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all ${
                    formData.role === 'eleve'
                      ? 'bg-[var(--caramel)] text-white border-[var(--caramel)]'
                      : 'bg-white text-[var(--espresso)] border-[var(--sand)] hover:border-[var(--caramel)]'
                  }`}
                >
                  Élève/Parent
                </button>
              </div>
            </div>

            {/* Code de liaison (uniquement pour élèves) */}
            {formData.role === 'eleve' && (
              <div>
                <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                  Code de liaison *
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--espresso-light)]" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.linkCode}
                    onChange={(e) => setFormData({...formData, linkCode: e.target.value.toUpperCase()})}
                    className="w-full py-3 pl-12 pr-4 border-2 border-[var(--sand)] rounded-xl focus:border-[var(--caramel)] focus:outline-none font-mono text-lg"
                    placeholder="ABC123"
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-[var(--espresso-light)] mt-1">
                  Code fourni par votre professeur
                </p>
              </div>
            )}

            {/* Prénom */}
            <div>
              <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--espresso-light)]" size={20} />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full py-3 pl-12 pr-4 border-2 border-[var(--sand)] rounded-xl focus:border-[var(--caramel)] focus:outline-none"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                Nom
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--espresso-light)]" size={20} />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full py-3 pl-12 pr-4 border-2 border-[var(--sand)] rounded-xl focus:border-[var(--caramel)] focus:outline-none"
                  placeholder="Votre nom"
                />
              </div>
            </div>

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
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full py-3 pl-12 pr-4 border-2 border-[var(--sand)] rounded-xl focus:border-[var(--caramel)] focus:outline-none"
                  placeholder="Minimum 6 caractères"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--caramel)] text-white rounded-xl font-semibold hover:bg-[var(--caramel-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--espresso-light)] mt-6">
            Déjà un compte ?{' '}
            <Link to="/sign-in" className="text-[var(--caramel)] font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}