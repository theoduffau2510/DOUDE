
Copier

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useTier, TIER_LIMITS, TIER_LABELS, TIER_COLORS } from '../hooks/useTier.jsx'
import { stripeAPI } from '../lib/api';
import {
  Crown,
  CheckCircle,
  Lock,
  HardDrive,
  Users,
  Calendar,
  TrendingUp,
  FileText,
  MessageCircle,
  BarChart3,
  Repeat,
  Bell,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react'

export default function MonAbonnement() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tier, loading: tierLoading, limits, hasFeature, isPro, isPremium, getMaxPdfSizeLabel } = useTier()

  const [storageUsed, setStorageUsed] = useState(0)
  const [storageLoading, setStorageLoading] = useState(true)
  const [studentCount, setStudentCount] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  // Fonction pour tout recharger (fix du bug de timeout)
  const fetchData = async () => {
    try {
      setError(null)
      await Promise.all([
        fetchStorageUsed(),
        fetchStudentCount()
      ])
    } catch (err) {
      console.error('Erreur chargement données:', err)
      setError('Erreur de chargement. Actualisez la page.')
    }
  }

  // Calculer l'espace de stockage utilisé
  const fetchStorageUsed = async () => {
    try {
      setStorageLoading(true)

      // Récupérer tous les élèves avec leurs PDFs
      const { data: students, error } = await supabase
        .from('students')
        .select('pdfs')
        .eq('user_id', user.id)

      if (error) throw error

      // Calculer la taille totale des PDFs
      let totalSize = 0

      if (students) {
        for (const student of students) {
          if (student.pdfs && Array.isArray(student.pdfs)) {
            for (const pdf of student.pdfs) {
              if (pdf.size) {
                totalSize += pdf.size
              }
            }
          }
        }
      }

      setStorageUsed(totalSize)
    } catch (err) {
      console.error('Erreur calcul stockage:', err)
      throw err
    } finally {
      setStorageLoading(false)
    }
  }

  const fetchStudentCount = async () => {
    const { count, error } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) throw error
    setStudentCount(count || 0)
  }

  // Formater la taille en Mo/Go
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Mo'
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
  }

  // Calcul du pourcentage de stockage utilisé
  const getStoragePercentage = () => {
    if (limits.maxPdfSize === Infinity) return 0
    return Math.min(100, (storageUsed / limits.maxPdfSize) * 100)
  }

  const features = [
    {
      id: 'maxStudents',
      icon: Users,
      title: 'Nombre d\'élèves',
      getValue: () => limits.maxStudents === Infinity ? 'Illimité' : `${studentCount} / ${limits.maxStudents}`,
      available: true
    },
    {
      id: 'pdfStorage',
      icon: HardDrive,
      title: 'Stockage PDF',
      getValue: () => limits.maxPdfSize === Infinity ? 'Illimité' : `${formatSize(storageUsed)} / ${getMaxPdfSizeLabel()}`,
      available: true
    },
    {
      id: 'multiSelectSlots',
      icon: Calendar,
      title: 'Multi-sélection créneaux',
      description: 'Sélectionnez plusieurs créneaux à la fois',
      available: hasFeature('multiSelectSlots'),
      requiredTier: 'pro'
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      description: 'Rappels avant chaque cours',
      available: isPro,
      requiredTier: 'pro'
    },
    {
      id: 'progressChart',
      icon: TrendingUp,
      title: 'Courbe de progression',
      description: 'Visualisez l\'évolution de vos élèves',
      available: hasFeature('progressChart'),
      requiredTier: 'pro'
    },
    {
      id: 'pdfExport',
      icon: FileText,
      title: 'Export PDF',
      description: 'Exportez les fiches élèves en PDF',
      available: hasFeature('pdfExport'),
      requiredTier: 'pro'
    },
    {
      id: 'advancedStats',
      icon: BarChart3,
      title: 'Statistiques avancées',
      description: 'Taux de progression, élèves à risque',
      available: hasFeature('advancedStats'),
      requiredTier: 'premium'
    },
    {
      id: 'globalDashboard',
      icon: BarChart3,
      title: 'Tableau de bord global',
      description: 'Vue d\'ensemble de tous vos élèves',
      available: hasFeature('globalDashboard'),
      requiredTier: 'premium'
    },
    {
      id: 'messaging',
      icon: MessageCircle,
      title: 'Messagerie intégrée',
      description: 'Communiquez avec vos élèves',
      available: hasFeature('messaging'),
      requiredTier: 'premium'
    },
    {
      id: 'recurringSlots',
      icon: Repeat,
      title: 'Récurrence hebdomadaire',
      description: 'Créez des créneaux répétitifs',
      available: hasFeature('recurringSlots'),
      requiredTier: 'premium'
    }
  ]

  const plans = [
    {
      id: 'gratuit',
      name: 'Gratuit',
      price: '0€',
      period: 'pour toujours',
      color: 'sand',
      icon: '☕',
      features: ['3 élèves maximum', 'Gestion des créneaux', 'Upload PDF (20 Mo)', 'Historique 3 mois']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '8,99€',
      period: 'par mois',
      color: 'caramel',
      icon: '🚀',
      popular: true,
      features: ['8 élèves maximum', 'Multi-sélection', 'Notifications', 'Courbe de progression', 'Export PDF', 'Upload PDF (1 Go)']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '12,99€',
      period: 'par mois',
      color: 'sage',
      icon: '👑',
      features: ['Élèves illimités', 'Tout Pro inclus', 'Récurrence hebdo', 'Stats avancées', 'Dashboard global', 'Messagerie']
    }
  ]

  const getTierBadgeColor = () => {
    switch (tier) {
      case 'premium': return 'bg-[var(--sage)] text-white'
      case 'pro': return 'bg-[var(--caramel)] text-white'
      default: return 'bg-[var(--sand)] text-[var(--espresso)]'
    }
  }

  if (tierLoading) {
    return (
      <main className="flex-1 py-10 px-5 md:px-10 bg-[var(--cream)]">
        <div className="max-w-[1200px] mx-auto flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 py-10 px-5 md:px-10 bg-[var(--cream)]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-10 bg-[var(--caramel)] rounded-full" />
            <span className="text-[var(--caramel)] font-bold text-xs uppercase tracking-widest">Mon compte</span>
          </div>
          <h1 className="font-fraunces text-4xl text-[var(--espresso)] font-bold">
            Mon abonnement
          </h1>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="text-red-700 font-semibold text-sm hover:underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Current Plan Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                tier === 'premium' ? 'bg-[var(--sage)]/10' :
                tier === 'pro' ? 'bg-[var(--caramel)]/10' : 'bg-[var(--sand)]/30'
              }`}>
                <Crown className={`${
                  tier === 'premium' ? 'text-[var(--sage)]' :
                  tier === 'pro' ? 'text-[var(--caramel)]' : 'text-[var(--sand)]'
                }`} size={40} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">
                    Formule {TIER_LABELS[tier]}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getTierBadgeColor()}`}>
                    {TIER_LABELS[tier]}
                  </span>
                </div>
                <p className="text-[var(--espresso-light)]">
                  {tier === 'gratuit' && 'Vous utilisez la version gratuite avec des fonctionnalités limitées.'}
                  {tier === 'pro' && 'Profitez de fonctionnalités avancées pour gérer vos élèves.'}
                  {tier === 'premium' && 'Vous avez accès à toutes les fonctionnalités sans limites.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/tarifs')}
                className="py-4 px-8 bg-gradient-to-r from-[var(--caramel)] to-[var(--sage)] text-white rounded-2xl font-bold text-base hover:shadow-xl transition-all flex items-center gap-2 justify-center whitespace-nowrap"
              >
                <ArrowRight size={20} />
                Modifier mon abonnement
              </button>

              {(tier === 'pro' || tier === 'premium') && (
                <button
                  onClick={async () => {
                    if (confirm('Êtes-vous sûr de vouloir gérer votre abonnement ?')) {
                      const { data, error } = await stripeAPI.createPortalSession(user.id);
                      if (error) {
                        alert(`Erreur: ${error}`);
                        return;
                      }
                      if (data?.url) {
                        window.location.href = data.url;
                      }
                    }
                  }}
                  className="py-3 px-6 bg-transparent border-2 border-red-400 text-red-500 rounded-2xl font-semibold text-sm hover:bg-red-50 transition-all flex items-center gap-2 justify-center"
                >
                  Gérer mon abonnement
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Storage Usage - Only for Gratuit and Pro */}
        {tier !== 'premium' && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[var(--sage)]/10 rounded-2xl flex items-center justify-center">
                <HardDrive className="text-[var(--sage)]" size={28} />
              </div>
              <div>
                <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold">Espace de stockage PDF</h3>
                <p className="text-[var(--espresso-light)] text-sm">Espace utilisé pour vos documents</p>
              </div>
            </div>

            {storageLoading ? (
              <div className="flex items-center gap-3 text-[var(--espresso-light)]">
                <Loader2 size={20} className="animate-spin" />
                Calcul en cours...
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-[var(--espresso)]">
                      {formatSize(storageUsed)} utilisé
                    </span>
                    <span className="text-sm text-[var(--espresso-light)]">
                      {getMaxPdfSizeLabel()} max
                    </span>
                  </div>
                  <div className="h-4 bg-[var(--cream)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        getStoragePercentage() > 80 ? 'bg-red-500' :
                        getStoragePercentage() > 50 ? 'bg-orange-500' : 'bg-[var(--sage)]'
                      }`}
                      style={{ width: `${getStoragePercentage()}%` }}
                    />
                  </div>
                </div>

                {getStoragePercentage() > 80 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <HardDrive className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Espace de stockage presque plein</p>
                      <p className="text-xs text-red-600">
                        Passez à {tier === 'gratuit' ? 'Pro (1 Go)' : 'Premium (illimité)'} pour plus d'espace.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 mb-10">
          <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold mb-6">
            Fonctionnalités de votre formule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`p-4 rounded-2xl flex items-center gap-4 ${
                  feature.available ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                {feature.available ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                ) : (
                  <Lock className="text-gray-400 flex-shrink-0" size={24} />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm ${feature.available ? 'text-[var(--espresso)]' : 'text-gray-400'}`}>
                    {feature.title}
                  </div>
                  {feature.getValue ? (
                    <div className={`text-xs ${feature.available ? 'text-[var(--espresso-light)]' : 'text-gray-400'}`}>
                      {feature.getValue()}
                    </div>
                  ) : feature.description && (
                    <div className={`text-xs ${feature.available ? 'text-[var(--espresso-light)]' : 'text-gray-400'}`}>
                      {feature.description}
                    </div>
                  )}
                </div>
                {!feature.available && feature.requiredTier && (
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold flex-shrink-0 ${
                    feature.requiredTier === 'premium' ? 'bg-[var(--sage)] text-white' : 'bg-[var(--caramel)] text-white'
                  }`}>
                    {feature.requiredTier.toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Section with New Design */}
        {tier !== 'premium' && (
          <div>
            <h3 className="font-fraunces text-2xl font-bold text-[var(--espresso)] mb-2 text-center">
              Débloquez plus de fonctionnalités
            </h3>
            <p className="text-center text-[var(--espresso-light)] mb-8">
              Passez à une formule supérieure pour profiter de toutes les fonctionnalités
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = plan.id === tier
                const cardColor = plan.id === 'premium' ? 'sage' : plan.id === 'pro' ? 'caramel' : 'sand'
                
                return (
                  <div
                    key={plan.id}
                    className={`
                      relative bg-white rounded-[2rem] p-6 shadow-lg
                      transition-all duration-300
                      ${isCurrentPlan ? 'ring-4 ring-[var(--' + cardColor + ')] scale-105' : 'hover:shadow-xl hover:-translate-y-1'}
                      ${plan.popular && !isCurrentPlan ? 'ring-2 ring-[var(--caramel)]/30' : ''}
                    `}
                  >
                    {/* Badge Populaire */}
                    {plan.popular && !isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--caramel)] text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Sparkles size={12} />
                        POPULAIRE
                      </div>
                    )}

                    {/* Badge Plan Actuel */}
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--sage)] text-white px-4 py-1 rounded-full text-xs font-bold">
                        FORMULE ACTUELLE
                      </div>
                    )}

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                        bg-[var(--${cardColor})]/10
                      `}>
                        {plan.icon}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="text-center mb-2">
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-xs font-bold
                        bg-[var(--${cardColor})] text-white
                      `}>
                        {plan.name.toUpperCase()}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="font-fraunces text-4xl font-bold text-[var(--espresso)]">
                        {plan.price}
                      </div>
                      <p className="text-[var(--espresso-light)] text-sm">{plan.period}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[var(--espresso-light)]">
                          <CheckCircle size={18} className={`text-[var(--${cardColor})] flex-shrink-0 mt-0.5`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    {isCurrentPlan ? (
                      <div className={`
                        py-3 px-4 rounded-xl text-center text-sm font-semibold
                        bg-[var(--${cardColor})]/10 text-[var(--${cardColor})]
                      `}>
                        Formule actuelle
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate('/tarifs')}
                        className={`
                          w-full py-3 px-4 rounded-xl text-center text-sm font-bold
                          transition-all
                          ${plan.id === 'gratuit' 
                            ? 'bg-[var(--sand)] text-[var(--espresso)] hover:bg-[var(--sand)]/80' 
                            : `bg-[var(--${cardColor})] text-white hover:bg-[var(--${cardColor})]/90 hover:shadow-lg`
                          }
                        `}
                      >
                        {plan.id === 'gratuit' ? 'Voir les détails' : 'Choisir ' + plan.name}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}