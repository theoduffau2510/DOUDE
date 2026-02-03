import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Bell, MapPin, Users, CheckCircle, ArrowRight, Sparkles, Video, Home, Lock, Repeat, MousePointer2 } from 'lucide-react'

export default function EmploiVitrine() {
  const [selectedDay, setSelectedDay] = useState(2)
  const [selectedTier, setSelectedTier] = useState('gratuit') // gratuit, pro, premium
  const navigate = useNavigate()

  const joursDemo = ['Lun 20', 'Mar 21', 'Mer 22', 'Jeu 23', 'Ven 24']
  
  const coursDemo = [
    // Lundi
    [
      { heure: '14:00', eleve: 'Sophie M.', matiere: 'Maths', duree: '1h30', lieu: 'En ligne', color: 'sage' },
      { heure: '16:00', eleve: 'Lucas D.', matiere: 'Physique', duree: '2h', lieu: 'À domicile', color: 'caramel' }
    ],
    // Mardi
    [
      { heure: '10:00', eleve: 'Emma L.', matiere: 'Maths', duree: '1h', lieu: 'Cabinet', color: 'sage' },
      { heure: '14:00', eleve: 'Thomas B.', matiere: 'Chimie', duree: '1h30', lieu: 'En ligne', color: 'espresso' },
      { heure: '17:00', eleve: 'Sophie M.', matiere: 'Maths', duree: '1h', lieu: 'À domicile', color: 'sage' }
    ],
    // Mercredi (jour sélectionné)
    [
      { heure: '09:00', eleve: 'Lucas D.', matiere: 'Physique', duree: '2h', lieu: 'Cabinet', color: 'caramel' },
      { heure: '13:30', eleve: 'Emma L.', matiere: 'Maths', duree: '1h30', lieu: 'En ligne', color: 'sage' },
      { heure: '16:00', eleve: 'Marie P.', matiere: 'SVT', duree: '1h', lieu: 'À domicile', color: 'espresso' }
    ],
    // Jeudi
    [
      { heure: '14:00', eleve: 'Thomas B.', matiere: 'Chimie', duree: '2h', lieu: 'Cabinet', color: 'espresso' },
      { heure: '18:00', eleve: 'Sophie M.', matiere: 'Maths', duree: '1h', lieu: 'En ligne', color: 'sage' }
    ],
    // Vendredi
    [
      { heure: '10:00', eleve: 'Lucas D.', matiere: 'Physique', duree: '1h30', lieu: 'Cabinet', color: 'caramel' },
      { heure: '15:00', eleve: 'Emma L.', matiere: 'Maths', duree: '1h', lieu: 'À domicile', color: 'sage' }
    ]
  ]

  const coursJour = coursDemo[selectedDay]

  const getColorClass = (color) => {
    const colors = {
      sage: 'from-[var(--sage)] to-[var(--sage)]/70',
      caramel: 'from-[var(--caramel)] to-[var(--caramel)]/70',
      espresso: 'from-[var(--espresso)] to-[var(--espresso)]/70'
    }
    return colors[color] || colors.sage
  }

  const getLieuIcon = (lieu) => {
    if (lieu === 'En ligne') return <Video size={16} />
    if (lieu === 'À domicile') return <Home size={16} />
    return <MapPin size={16} />
  }

  const handleSignUp = () => {
    navigate('/signup')
  }

  // Déterminer les fonctionnalités disponibles selon le tier
  // Premium = niveau le plus élevé (toutes les features)
  // Pro = niveau intermédiaire (multi-sélection)
  // Gratuit = niveau de base
  const hasFeature = (feature) => {
    if (selectedTier === 'premium') return true
    if (selectedTier === 'pro' && feature === 'multiselect') return true
    return false
  }

  const tiers = [
    { id: 'gratuit', label: 'GRATUIT', color: 'gray-500', desc: 'Fonctionnalités de base' },
    { id: 'pro', label: 'PRO', color: 'caramel', desc: 'Multi-sélection' },
    { id: 'premium', label: 'PREMIUM', color: 'sage', desc: 'Récurrence hebdo + tout' }
  ]

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[var(--caramel)] to-[var(--caramel)]/70 text-white py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            <Sparkles size={16} />
            Emploi du temps
          </div>
          
          <h1 className="font-fraunces text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Organisez vos cours<br />en toute simplicité
          </h1>
          
          <p className="text-xl opacity-90 mb-8 max-w-2xl">
            Calendrier intelligent, rappels automatiques et synchronisation avec tous vos appareils. Ne ratez plus jamais un cours.
          </p>

          <button 
            onClick={handleSignUp}
            className="py-4 px-8 bg-white text-[var(--caramel)] rounded-full font-semibold text-base hover-scale cursor-pointer border-none shadow-xl inline-flex items-center gap-2"
          >
            Essayer gratuitement
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* DÉMO INTERACTIVE */}
      <section className="py-16 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-3">
              Votre semaine en un coup d'œil
            </h2>
            <p className="text-[var(--espresso-light)]">
              Visualisez et gérez votre planning facilement
            </p>
          </div>

          {/* Mini Calendrier Hebdomadaire */}
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-6 overflow-x-auto">
            <h3 className="font-semibold text-[var(--espresso)] mb-3 text-center text-sm">Semaine du 20-24 Janvier</h3>
            <div className="min-w-[500px]">
              <div className="grid grid-cols-6 gap-1.5">
                {/* Header avec les jours */}
                <div className="text-[10px] font-semibold text-[var(--espresso-light)] text-center py-1.5">Heure</div>
                {joursDemo.slice(0, 5).map((jour, idx) => (
                  <div key={idx} className="text-[10px] font-semibold text-[var(--espresso)] text-center py-1.5 bg-[var(--cream)] rounded-lg">
                    {jour}
                  </div>
                ))}

                {/* Lignes d'heures avec créneaux */}
                {[9, 10, 13, 14, 16, 17, 18].map((hour) => (
                  <>
                    <div key={`hour-${hour}`} className="text-[10px] text-[var(--espresso-light)] text-center py-2">
                      {hour}h
                    </div>
                    {Array.from({ length: 5 }).map((_, dayIdx) => {
                      const cours = coursDemo[dayIdx]?.find(c => parseInt(c.heure.split(':')[0]) === hour)
                      return (
                        <div key={`${hour}-${dayIdx}`} className="relative">
                          {cours ? (
                            <div
                              className={`p-1.5 rounded-lg text-white text-[10px] font-semibold cursor-pointer hover:shadow-md transition-all`}
                              style={{
                                background: `linear-gradient(135deg, var(--${cours.color}), var(--${cours.color}))`
                              }}
                              onClick={() => setSelectedDay(dayIdx)}
                            >
                              <div className="truncate">{cours.eleve}</div>
                              <div className="text-[8px] opacity-80 truncate">{cours.matiere}</div>
                            </div>
                          ) : (
                            <div className="p-1.5 bg-[var(--cream)] rounded-lg h-full min-h-[40px]"></div>
                          )}
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>

          {/* Sélecteur de jours pour détails */}
          <div className="text-center mb-4">
            <p className="text-sm text-[var(--espresso-light)] mb-3">Cliquez sur un jour pour voir le détail des cours</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {joursDemo.map((jour, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    selectedDay === idx
                      ? 'bg-[var(--caramel)] text-white shadow-lg scale-105'
                      : 'bg-white text-[var(--espresso)] hover:shadow-md'
                  }`}
                >
                  {jour}
                  <div className="text-[10px] mt-0.5 opacity-75">{coursDemo[idx].length} cours</div>
                </button>
              ))}
            </div>
          </div>

          {/* Détails du jour sélectionné */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h3 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">
                  {joursDemo[selectedDay]} Janvier
                </h3>
                <p className="text-sm text-[var(--espresso-light)] mt-1">{coursJour.length} cours planifiés</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--espresso-light)] bg-[var(--cream)] px-3 py-2 rounded-full">
                <Clock size={14} />
                <span>8h de cours</span>
              </div>
            </div>

            <div className="space-y-3">
              {coursJour.map((cours, idx) => (
                <div
                  key={idx}
                  className="group p-5 rounded-xl bg-gradient-to-r hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, var(--${cours.color}), var(--${cours.color}))`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-white font-semibold text-xs flex items-center gap-1.5">
                          <Clock size={12} />
                          {cours.heure}
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs">
                          {cours.duree}
                        </div>
                      </div>
                      
                      <h4 className="text-white font-bold text-lg mb-1.5">{cours.eleve}</h4>
                      <p className="text-white/90 mb-2 text-sm">{cours.matiere}</p>
                      
                      <div className="flex items-center gap-2 text-white/80 text-xs">
                        {getLieuIcon(cours.lieu)}
                        <span>{cours.lieu}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all">
                        <Bell size={16} />
                      </button>
                      <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all">
                        <Users size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {coursJour.length === 0 && (
              <div className="text-center py-12 text-[var(--espresso-light)]">
                <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucun cours prévu ce jour</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS AVANCÉES (PRO & PREMIUM) */}
      <section className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-12 text-center">
            Fonctionnalités avancées
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
            {/* Récurrence (Pro) */}
              <div className="bg-[var(--sage)] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                PREMIUM
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                  <Repeat size={32} />
                </div>
                <h3 className="font-fraunces text-2xl font-bold mb-3">Récurrence hebdomadaire</h3>
                <p className="text-white/90 text-sm mb-6">
                  Créez automatiquement des créneaux qui se répètent chaque semaine. Idéal pour vos cours réguliers avec le même élève.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Définissez une date de fin</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Création automatique chaque semaine</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Gain de temps considérable</span>
                </div>
              </div>
            </div>

            {/* Multi-sélection (Premium) */}  
<div className="bg-[var(--caramel)] rounded-3xl p-8 text-white relative overflow-hidden">              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                PRO
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                  <MousePointer2 size={32} />
                </div>
                <h3 className="font-fraunces text-2xl font-bold mb-3">Multi-sélection avancée</h3>
                <p className="text-white/90 text-sm mb-6">
                  Sélectionnez plusieurs créneaux d'un coup et appliquez des actions groupées. Parfait pour gérer votre planning rapidement.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Actions groupées sur plusieurs créneaux</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Marquer disponible/indisponible en masse</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Suppression groupée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SÉLECTEUR DE TIER */}
      <section className="py-12 px-5 md:px-10 bg-[var(--cream)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold mb-2">
              Découvrez les fonctionnalités selon votre formule
            </h2>
            <p className="text-sm text-[var(--espresso-light)]">
              Sélectionnez une formule pour voir les outils disponibles
            </p>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-6">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  selectedTier === tier.id
                    ? `bg-[var(--${tier.color === 'gray-500' ? 'espresso' : tier.color})] text-white shadow-lg scale-105`
                    : 'bg-white text-[var(--espresso)] hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tier.label}</span>
                  {selectedTier === tier.id && <CheckCircle size={16} />}
                </div>
                <div className={`text-[10px] mt-1 ${selectedTier === tier.id ? 'opacity-90' : 'opacity-60'}`}>
                  {tier.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Affichage des fonctionnalités selon le tier */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-[var(--espresso)] mb-4 text-center text-sm">
              Fonctionnalités disponibles avec la formule {tiers.find(t => t.id === selectedTier)?.label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Fonctionnalités de base (tous) */}
              <div className="flex items-center gap-3 p-3 bg-[var(--cream)] rounded-xl">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold text-[var(--espresso)] text-sm">Calendrier hebdomadaire</div>
                  <div className="text-xs text-[var(--espresso-light)]">Visualisez votre planning</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[var(--cream)] rounded-xl">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold text-[var(--espresso)] text-sm">Gestion des créneaux</div>
                  <div className="text-xs text-[var(--espresso-light)]">Disponible, réservé, validé</div>
                </div>
              </div>

              {/* Statistiques (tous) */}
              <div className="flex items-center gap-3 p-3 bg-[var(--cream)] rounded-xl">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold text-[var(--espresso)] text-sm">Statistiques</div>
                  <div className="text-xs text-[var(--espresso-light)]">Suivez vos créneaux en temps réel</div>
                </div>
              </div>

              {/* Notifications (Pro+) */}
              <div className={`flex items-center gap-3 p-3 rounded-xl ${
                hasFeature('multiselect') ? 'bg-[var(--cream)]' : 'bg-gray-50'
              }`}>
                {hasFeature('multiselect') ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                ) : (
                  <Lock className="text-gray-400 flex-shrink-0" size={20} />
                )}
                <div>
                  <div className={`font-semibold text-sm ${hasFeature('multiselect') ? 'text-[var(--espresso)]' : 'text-gray-400'}`}>
                    Notifications
                  </div>
                  <div className={`text-xs ${hasFeature('multiselect') ? 'text-[var(--espresso-light)]' : 'text-gray-400'}`}>
                    Rappels avant chaque cours
                  </div>
                </div>
                {!hasFeature('multiselect') && (
                  <span className="ml-auto text-[10px] px-2 py-1 bg-[var(--caramel)] text-white rounded-full font-bold flex-shrink-0">
                    PRO
                  </span>
                )}
              </div>

              {/* Multi-sélection (Pro+) */}
              <div className={`flex items-center gap-3 p-3 rounded-xl ${
                hasFeature('multiselect') ? 'bg-[var(--cream)]' : 'bg-gray-50'
              }`}>
                {hasFeature('multiselect') ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                ) : (
                  <Lock className="text-gray-400 flex-shrink-0" size={20} />
                )}
                <div>
                  <div className={`font-semibold text-sm ${hasFeature('multiselect') ? 'text-[var(--espresso)]' : 'text-gray-400'}`}>
                    Multi-sélection
                  </div>
                  <div className={`text-xs ${hasFeature('multiselect') ? 'text-[var(--espresso-light)]' : 'text-gray-400'}`}>
                    Actions groupées sur plusieurs créneaux
                  </div>
                </div>
                {!hasFeature('multiselect') && (
                  <span className="ml-auto text-[10px] px-2 py-1 bg-[var(--caramel)] text-white rounded-full font-bold flex-shrink-0">
                    PRO
                  </span>
                )}
              </div>

              {/* Récurrence (Premium only) */}
              <div className={`flex items-center gap-3 p-3 rounded-xl ${
                selectedTier === 'premium' ? 'bg-[var(--cream)]' : 'bg-gray-50'
              }`}>
                {selectedTier === 'premium' ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                ) : (
                  <Lock className="text-gray-400 flex-shrink-0" size={20} />
                )}
                <div>
                  <div className={`font-semibold text-sm ${selectedTier === 'premium' ? 'text-[var(--espresso)]' : 'text-gray-400'}`}>
                    Récurrence hebdomadaire
                  </div>
                  <div className={`text-xs ${selectedTier === 'premium' ? 'text-[var(--espresso-light)]' : 'text-gray-400'}`}>
                    Créez des créneaux répétitifs
                  </div>
                </div>
                {selectedTier !== 'premium' && (
                  <span className="ml-auto text-[10px] px-2 py-1 bg-[var(--sage)] text-white rounded-full font-bold flex-shrink-0">
                    PREMIUM
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-12 text-center">
            Fonctionnalités incluses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Calendar, title: "Vue calendrier", desc: "Visualisez tous vos cours sur un calendrier intuitif", tier: "gratuit" },
              { icon: Bell, title: "Rappels automatiques", desc: "Recevez des notifications avant chaque cours", tier: "gratuit" },
              { icon: Clock, title: "Gestion des horaires", desc: "Créez, modifiez et annulez des cours facilement", tier: "gratuit" },
              { icon: MapPin, title: "Localisation", desc: "Enregistrez les lieux de cours (domicile, cabinet, en ligne)", tier: "gratuit" },
              { icon: MousePointer2, title: "Multi-sélection", desc: "Actions groupées sur plusieurs créneaux", tier: "pro" },
               { icon: Repeat, title: "Récurrence hebdo", desc: "Créez des créneaux répétitifs automatiquement", tier: "premium" }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-[var(--cream)] rounded-2xl hover:shadow-xl transition-all duration-300 relative">
                {feature.tier !== "gratuit" && (
                  <span className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full font-bold ${
                    feature.tier === "pro" ? "bg-[var(--caramel)] text-white" : "bg-[var(--sage)] text-white"
                  }`}>
                    {feature.tier.toUpperCase()}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.tier === "gratuit" ? "bg-[var(--caramel)]/10" :
                  feature.tier === "pro" ? "bg-[var(--caramel)]/10" :
                  "bg-[var(--sage)]/10"
                }`}>
                  <feature.icon className={
                    feature.tier === "gratuit" ? "text-[var(--caramel)]" :
                    feature.tier === "pro" ? "text-[var(--caramel)]" :
                    "text-[var(--sage)]"
                  } size={24} />
                </div>
                <h3 className="font-semibold text-[var(--espresso)] mb-2">{feature.title}</h3>
                <p className="text-[var(--espresso-light)] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

 {/* COMPARAISON DES FORMULES */}
      <section className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-4 text-center">
            Choisissez la formule adaptée
          </h2>
          <p className="text-center text-[var(--espresso-light)] mb-12 text-lg">
            Comparez les fonctionnalités de chaque formule
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gratuit */}
            <div className="bg-[var(--cream)] rounded-3xl p-8 hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-bold">GRATUIT</span>
                <div className="font-fraunces text-5xl font-bold text-[var(--espresso)] mt-4">0€</div>
                <p className="text-[var(--espresso-light)] text-sm mt-2">Pour découvrir</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm text-[var(--espresso)]">3 élèves maximum</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm text-[var(--espresso)]">Gestion des créneaux</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm text-[var(--espresso)]">Suivi des créneaux en tant réel</span>
                </li>
              </ul>
            </div>

            {/* Pro */}
<div className="bg-[var(--caramel)] rounded-3xl p-8 text-white shadow-2xl scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--espresso)] text-white px-4 py-1 rounded-full text-xs font-bold">
                POPULAIRE
              </div>
              <div className="text-center mb-6">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold">PRO</span>
                <div className="font-fraunces text-5xl font-bold mt-4">5,99€</div>
                <p className="text-white/80 text-sm mt-2">par mois</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">8 élèves maximum</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Notifications par Email avant les cours</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Multi-sélection</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
              <div className="bg-[var(--sage)] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="text-center mb-6">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold">PREMIUM</span>
                <div className="font-fraunces text-5xl font-bold mt-4">8,99€</div>
                <p className="text-white/80 text-sm mt-2">par mois</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Élèves illimités</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Toutes les fonctionnalités Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Créer des créneaux répétitifs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-5 md:px-10 bg-gradient-to-b from-[var(--caramel)] via-[var(--caramel-dark)] to-[var(--espresso)] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-fraunces text-4xl md:text-5xl font-bold mb-6">
            Ne ratez plus jamais un cours
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Organisez votre emploi du temps en quelques clics
          </p>
          <button 
            onClick={handleSignUp}
            className="py-4 px-10 bg-white text-[var(--caramel)] rounded-full font-bold text-lg hover-scale cursor-pointer border-none shadow-2xl"
          >
            Commencer gratuitement
          </button>
          <p className="text-sm opacity-75 mt-4 inline-flex items-center gap-2 justify-center">
            <CheckCircle size={16} />
            Aucune carte bancaire requise • 14 jours d'essai gratuit
          </p>
        </div>
      </section>
    </div>
  )
}