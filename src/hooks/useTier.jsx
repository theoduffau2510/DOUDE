import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Configuration des limites par tier
export const TIER_LIMITS = {
  gratuit: {
    maxStudents: 3,
    historyMonths: 3,
    maxPdfSize: 20 * 1024 * 1024, // 10 Mo
    features: {
      multiSelectSlots: true,
      recurringSlots: false,
      pdfExport: false,
      pdfImport: true, // Maintenant disponible pour tous
      progressChart: false,
      advancedStats: false,
      individualDashboard: false,
      globalDashboard: false,
      messaging: false,
      googleCalendar: false
    }
  },
  pro: {
    maxStudents: 8,
    historyMonths: 12,
    maxPdfSize: 1024 * 1024 * 1024, // 1 Go
    features: {
      multiSelectSlots: true,
      recurringSlots: false,
      pdfExport: true,
      pdfImport: true,
      progressChart: true,
      advancedStats: false,
      individualDashboard: true,
      globalDashboard: false,
      messaging: false,
      googleCalendar: false
    }
  },
  premium: {
    maxStudents: Infinity,
    historyMonths: Infinity,
    maxPdfSize: Infinity, // Illimité
    features: {
      multiSelectSlots: true,
      recurringSlots: true,
      pdfExport: true,
      pdfImport: true,
      progressChart: true,
      advancedStats: true,
      individualDashboard: true,
      globalDashboard: true,
      messaging: true,
      googleCalendar: true
    }
  }
}

// Labels pour l'affichage
export const TIER_LABELS = {
  gratuit: 'Gratuit',
  premium: 'Premium',
  pro: 'Pro'
}

// Couleurs pour badges
export const TIER_COLORS = {
  gratuit: 'bg-gray-100 text-gray-600',
  premium: 'bg-[var(--caramel)]/10 text-[var(--caramel)]',
  pro: 'bg-[var(--sage)]/10 text-[var(--sage)]'
}

export function useTier() {
  const DEFAULT_TIER = 'gratuit' // 'gratuit' | 'premium' | 'pro'

  const [tier, setTier] = useState(DEFAULT_TIER)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
   const fetchTier = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // 🆕 Récupérer le tier depuis users_roles
      const { data: userRole, error } = await supabase
        .from('users_roles')
        .select('tier, subscription_status')
        .eq('user_id', user.id)
        .eq('role', 'prof')
        .single()

      if (error) {
        console.error('Erreur récupération tier:', error)
        setTier(DEFAULT_TIER)
      } else {
        const userTier = userRole?.tier || DEFAULT_TIER
        console.log('✅ Tier récupéré:', userTier)
        setTier(userTier)
      }
    }
  } catch (error) {
    console.error('Erreur récupération tier:', error)
    setTier(DEFAULT_TIER)
  } finally {
    setLoading(false)
  }
}

    fetchTier()

    // Écouter les changements d'auth
   const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
  if (session?.user) {
    // 🆕 Recharger depuis users_roles
    const { data: userRole } = await supabase
      .from('users_roles')
      .select('tier')
      .eq('user_id', session.user.id)
      .eq('role', 'prof')
      .single()
    
    const userTier = userRole?.tier || DEFAULT_TIER
    setTier(userTier)
  }
})
    return () => subscription.unsubscribe()
  }, [])

  const limits = TIER_LIMITS[tier] || TIER_LIMITS.gratuit

  // Vérifie si une fonctionnalité est disponible
  const hasFeature = (featureName) => {
    return limits.features[featureName] || false
  }

  // Vérifie si on peut ajouter un élève
  const canAddStudent = (currentCount) => {
    return currentCount < limits.maxStudents
  }

  // Nombre d'élèves restants
  const remainingStudents = (currentCount) => {
    if (limits.maxStudents === Infinity) return Infinity
    return Math.max(0, limits.maxStudents - currentCount)
  }

  // Vérifie si une date est dans l'historique autorisé
  const isInHistoryRange = (date) => {
    if (limits.historyMonths === Infinity) return true
    const limitDate = new Date()
    limitDate.setMonth(limitDate.getMonth() - limits.historyMonths)
    return new Date(date) >= limitDate
  }

  // Vérifie si un fichier PDF respecte la limite de taille
  const canUploadPdf = (fileSize) => {
    if (limits.maxPdfSize === Infinity) return true
    return fileSize <= limits.maxPdfSize
  }

  // Retourne la taille max formatée
  const getMaxPdfSizeLabel = () => {
    if (limits.maxPdfSize === Infinity) return 'Illimité'
    if (limits.maxPdfSize >= 1024 * 1024 * 1024) return `${limits.maxPdfSize / (1024 * 1024 * 1024)} Go`
    return `${limits.maxPdfSize / (1024 * 1024)} Mo`
  }

  return {
    tier,
    loading,
    limits,
    hasFeature,
    canAddStudent,
    remainingStudents,
    isInHistoryRange,
    canUploadPdf,
    getMaxPdfSizeLabel,
    isPro: tier === 'pro' || tier === 'premium',
    isPremium: tier === 'premium',
    isGratuit: tier === 'gratuit'
  }
}

// Composant pour afficher un badge de fonctionnalité verrouillée
export function FeatureLock({ requiredTier = 'premium', children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
        <div className="text-center p-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${TIER_COLORS[requiredTier]}`}>
            {TIER_LABELS[requiredTier]}
          </span>
          <p className="text-sm text-[var(--espresso)] mt-2">
            Passez à {TIER_LABELS[requiredTier]} pour débloquer
          </p>
        </div>
      </div>
    </div>
  )
}

// Composant badge tier
export function TierBadge({ tier, className = '' }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${TIER_COLORS[tier]} ${className}`}>
      {TIER_LABELS[tier]}
    </span>
  )
}
