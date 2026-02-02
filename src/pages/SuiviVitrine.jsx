import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Target, BookOpen, TrendingUp, CheckCircle, Star, ArrowRight, Sparkles, Award, BarChart3, Lock, Smartphone } from 'lucide-react'

export default function SuiviVitrine() {
  const [selectedEleve, setSelectedEleve] = useState(0)
  const navigate = useNavigate()

const handleSignUp = () => {
  navigate('/signup')
}

  const elevesDemo = [
    {
      nom: "Sophie Martin",
      niveau: "Terminale Spécialité Maths",
      matiere: "Mathématiques",
      moyenne: 15.5,
      progression: "+2.3",
      objectif: "15/20",
      derniereNote: 17,
      seances: 24,
      appreciation: "Excellente progression ! Sophie maîtrise parfaitement les dérivées.",
      notes: [13, 14, 15, 14.5, 16, 17, 17],
      tier: "gratuit",
      tierLabel: "GRATUIT",
      tierColor: "gray"
    },
    {
      nom: "Lucas Dubois",
      niveau: "1ère",
      matiere: "Physique",
      moyenne: 12.8,
      progression: "+1.5",
      objectif: "14/20",
      derniereNote: 14,
      seances: 18,
      appreciation: "Bon travail. Les concepts de forces sont maintenant acquis.",
      notes: [11, 11.5, 12, 13, 12.5, 14, 14],
      tier: "pro",
      tierLabel: "PRO",
      tierColor: "caramel"
    },
    {
      nom: "Emma Leroy",
      niveau: "Seconde",
      matiere: "Mathématiques",
      moyenne: 13.2,
      progression: "+0.8",
      objectif: "16.5/20",
      derniereNote: 13.5,
      seances: 12,
      appreciation: "Progrès réguliers. Continue les exercices sur les équations.",
      notes: [12.5, 13, 12, 13.5, 14, 13, 13.5],
      tier: "premium",
      tierLabel: "PREMIUM",
      tierColor: "sage"
    }
  ]

  const eleve = elevesDemo[selectedEleve]

  // Fonction pour déterminer si une fonctionnalité est accessible
  const hasFeature = (feature) => {
    if (eleve.tier === "premium") return true
    if (eleve.tier === "pro" && ["progressChart", "pdfExport"].includes(feature)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[var(--sage)] to-[var(--sage)]/70 text-white py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            <Sparkles size={16} />
            Suivi des élèves
          </div>
          
          <h1 className="font-fraunces text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Suivez la progression de<br />chaque élève en temps réel
          </h1>
          
          <p className="text-xl opacity-90 mb-8 max-w-2xl">
            Notes, objectifs, appréciations et graphiques de progression. Tout ce qu&apos;il vous faut pour accompagner vos élèves vers la réussite.
          </p>

         <button 
  onClick={handleSignUp}
  className="py-4 px-8 bg-white text-[var(--sage)] rounded-full font-semibold text-base hover-scale cursor-pointer border-none shadow-xl inline-flex items-center gap-2"
>
  Essayer gratuitement
  <ArrowRight size={20} />
</button>
        </div>
      </section>

      {/* DÉMO INTERACTIVE */}
      <section className="py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-4">
              Testez l&apos;interface en direct
            </h2>
            <p className="text-lg text-[var(--espresso-light)]">
              Cliquez sur un élève pour découvrir les fonctionnalités de chaque formule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {elevesDemo.map((e, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedEleve(idx)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative ${
                  selectedEleve === idx
                    ? 'bg-[var(--sage)] text-white shadow-2xl scale-105'
                    : 'bg-white hover:shadow-xl'
                }`}
              >
                {/* Badge Tier */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  e.tier === "gratuit" ? "bg-gray-500 text-white" :
                  e.tier === "pro" ? "bg-[var(--caramel)] text-white" :
                  "bg-[var(--sage)] text-white"
                }`}>
                  {e.tierLabel}
                </div>

                <div className="flex items-center gap-3 mb-4 mt-8">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    selectedEleve === idx ? 'bg-white/20' : 'bg-[var(--sage)]/10 text-[var(--sage)]'
                  }`}>
                    {e.nom.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{e.nom}</h3>
                    <p className={`text-sm ${selectedEleve === idx ? 'opacity-90' : 'text-[var(--espresso-light)]'}`}>
                      {e.niveau}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className={selectedEleve === idx ? 'text-white' : 'text-[var(--sage)]'} />
                  <span className="font-semibold">{e.moyenne}/20</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    selectedEleve === idx ? 'bg-white/20' : 'bg-green-100 text-green-700'
                  }`}>
                    {e.progression}
                  </span>
                </div>
                
                <p className={`text-sm ${selectedEleve === idx ? 'opacity-80' : 'text-[var(--espresso-light)]'}`}>
                  {e.seances} séances
                </p>
              </div>
            ))}
          </div>

          {/* Détails de l'élève sélectionné */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-fraunces text-3xl text-[var(--espresso)] font-bold">
                    {eleve.nom}
                  </h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    eleve.tier === "gratuit" ? "bg-gray-500 text-white" :
                    eleve.tier === "pro" ? "bg-[var(--caramel)] text-white" :
                    "bg-[var(--sage)] text-white"
                  }`}>
                    {eleve.tierLabel}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Target className="text-[var(--caramel)] mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-[var(--espresso)]">Objectif</div>
                      <div className="text-[var(--espresso-light)]">{eleve.objectif}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <BookOpen className="text-[var(--sage)] mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-[var(--espresso)]">Matière</div>
                      <div className="text-[var(--espresso-light)]">{eleve.matiere} • {eleve.niveau}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="text-[var(--caramel)] mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-[var(--espresso)]">Dernière note</div>
                      <div className="text-2xl font-bold text-[var(--sage)]">{eleve.derniereNote}/20</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[var(--espresso)] mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[var(--sage)]" />
                  Courbe de progression
                  {!hasFeature("progressChart") && (
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                      eleve.tier === "gratuit" ? "bg-[var(--caramel)] text-white" : "bg-[var(--sage)] text-white"
                    }`}>
                      {eleve.tier === "gratuit" ? "PRO" : "PREMIUM"}
                    </span>
                  )}
                </h4>
                
                {hasFeature("progressChart") ? (
                  <div className="bg-[var(--cream)] rounded-2xl p-6 mb-6">
                    <svg viewBox="0 0 400 160" className="w-full h-40">
                      {/* Grille horizontale */}
                      {[0, 5, 10, 15, 20].map((val, idx) => (
                        <g key={idx}>
                          <line
                            x1="40"
                            y1={140 - (val / 20) * 120}
                            x2="380"
                            y2={140 - (val / 20) * 120}
                            stroke="var(--sand)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          <text
                            x="25"
                            y={144 - (val / 20) * 120}
                            fill="var(--espresso-light)"
                            fontSize="10"
                            textAnchor="end"
                          >
                            {val}
                          </text>
                        </g>
                      ))}
                      
                      {/* Courbe de progression */}
                      {(() => {
                        const notes = eleve.notes
                        const points = notes.map((note, idx) => ({
                          x: 60 + (idx * 50),
                          y: 140 - (note / 20) * 120
                        }))
                        
                        const pathD = points.reduce((path, point, idx) => {
                          if (idx === 0) return `M ${point.x} ${point.y}`
                          const prevPoint = points[idx - 1]
                          const cpX1 = prevPoint.x + 20
                          const cpX2 = point.x - 20
                          return `${path} C ${cpX1} ${prevPoint.y}, ${cpX2} ${point.y}, ${point.x} ${point.y}`
                        }, '')
                        
                        return (
                          <>
                            <path
                              d={`${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`}
                              fill="url(#gradient)"
                              opacity="0.2"
                            />
                            
                            <path
                              d={pathD}
                              stroke="var(--sage)"
                              strokeWidth="3"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {points.map((point, idx) => (
                              <g key={idx}>
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="5"
                                  fill="white"
                                  stroke="var(--sage)"
                                  strokeWidth="3"
                                  className="cursor-pointer hover:r-6 transition-all"
                                />
                                <text
                                  x={point.x}
                                  y={155}
                                  fill="var(--espresso-light)"
                                  fontSize="9"
                                  textAnchor="middle"
                                >
                                  S{idx + 1}
                                </text>
                              </g>
                            ))}
                          </>
                        )
                      })()}
                      
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--sage)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="flex items-center gap-3 text-sm mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[var(--sage)] rounded-full"></div>
                        <span className="text-[var(--espresso-light)]">Moyenne: {eleve.moyenne}/20</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-green-600 font-semibold">{eleve.progression} points</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[var(--cream)] rounded-2xl p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="mx-auto mb-3 text-[var(--espresso-light)]" size={40} />
                        <span className={`${
                          eleve.tier === "gratuit" ? "bg-[var(--caramel)]" : "bg-[var(--sage)]"
                        } text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                          {eleve.tier === "gratuit" ? "PRO" : "PREMIUM"}
                        </span>
                        <p className="text-sm text-[var(--espresso)] mt-2 font-semibold">
                          Débloquez la courbe de progression
                        </p>
                      </div>
                    </div>
                    <div className="h-40 flex items-end justify-around gap-2 opacity-30">
                      {[40, 55, 45, 60, 70, 65, 75].map((h, i) => (
                        <div key={i} className="w-8 bg-[var(--sage)] rounded-t" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[var(--sand)] pt-6">
              <h4 className="font-semibold text-[var(--espresso)] mb-3">Dernière appréciation</h4>
              <p className="text-[var(--espresso-light)] bg-[var(--cream)] p-4 rounded-xl">
                {eleve.appreciation}
              </p>
            </div>

            {/* Section fonctionnalités selon le tier */}
            <div className="border-t border-[var(--sand)] pt-6 mt-6">
              <h4 className="font-semibold text-[var(--espresso)] mb-4">
                Fonctionnalités disponibles pour cet élève ({eleve.tierLabel})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Fonctionnalités de base (tous) */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm text-[var(--espresso)]">Notes et évaluations</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm text-[var(--espresso)]">Appréciations</span>
                </div>

                {/* Upload PDF (Tous) */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm text-[var(--espresso)]">
                    Upload de documents
                  </span>
                </div>

                {/* ✅ NOUVEAU : Activer/Désactiver courbe (Tous) */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm text-[var(--espresso)]">
                    Activer/désactiver courbe
                  </span>
                </div>

                {/* Export PDF (Pro+) */}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${
                  hasFeature("pdfExport") ? "bg-green-50" : "bg-gray-50"
                }`}>
                  {hasFeature("pdfExport") ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <Lock className="text-gray-400" size={20} />
                  )}
                  <span className={`text-sm ${hasFeature("pdfExport") ? "text-[var(--espresso)]" : "text-gray-400"}`}>
                    Export PDF
                  </span>
                  {!hasFeature("pdfExport") && (
                    <span className="ml-auto text-xs px-2 py-1 bg-[var(--caramel)] text-white rounded-full">
                      PRO
                    </span>
                  )}
                </div>

                {/* Courbe de progression AUTO (Pro+) */}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${
                  hasFeature("progressChart") ? "bg-green-50" : "bg-gray-50"
                }`}>
                  {hasFeature("progressChart") ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <Lock className="text-gray-400" size={20} />
                  )}
                  <span className={`text-sm ${hasFeature("progressChart") ? "text-[var(--espresso)]" : "text-gray-400"}`}>
                    Courbe automatique
                  </span>
                  {!hasFeature("progressChart") && (
                    <span className="ml-auto text-xs px-2 py-1 bg-[var(--caramel)] text-white rounded-full">
                      PRO
                    </span>
                  )}
                </div>

                {/* Dashboard global (Premium) */}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${
                  eleve.tier === "premium" ? "bg-green-50" : "bg-gray-50"
                }`}>
                  {eleve.tier === "premium" ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <Lock className="text-gray-400" size={20} />
                  )}
                  <span className={`text-sm ${eleve.tier === "premium" ? "text-[var(--espresso)]" : "text-gray-400"}`}>
                    Tableau de bord global
                  </span>
                  {eleve.tier !== "premium" && (
                    <span className="ml-auto text-xs px-2 py-1 bg-[var(--sage)] text-white rounded-full">
                      PREMIUM
                    </span>
                  )}
                </div>

                {/* Messagerie (Premium) */}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${
                  eleve.tier === "premium" ? "bg-green-50" : "bg-gray-50"
                }`}>
                  {eleve.tier === "premium" ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <Lock className="text-gray-400" size={20} />
                  )}
                  <span className={`text-sm ${eleve.tier === "premium" ? "text-[var(--espresso)]" : "text-gray-400"}`}>
                    Messagerie intégrée
                  </span>
                  {eleve.tier !== "premium" && (
                    <span className="ml-auto text-xs px-2 py-1 bg-[var(--sage)] text-white rounded-full">
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>
            </div>
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
                  <span className="text-sm text-[var(--espresso)]">Notes et appréciations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm text-[var(--espresso)]">Upload de documents (20 Mo max)</span>
                </li>
                {/* ✅ NOUVEAU */}
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm text-[var(--espresso)]">Activer/désactiver la courbe</span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <Lock className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm text-gray-400">Courbe automatiquement activée</span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <Lock className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm text-gray-400">Export PDF</span>
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
                <div className="font-fraunces text-5xl font-bold mt-4">8,99€</div>
                <p className="text-white/80 text-sm mt-2">par mois</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">10 élèves maximum</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Courbe toujours activée</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Export PDF</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Upload de documents (1 Go max)</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
              <div className="bg-[var(--sage)] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="text-center mb-6">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold">PREMIUM</span>
                <div className="font-fraunces text-5xl font-bold mt-4">12,99€</div>
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
                  <span className="text-sm">Upload illimité</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Tableau de bord global</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm">Messagerie intégrée</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-12 text-center">
            Fonctionnalités incluses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Star, title: "Notes & évaluations", desc: "Enregistrez toutes les notes et créez des évaluations personnalisées", tier: "gratuit" },
              { icon: Target, title: "Objectifs personnalisés", desc: "Définissez et suivez les objectifs de chaque élève", tier: "gratuit" },
              { icon: TrendingUp, title: "Graphiques de progression", desc: "Visualisez l'évolution avec des graphiques clairs", tier: "pro" },
              { icon: BookOpen, title: "Historique complet", desc: "Accédez à l'historique de toutes les séances", tier: "gratuit" },
              { icon: CheckCircle, title: "Appréciations", desc: "Rédigez des appréciations pour chaque cours", tier: "gratuit" },
              { icon: Award, title: "Upload de documents", desc: "Partagez des fiches et exercices avec vos élèves", tier: "gratuit" },
              { icon: BarChart3, title: "Dashboard global", desc: "Vue d'ensemble de tous vos élèves", tier: "premium" },
              { icon: LineChart, title: "Export PDF", desc: "Exportez les fiches élèves en PDF", tier: "pro" }, 
              { icon: Smartphone, title: "Messagerie sécurisée", desc: "Communiquer en sécurité avec l'élève et sa famille", tier: "premium" }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 relative">
                {feature.tier !== "gratuit" && (
                  <span className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full font-bold ${
                    feature.tier === "pro" ? "bg-[var(--caramel)] text-white" : "bg-[var(--sage)] text-white"
                  }`}>
                    {feature.tier.toUpperCase()}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.tier === "gratuit" ? "bg-[var(--sage)]/10" :
                  feature.tier === "pro" ? "bg-[var(--caramel)]/10" :
                  "bg-[var(--sage)]/10"
                }`}>
                  <feature.icon className={
                    feature.tier === "gratuit" ? "text-[var(--sage)]" :
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

      {/* CTA FINAL */}
      <section className="py-20 px-5 md:px-10 bg-gradient-to-b from-[var(--caramel)] via-[var(--caramel-dark)] to-[var(--espresso)] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-fraunces text-4xl md:text-5xl font-bold mb-6">
            Prêt à transformer votre suivi d&apos;élèves ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez des centaines de professeurs qui utilisent déjà Doude
          </p>
          <button 
  onClick={handleSignUp}
  className="py-4 px-10 bg-white text-[var(--sage)] rounded-full font-bold text-lg hover-scale cursor-pointer border-none shadow-2xl"
>
  Commencer gratuitement
</button>
          <p className="text-sm opacity-75 mt-4 inline-flex items-center gap-2 justify-center">
            <CheckCircle size={16} />
            Aucune carte bancaire requise • 14 jours d&apos;essai gratuit
          </p>
        </div>
      </section>
    </div>
  )
}