import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { usePageVisibility } from '../hooks/usePageVisibility'
import { Target, BookOpen, TrendingUp, Award, Star, Sparkles, LineChart, BarChart3, FileText, Download, MessageCircle, Loader2, Lock } from 'lucide-react'

// Composant pour télécharger un PDF avec régénération d'URL si nécessaire
function PdfDownloadItem({ pdf }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Générer une nouvelle URL signée pour s'assurer qu'elle est valide
      const { data, error } = await supabase.storage
        .from('student-documents')
        .createSignedUrl(pdf.path, 3600) // URL valide 1 heure

      if (error) {
        console.error('Erreur génération URL:', error)
        // Essayer avec l'URL stockée en fallback
        window.open(pdf.url, '_blank')
        return
      }

      // Ouvrir le PDF dans un nouvel onglet
      window.open(data.signedUrl, '_blank')
    } catch (err) {
      console.error('Erreur téléchargement:', err)
      // Fallback sur l'URL stockée
      window.open(pdf.url, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="bg-[var(--cream)] rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[var(--coral)]/10 flex items-center justify-center">
          <FileText className="text-[var(--coral)]" size={24} />
        </div>
        <div>
          <p className="font-medium text-[var(--espresso)]">{pdf.name}</p>
          <p className="text-xs text-[var(--espresso-light)]">
            Ajouté le {new Date(pdf.uploadedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--sage)] text-white rounded-xl hover:bg-[var(--sage)]/80 transition-colors disabled:opacity-50"
      >
        {downloading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
        <span className="hidden sm:inline">{downloading ? 'Chargement...' : 'Télécharger'}</span>
      </button>
    </div>
  )
}

// Composant graphique pour la courbe de progression
function ProgressChart({ notes, objectif, showChart }) {
  // ✅ NOUVEAU : Vérifier si le graphique doit être affiché
  if (!showChart) {
    return (
      <div className="bg-[var(--cream)] rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="mx-auto mb-3 text-[var(--espresso-light)]" size={40} />
            <p className="text-sm text-[var(--espresso)] font-semibold">Courbe de progression désactivée</p>
          </div>
        </div>
        <div className="h-40 flex items-end justify-around gap-2 opacity-30">
          {[40, 55, 45, 60, 70, 65, 75].map((h, i) => (
            <div key={i} className="w-8 bg-[var(--sage)] rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="bg-[var(--cream)] rounded-2xl p-6 text-center">
        <p className="text-[var(--espresso-light)]">Aucune note enregistrée pour afficher la courbe</p>
      </div>
    )
  }

  const sortedNotes = [...notes].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="bg-[var(--cream)] rounded-2xl p-6">
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
          const points = sortedNotes.map((note, idx) => ({
            x: 60 + (idx * (300 / Math.max(sortedNotes.length - 1, 1))),
            y: 140 - (note.note / 20) * 120
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

      <div className="flex justify-around mt-4 pt-4 border-t border-[var(--sand)]">
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--espresso)]">
            {Math.min(...sortedNotes.map(n => n.note))}/20
          </div>
          <div className="text-[10px] text-[var(--espresso-light)]">Min</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--sage)]">
            {(sortedNotes.reduce((a, n) => a + n.note, 0) / sortedNotes.length).toFixed(1)}/20
          </div>
          <div className="text-[10px] text-[var(--espresso-light)]">Moyenne</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--espresso)]">
            {Math.max(...sortedNotes.map(n => n.note))}/20
          </div>
          <div className="text-[10px] text-[var(--espresso-light)]">Max</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${sortedNotes[sortedNotes.length - 1].note > sortedNotes[0].note ? 'text-[var(--sage)]' : sortedNotes[sortedNotes.length - 1].note < sortedNotes[0].note ? 'text-[var(--coral)]' : 'text-[var(--espresso)]'}`}>
            {sortedNotes.length > 1 ? (sortedNotes[sortedNotes.length - 1].note - sortedNotes[0].note > 0 ? '+' : '') + (sortedNotes[sortedNotes.length - 1].note - sortedNotes[0].note).toFixed(1) : '-'}
          </div>
          <div className="text-[10px] text-[var(--espresso-light)]">Évolution</div>
        </div>
      </div>
    </div>
  )
}

export default function SuiviParent() {
  const [user, setUser] = useState(null)
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMessagingModal, setShowMessagingModal] = useState(false)

    usePageVisibility(() => {
    if (user) {
      fetchStudentData()
    }
  })
  // Récupérer l'utilisateur connecté
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Charger les données de l'élève
  useEffect(() => {
    if (user) {
      fetchStudentData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchStudentData = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Erreur chargement élève:', error)
    } else {
      setStudent(data)
    }
    setLoading(false)
  }

  const calculateAverage = (notes) => {
    if (!notes || notes.length === 0) return null
    return (notes.reduce((acc, n) => acc + n.note, 0) / notes.length).toFixed(1)
  }

  return (
    <>
      
     <div className="min-h-screen bg-[var(--cream)]">
  {/* HERO SECTION */}
  <section className="bg-gradient-to-br from-[var(--sage)] to-[var(--sage)]/70 text-white py-16 px-5 md:px-10">
    <div className="max-w-6xl mx-auto">
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
        <Sparkles size={16} />
        Espace Parent
      </div>
      
      <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-4 leading-tight">
        Suivez la progression en temps réel
      </h1>
      
      <p className="text-lg opacity-90 max-w-2xl">
        Consultez les notes, les objectifs et les appréciations de votre enfant
      </p>
    </div>
  </section>

  {/* CONTENU */}
  <section className="py-12 px-5 md:px-10">
    <div className="max-w-4xl mx-auto">
      {loading ? (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="text-[var(--espresso-light)]">Chargement...</div>
        </div>
      ) : !student ? (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-3">
            Aucun élève associé
          </h2>
          <p className="text-[var(--espresso-light)] max-w-md mx-auto">
            Votre compte n'est pas encore lié à une fiche élève. Vérifiez que vous vous êtes bien inscrit avec le code fourni par votre professeur.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header élève */}
          <div className="bg-gradient-to-br from-[var(--sage)]/10 to-[var(--caramel)]/10 p-8 border-b border-[var(--cream)]">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[var(--sage)] text-white flex items-center justify-center font-semibold text-2xl shadow-lg">
                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h2 className="font-fraunces text-3xl text-[var(--espresso)] font-bold">{student.name}</h2>
                <p className="text-[var(--espresso-light)] flex items-center gap-2">
                  <BookOpen size={16} />
                  {student.niveau} • {student.matiere || 'Matière non spécifiée'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--cream)] rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="text-[var(--sage)]" size={20} />
                </div>
                <div className="text-2xl font-fraunces font-bold text-[var(--espresso)]">
                  {calculateAverage(student.notes) || '-'}
                </div>
                <div className="text-xs text-[var(--espresso-light)]">Moyenne /20</div>
              </div>

              <div className="bg-[var(--cream)] rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="text-[var(--caramel)]" size={20} />
                </div>
                <div className="text-2xl font-fraunces font-bold text-[var(--caramel)]">
                  {student.objectif || 14}
                </div>
                <div className="text-xs text-[var(--espresso-light)]">Objectif /20</div>
              </div>

              <div className="bg-[var(--cream)] rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="text-[var(--sage)]" size={20} />
                </div>
                <div className="text-2xl font-fraunces font-bold text-[var(--espresso)]">
                  {student.notes?.length || 0}
                </div>
                <div className="text-xs text-[var(--espresso-light)]">Notes</div>
              </div>

              <div className="bg-[var(--cream)] rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="text-[var(--sage)]" size={20} />
                </div>
                <div className={`text-2xl font-fraunces font-bold ${(student.progression || 0) >= 100 ? 'text-[var(--sage)]' : 'text-[var(--caramel)]'}`}>
                  {student.progression || 0}%
                </div>
                <div className="text-xs text-[var(--espresso-light)]">Progression</div>
              </div>
            </div>

            {/* Objectif */}
            <div className="bg-[var(--cream)] rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Target className="text-[var(--caramel)] mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--espresso)] mb-1">Objectif de note</h3>
                  <p className="text-sm text-[var(--espresso-light)]">
                    {(student.progression || 0) >= 100
                      ? 'Objectif atteint ! 🎉'
                      : `Encore ${((student.objectif || 14) - parseFloat(calculateAverage(student.notes) || 0)).toFixed(1)} points pour atteindre l'objectif`
                    }
                  </p>
                </div>
                <span className="text-2xl font-fraunces font-bold text-[var(--espresso)]">{student.objectif || 14}/20</span>
              </div>
            </div>

            {/* ✅ Courbe de progression avec vérification du flag */}
            <div>
              <h3 className="font-fraunces text-2xl text-[var(--espresso)] font-bold mb-4 flex items-center gap-2">
                <LineChart className="text-[var(--sage)]" size={28} />
                Courbe de progression
                {!student.show_progress_chart && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-normal">
                    Désactivée
                  </span>
                )}
              </h3>
              <ProgressChart
                notes={student.notes}
                objectif={student.objectif || 14}
                showChart={student.show_progress_chart === true}
              />
            </div>

            {/* Liste des notes */}
            <div>
              <h3 className="font-fraunces text-2xl text-[var(--espresso)] font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="text-[var(--sage)]" size={28} />
                Notes
              </h3>
              {(!student.notes || student.notes.length === 0) ? (
                <div className="bg-[var(--cream)] rounded-2xl p-8 text-center">
                  <BookOpen className="mx-auto text-[var(--espresso-light)] mb-3" size={40} />
                  <p className="text-[var(--espresso-light)]">Aucune note enregistrée</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...student.notes].sort((a, b) => new Date(b.date) - new Date(a.date)).map((note, index) => (
                    <div key={note.id || `${note.date}-${note.note}-${index}`} className="bg-[var(--cream)] rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
                            note.note >= (student.objectif || 14) ? 'bg-[var(--sage)]/20 text-[var(--sage)]' :
                            note.note >= 10 ? 'bg-[var(--caramel)]/20 text-[var(--caramel)]' : 'bg-[var(--coral)]/20 text-[var(--coral)]'
                          }`}>
                            {note.note}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[var(--espresso)]">{note.description || 'Sans description'}</div>
                            <div className="text-xs text-[var(--espresso-light)]">
                              {new Date(note.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                      {note.appreciation && (
                        <div className="mt-3 pt-3 border-t border-[var(--sand)]">
                          <p className="text-sm text-[var(--espresso-light)] italic flex items-start gap-2">
                            <MessageCircle size={16} className="text-[var(--caramel)] mt-0.5 flex-shrink-0" />
                            <span>"{note.appreciation}"</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Appréciation */}
            {student.appreciation && (
              <div>
                <h3 className="font-fraunces text-2xl text-[var(--espresso)] font-bold mb-4 flex items-center gap-2">
                  <Star className="text-[var(--caramel)]" size={28} />
                  Appréciation du professeur
                </h3>
                <div className="bg-gradient-to-br from-[var(--sage)]/10 to-[var(--caramel)]/10 rounded-2xl p-6 border-l-4 border-[var(--sage)]">
                  <p className="text-[var(--espresso)] italic leading-relaxed">
                    "{student.appreciation}"
                  </p>
                </div>
              </div>
            )}

            {/* Documents PDF */}
            {student.pdfs && student.pdfs.length > 0 && (
              <div>
                <h3 className="font-fraunces text-2xl text-[var(--espresso)] font-bold mb-4 flex items-center gap-2">
                  <FileText className="text-[var(--sage)]" size={28} />
                  Documents
                </h3>
                <div className="space-y-3">
                  {student.pdfs.map((pdf) => (
                    <PdfDownloadItem key={pdf.id} pdf={pdf} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </section>
</div>
</>
  )
}