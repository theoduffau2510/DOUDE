import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useTier } from '../hooks/useTier.jsx'
import { usePageVisibility } from '../hooks/usePageVisibility'
import {
  LineChart,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  BookOpen,
  MessageCircle,
  AlertTriangle,
  BarChart3,
  Crown,
  TrendingDown
} from 'lucide-react'
import MessagingModal from '../components/MessagingModal'

export default function DashboardProf() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { hasFeature } = useTier()
  const [stats, setStats] = useState({
    totalStudents: 0,
    nextSlots: []
  })
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [unreadCounts, setUnreadCounts] = useState({})
  const [showMessagingModal, setShowMessagingModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [statsPeriod, setStatsPeriod] = useState('month') // 'month' | 'year'

  usePageVisibility(() => {
    if (user) {
      fetchStats()
      fetchStudents()
    }
  })
  
  useEffect(() => {
    if (user) {
      fetchStats()
      fetchStudents()
    }
  }, [user])

  // Calcul des stats avancées (Premium)
  const advancedStats = useMemo(() => {
    if (!hasFeature('advancedStats') || students.length === 0) return null

    const periodStart = new Date()
    if (statsPeriod === 'month') {
      periodStart.setMonth(periodStart.getMonth() - 1)
    } else {
      periodStart.setFullYear(periodStart.getFullYear() - 1)
    }

    // Grouper les élèves par niveau
    const niveaux = {}
    const atRiskStudents = []

    students.forEach(student => {
      const niveau = student.niveau || 'Non défini'
      if (!niveaux[niveau]) {
        niveaux[niveau] = { students: [], totalProgression: 0, count: 0 }
      }

      // Calculer la progression sur la période
      const notes = student.notes || []
      const recentNotes = notes.filter(n => new Date(n.date) >= periodStart)

      let progression = 0
      if (recentNotes.length >= 2) {
        const firstHalf = recentNotes.slice(0, Math.floor(recentNotes.length / 2))
        const secondHalf = recentNotes.slice(Math.floor(recentNotes.length / 2))

        const avgFirst = firstHalf.reduce((a, n) => a + n.note, 0) / firstHalf.length
        const avgSecond = secondHalf.reduce((a, n) => a + n.note, 0) / secondHalf.length

        progression = avgSecond - avgFirst
      }

      niveaux[niveau].students.push(student)
      niveaux[niveau].totalProgression += progression
      niveaux[niveau].count++

      // Détecter les élèves à risque (moyenne en baisse)
      if (notes.length >= 3) {
        const lastThree = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
        const previousThree = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(3, 6)

        if (previousThree.length >= 2) {
          const avgLast = lastThree.reduce((a, n) => a + n.note, 0) / lastThree.length
          const avgPrev = previousThree.reduce((a, n) => a + n.note, 0) / previousThree.length

          if (avgLast < avgPrev - 1) { // Baisse de plus de 1 point
            atRiskStudents.push({
              ...student,
              avgDrop: (avgPrev - avgLast).toFixed(1),
              currentAvg: avgLast.toFixed(1),
              previousAvg: avgPrev.toFixed(1)
            })
          }
        }
      }
    })

    // Calculer les moyennes de progression par niveau
    const progressionByLevel = Object.entries(niveaux).map(([niveau, data]) => ({
      niveau,
      avgProgression: data.count > 0 ? (data.totalProgression / data.count).toFixed(2) : 0,
      studentCount: data.count
    })).sort((a, b) => parseFloat(b.avgProgression) - parseFloat(a.avgProgression))

    return {
      progressionByLevel,
      atRiskStudents: atRiskStudents.sort((a, b) => parseFloat(b.avgDrop) - parseFloat(a.avgDrop))
    }
  }, [students, statsPeriod, hasFeature])

  // Polling pour les messages non lus
  useEffect(() => {
    if (user && students.length > 0) {
      fetchUnreadCounts()
      const interval = setInterval(fetchUnreadCounts, 30000)
      return () => clearInterval(interval)
    }
  }, [user, students])

  const fetchStats = async () => {
    try {
      // Récupérer le nombre d'élèves
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Récupérer les prochains créneaux réservés
      const today = new Date().toISOString().split('T')[0]
      const { data: slots } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'reserve')
        .gte('slot_date', today)
        .order('slot_date', { ascending: true })
        .limit(3)

      setStats({
        totalStudents: studentsCount || 0,
        nextSlots: slots || []
      })
    } catch (err) {
      console.error('Erreur chargement stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (!error && data) {
        setStudents(data)
      }
    } catch (err) {
      console.error('Erreur chargement élèves:', err)
    }
  }

  const fetchUnreadCounts = async () => {
    if (students.length === 0) return

    try {
      const counts = {}
      for (const student of students) {
        const { data, error } = await supabase
          .from('messages')
          .select('id')
          .eq('student_id', student.id)
          .eq('sender_role', 'eleve')
          .eq('is_read', false)

        if (!error && data) {
          counts[student.id] = data.length
        }
      }
      setUnreadCounts(counts)
    } catch (err) {
      console.error('Erreur récupération messages:', err)
    }
  }

  const openMessaging = (student) => {
    setSelectedStudent(student)
    setShowMessagingModal(true)
  }

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Professeur'

  return (
    <main className="flex-1 py-6 md:py-10 px-4 md:px-10 bg-[var(--cream)]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-6 md:mb-10">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="h-1 w-8 md:w-10 bg-[var(--caramel)] rounded-full" />
            <span className="text-[var(--caramel)] font-bold text-[10px] md:text-xs uppercase tracking-widest">Tableau de bord</span>
          </div>
          <h1 className="font-fraunces text-2xl sm:text-3xl md:text-4xl text-[var(--espresso)] font-bold">
            Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--espresso)] to-[var(--caramel)]">{firstName}</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
              <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-sm border border-black/5">
                <Users className="text-[var(--sage)] mb-3 md:mb-4" size={24} />
                <div className="text-3xl md:text-4xl font-fraunces font-bold text-[var(--espresso)]">
                  {stats.totalStudents}
                </div>
                <p className="text-[10px] md:text-xs font-bold uppercase opacity-50 mt-1">Élèves suivis</p>
              </div>

              <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-sm border border-black/5">
                <div className="flex items-center gap-2 mb-3 md:mb-4 text-[var(--sage)]">
                  <Clock size={20} />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Prochains cours</span>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  {stats.nextSlots.length > 0 ? stats.nextSlots.map(s => (
                    <div key={s.id} className="text-xs md:text-sm font-medium text-[var(--espresso)] border-l-2 border-[var(--cream)] pl-2 md:pl-3">
                      {formatDate(s.slot_date)} • {s.slot_hour}h - <span className="truncate">{s.student_name || 'Élève'}</span>
                    </div>
                  )) : <p className="text-xs italic opacity-50 text-[var(--espresso)]">Aucun cours prévu</p>}
                </div>
              </div>
            </div>

            {/* Section Messagerie (compacte) */}
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-black/5 mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <MessageCircle className="text-[var(--sage)]" size={16} />
                  <span className="font-semibold text-[var(--espresso)] text-xs md:text-sm">Messagerie</span>
                </div>
                {totalUnread > 0 && (
                  <span className="bg-[var(--coral)] text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full font-bold">
                    {totalUnread} non lu{totalUnread > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {students.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {students.slice(0, 6).map(student => (
                    <button
                      key={student.id}
                      onClick={() => openMessaging(student)}
                      className="flex items-center gap-1.5 md:gap-2 py-1.5 md:py-2 px-2 md:px-3 bg-[var(--cream)] rounded-lg md:rounded-xl hover:shadow-md transition-all text-left group relative"
                    >
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[var(--caramel)] text-white flex items-center justify-center font-semibold text-[10px] md:text-xs">
                        {student.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span className="text-[10px] md:text-xs font-medium text-[var(--espresso)] max-w-[60px] md:max-w-[80px] truncate">{student.name}</span>
                      {unreadCounts[student.id] > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[var(--coral)] text-white text-[8px] md:text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold">
                          {unreadCounts[student.id]}
                        </span>
                      )}
                    </button>
                  ))}
                  {students.length > 6 && (
                    <span className="text-[10px] md:text-xs text-[var(--espresso-light)] self-center">+{students.length - 6}</span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[var(--espresso-light)]">Aucun élève</p>
              )}
            </div>

            {/* Boutons Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-10">
              <button
                onClick={() => navigate('/suivi')}
                className="flex items-center gap-4 md:gap-6 bg-[var(--sage)] text-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-lg hover:translate-y-[-4px] transition-all group text-left"
              >
                <LineChart size={28} className="opacity-80 md:w-10 md:h-10" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-fraunces text-lg md:text-2xl font-bold">Suivi des élèves</h3>
                  <p className="opacity-70 text-xs md:text-sm">Gérer la progression</p>
                </div>
                <ArrowRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>

              <button
                onClick={() => navigate('/emploi')}
                className="flex items-center gap-4 md:gap-6 bg-[var(--caramel)] text-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-lg hover:translate-y-[-4px] transition-all group text-left"
              >
                <Calendar size={28} className="opacity-80 md:w-10 md:h-10" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-fraunces text-lg md:text-2xl font-bold">Emploi du temps</h3>
                  <p className="opacity-70 text-xs md:text-sm">Planifier les cours</p>
                </div>
                <ArrowRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            </div>

            {/* Section rapide */}
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-black/5 mb-6 md:mb-10">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="font-fraunces text-lg md:text-2xl text-[var(--espresso)] font-bold">Accès rapide</h2>
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <button
                  onClick={() => navigate('/suivi')}
                  className="p-3 md:p-4 bg-[var(--cream)] rounded-xl md:rounded-2xl hover:shadow-md transition-all text-left"
                >
                  <BookOpen className="text-[var(--sage)] mb-1.5 md:mb-2" size={20} />
                  <p className="font-semibold text-[var(--espresso)] text-[10px] md:text-sm">Ajouter élève</p>
                </button>
                <button
                  onClick={() => navigate('/emploi')}
                  className="p-3 md:p-4 bg-[var(--cream)] rounded-xl md:rounded-2xl hover:shadow-md transition-all text-left"
                >
                  <Calendar className="text-[var(--caramel)] mb-1.5 md:mb-2" size={20} />
                  <p className="font-semibold text-[var(--espresso)] text-[10px] md:text-sm">Planifier cours</p>
                </button>
                <button
                  onClick={() => navigate('/abonnement')}
                  className="p-3 md:p-4 bg-[var(--cream)] rounded-xl md:rounded-2xl hover:shadow-md transition-all text-left"
                >
                  <Crown className="text-[var(--caramel)] mb-1.5 md:mb-2" size={20} />
                  <p className="font-semibold text-[var(--espresso)] text-[10px] md:text-sm">Abonnement</p>
                </button>
              </div>
            </div>

            {/* Stats Avancées (Premium) */}
            {hasFeature('advancedStats') && advancedStats && (
              <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-black/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-[var(--sage)]/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <BarChart3 className="text-[var(--sage)]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-fraunces text-base md:text-xl text-[var(--espresso)] font-bold flex items-center gap-2">
                        Stats avancées
                        <Crown className="text-[var(--sage)]" size={14} />
                      </h3>
                      <p className="text-[var(--espresso-light)] text-xs md:text-sm hidden sm:block">Analyse de la progression</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setStatsPeriod('month')}
                      className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all ${
                        statsPeriod === 'month'
                          ? 'bg-[var(--sage)] text-white'
                          : 'bg-[var(--cream)] text-[var(--espresso)] hover:bg-[var(--sand)]'
                      }`}
                    >
                      Ce mois
                    </button>
                    <button
                      onClick={() => setStatsPeriod('year')}
                      className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all ${
                        statsPeriod === 'year'
                          ? 'bg-[var(--sage)] text-white'
                          : 'bg-[var(--cream)] text-[var(--espresso)] hover:bg-[var(--sand)]'
                      }`}
                    >
                      Cette année
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Progression par niveau */}
                  <div className="bg-[var(--cream)] rounded-2xl p-6">
                    <h4 className="font-semibold text-[var(--espresso)] mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-[var(--sage)]" />
                      Progression par niveau
                    </h4>
                    {advancedStats.progressionByLevel.length > 0 ? (
                      <div className="space-y-3">
                        {advancedStats.progressionByLevel.map((level, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-[var(--espresso)]">{level.niveau}</span>
                              <span className="text-xs text-[var(--espresso-light)]">({level.studentCount} élève{level.studentCount > 1 ? 's' : ''})</span>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                              parseFloat(level.avgProgression) > 0
                                ? 'bg-green-100 text-green-700'
                                : parseFloat(level.avgProgression) < 0
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {parseFloat(level.avgProgression) > 0 ? (
                                <TrendingUp size={14} />
                              ) : parseFloat(level.avgProgression) < 0 ? (
                                <TrendingDown size={14} />
                              ) : null}
                              {parseFloat(level.avgProgression) > 0 ? '+' : ''}{level.avgProgression} pts
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--espresso-light)] text-center py-4">
                        Pas assez de données pour cette période
                      </p>
                    )}
                  </div>

                  {/* Élèves à risque */}
                  <div className="bg-[var(--cream)] rounded-2xl p-6">
                    <h4 className="font-semibold text-[var(--espresso)] mb-4 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-orange-500" />
                      Élèves à surveiller
                    </h4>
                    {advancedStats.atRiskStudents.length > 0 ? (
                      <div className="space-y-3">
                        {advancedStats.atRiskStudents.slice(0, 5).map((student, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl cursor-pointer hover:shadow-md transition-all"
                            onClick={() => navigate('/suivi')}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-xs">
                                {student.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="font-semibold text-[var(--espresso)] text-sm">{student.name}</p>
                                <p className="text-xs text-[var(--espresso-light)]">{student.matiere} - {student.niveau}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-red-600 text-sm font-bold">
                                <TrendingDown size={14} />
                                -{student.avgDrop} pts
                              </div>
                              <p className="text-[10px] text-[var(--espresso-light)]">
                                {student.previousAvg} → {student.currentAvg}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="text-green-600" size={24} />
                        </div>
                        <p className="text-sm text-[var(--espresso-light)]">
                          Aucun élève en difficulté
                        </p>
                        <p className="text-xs text-green-600 font-semibold">
                          Tous vos élèves progressent bien !
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Messagerie */}
      {showMessagingModal && selectedStudent && user && (
        <MessagingModal
          student={selectedStudent}
          user={user}
          userRole="professeur"
          onClose={() => {
            setShowMessagingModal(false)
            setSelectedStudent(null)
            fetchUnreadCounts()
          }}
        />
      )}
    </main>
  )
}
