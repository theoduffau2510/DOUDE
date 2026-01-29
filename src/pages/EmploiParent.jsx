import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Calendar, Clock, Sparkles, CheckCircle, XCircle, AlertCircle, Repeat, X } from 'lucide-react'

export default function EmploiParent() {
  const { user } = useAuth()

  const [student, setStudent] = useState(null)
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()))
  const [slots, setSlots] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [modalSlot, setModalSlot] = useState(null)
  const [loading, setLoading] = useState(true)

  // Récurrence
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false)
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('')

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  useEffect(() => {
    if (user) {
      fetchStudentData()
    }
  }, [user])

  useEffect(() => {
    if (student) {
      fetchSlots()
    }
  }, [student, currentWeekStart])

  function getMonday(d) {
    d = new Date(d)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  function addDays(date, n) {
    const r = new Date(date)
    r.setDate(r.getDate() + n)
    return r
  }

  function formatDateKey(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const fetchStudentData = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('student_user_id', user.id)
    .maybeSingle()

  console.log('👤 Données élève:', {
    found: !!data,
    name: data?.name,
    prof_id: data?.user_id,
    error
  })

  if (error) {
    console.error('❌ Erreur chargement élève:', error)
    setLoading(false)
    return
  }

  setStudent(data)
}

const fetchSlots = async () => {
  if (!student) return;
  setLoading(true);

  const weekStart = formatDateKey(currentWeekStart);
  const weekEnd = formatDateKey(addDays(currentWeekStart, 6));

  console.log('🔍 Récupération créneaux du prof:', student.user_id);

  // ✅ Récupérer TOUS les créneaux du professeur pour cette semaine
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', student.user_id) // ← Créneaux du prof de l'élève
    .gte('slot_date', weekStart)
    .lte('slot_date', weekEnd);

  console.log('📅 Créneaux reçus:', data?.length || 0);

  if (error) {
    console.error('❌ Erreur chargement créneaux:', error);
  } else {
    const slotsObj = {};
    data?.forEach(slot => {
      const key = `${slot.slot_date}-${slot.slot_hour}`;
      slotsObj[key] = {
        id: slot.id,
        status: slot.status,
        student_name: slot.student_name,
        notes: slot.notes
      };
    });
    setSlots(slotsObj);
    console.log('✅ Créneaux traités:', Object.keys(slotsObj).length);
  }
  setLoading(false);
};

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekEnd = addDays(currentWeekStart, 6)
  const weekDisplay = `${currentWeekStart.getDate()} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`

  const handleCellClick = (key) => {
    const slot = slots[key]
    if (slot?.status === 'disponible' || (slot?.status === 'reserve' && slot?.student_name === student?.name)) {
      setModalSlot(key)
      setShowModal(true)
    }
  }

  const handleReserve = async () => {
  if (!modalSlot || !student) return

  const existingSlot = slots[modalSlot]
  if (!existingSlot?.id) return

  console.log('🎯 Tentative de réservation:', {
    slot_id: existingSlot.id,
    student_name: student.name,
    current_status: existingSlot.status
  })

  const { data, error } = await supabase
    .from('schedules')
    .update({
      status: 'reserve',
      student_name: student.name,
      updated_at: new Date().toISOString()
    })
    .eq('id', existingSlot.id)
    .select()

  console.log('📝 Résultat réservation:', { data, error })

  if (error) {
    console.error('❌ Erreur réservation:', error)
    alert('Erreur lors de la réservation: ' + error.message)
    return
  }

  console.log('✅ Réservation réussie!')
  setSlots(prev => ({
    ...prev,
    [modalSlot]: { ...prev[modalSlot], status: 'reserve', student_name: student.name }
  }))
  setShowModal(false)
  setModalSlot(null)
}

  const handleCancelReservation = async () => {
    if (!modalSlot) return

    const existingSlot = slots[modalSlot]
    if (!existingSlot?.id) return

    if (existingSlot.student_name !== student?.name) return

    const { error } = await supabase
      .from('schedules')
      .update({
        status: 'disponible',
        student_name: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSlot.id)

    if (error) {
      console.error('Erreur annulation:', error)
      alert('Erreur lors de l\'annulation')
      return
    }

    setSlots(prev => ({
      ...prev,
      [modalSlot]: { ...prev[modalSlot], status: 'disponible', student_name: null }
    }))
    setShowModal(false)
    setModalSlot(null)
  }

  // Réservation récurrente
  const handleRecurringReservation = async () => {
    if (!modalSlot || !student || !recurrenceEndDate) return

    const [year, month, day, hour] = modalSlot.split('-')
    const startDate = new Date(`${year}-${month}-${day}`)
    const endDate = new Date(recurrenceEndDate)
    const slotHour = parseInt(hour)

    // Récupérer tous les créneaux disponibles du prof pour cette période
    const weekStart = formatDateKey(startDate)
    const weekEnd = formatDateKey(endDate)

    const { data: availableSlots, error: fetchError } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', student.user_id)
      .eq('slot_hour', slotHour)
      .eq('status', 'disponible')
      .gte('slot_date', weekStart)
      .lte('slot_date', weekEnd)

    if (fetchError) {
      console.error('Erreur récupération créneaux:', fetchError)
      alert('Erreur lors de la récupération des créneaux disponibles')
      return
    }

    // Filtrer pour garder seulement les créneaux du même jour de la semaine
    const dayOfWeek = startDate.getDay()
    const slotsToReserve = availableSlots?.filter(slot => {
      const slotDate = new Date(slot.slot_date)
      return slotDate.getDay() === dayOfWeek
    }) || []

    if (slotsToReserve.length === 0) {
      alert('Aucun créneau disponible trouvé pour cette récurrence')
      return
    }

    // Réserver tous les créneaux trouvés
    const slotIds = slotsToReserve.map(s => s.id)
    const { error: updateError } = await supabase
      .from('schedules')
      .update({
        status: 'reserve',
        student_name: student.name,
        updated_at: new Date().toISOString()
      })
      .in('id', slotIds)

    if (updateError) {
      console.error('Erreur réservation récurrente:', updateError)
      alert('Erreur lors de la réservation récurrente')
      return
    }

    // Rafraîchir les données
    await fetchSlots()
    setShowRecurrenceModal(false)
    setShowModal(false)
    setRecurrenceEndDate('')
    setModalSlot(null)
    alert(`${slotsToReserve.length} créneau(x) réservé(s) avec succès !`)
  }

  // Stats
  const totalDisponibles = Object.values(slots).filter(s => s.status === 'disponible').length
  const mesReservations = Object.values(slots).filter(s => s.status === 'reserve' && s.student_name === student?.name).length
  const coursTermines = Object.values(slots).filter(s => s.status === 'done' && s.student_name === student?.name).length

  // Si pas d'utilisateur connecté
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--espresso)]">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si pas d'élève associé
  if (!student && !loading) {
    return (
      <main className="flex-1 py-8 px-5 md:px-10 bg-[var(--cream)] min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-3xl p-16 shadow-2xl text-center">
            <div className="w-20 h-20 bg-[var(--cream)] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-[var(--espresso-light)]" />
            </div>
            <h2 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-3">
              Aucun élève associé
            </h2>
            <p className="text-[var(--espresso-light)] text-lg">
              Votre compte n'est pas encore lié à une fiche élève. Vérifiez que vous vous êtes bien inscrit avec le code fourni par votre professeur.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 py-8 px-5 md:px-10 bg-[var(--cream)] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[var(--sage)]/10 rounded-full text-sm font-medium text-[var(--sage)]">
            <Sparkles size={16} />
            Espace Parents
          </div>
          <h1 className="font-fraunces text-5xl text-[var(--espresso)] font-bold mb-3">
            Réservez vos cours
          </h1>
          <p className="text-[var(--espresso-light)] text-lg">
            Consultez les disponibilités et gérez vos réservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <div className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-1">{totalDisponibles}</div>
            <div className="text-sm text-[var(--espresso-light)]">Créneaux disponibles</div>
          </div>

          <div className="bg-[#c29672] text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <Calendar size={32} />
            </div>
            <div className="font-fraunces text-4xl font-bold mb-1">{mesReservations}</div>
            <div className="text-sm opacity-90">Mes réservations</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-gray-600" size={24} />
              </div>
            </div>
            <div className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-1">{coursTermines}</div>
            <div className="text-sm text-[var(--espresso-light)]">Cours terminés</div>
          </div>
        </div>
        
        {/* Prochains cours - VERSION MINI MARRON UNI */}
        {mesReservations > 0 && (
           <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <h3 className="font-semibold text-sm text-[var(--espresso)] mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-[var(--caramel)]" />
              Vos prochains cours ({mesReservations})
            </h3>
            <div className="flex flex-wrap gap-2">
              {hours.map((hour) => 
                Array.from({ length: 7 }).map((_, dayIndex) => {
                  const cellDate = addDays(currentWeekStart, dayIndex)
                  const key = `${formatDateKey(cellDate)}-${hour}`
                  const slot = slots[key]
                  
                  if (!slot || slot.status !== 'reserve' || slot.student_name !== student?.name) return null
                  
                  const dateStr = cellDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
                  
                  return (
                    <div
                      key={key}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#c29672] text-white rounded-lg text-xs font-semibold hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleCellClick(key)}
                      title={slot.notes || 'Cliquez pour gérer'}
                    >
                      <Clock size={12} />
                      {dateStr} • {hour}h
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Week Navigation */}
        <div className="flex justify-between items-center mb-6 bg-white py-4 px-6 rounded-2xl shadow-lg">
          <button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            className="py-3 px-6 bg-transparent border-2 border-[var(--sand)] text-[var(--espresso)] rounded-full text-sm font-semibold hover:bg-[var(--cream)] transition-all cursor-pointer"
          >
            ← Semaine précédente
          </button>
          <div className="flex items-center gap-3">
            <span className="font-fraunces text-lg font-bold text-[var(--espresso)]">{weekDisplay}</span>
            <button
              onClick={() => setCurrentWeekStart(getMonday(new Date()))}
              className="py-2 px-4 bg-[var(--sage)] text-white rounded-full text-sm font-semibold cursor-pointer border-none hover:bg-[var(--sage)]/90 transition-all"
            >
              Aujourd'hui
            </button>
          </div>
          <button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            className="py-3 px-6 bg-transparent border-2 border-[var(--sand)] text-[var(--espresso)] rounded-full text-sm font-semibold hover:bg-[var(--cream)] transition-all cursor-pointer"
          >
            Semaine suivante →
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-6 flex-wrap items-center bg-white py-4 px-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--espresso)]">
            <div className="w-4 h-4 rounded-lg bg-[var(--sage)]" />
            <span>Disponible (cliquez pour réserver)</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--espresso)]">
            <div className="w-4 h-4 rounded-lg bg-[var(--caramel)]" />
            <span>Votre réservation</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--espresso)]">
            <div className="w-4 h-4 rounded-lg bg-gray-400" />
            <span>Indisponible</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block w-12 h-12 border-4 border-[var(--sage)] border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-[var(--espresso-light)] font-medium">Chargement des disponibilités...</div>
            </div>
          ) : (
            <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-px bg-[var(--sand)] rounded-2xl overflow-hidden min-w-[800px]">
              {/* Header */}
              <div className="bg-[var(--espresso)] text-white py-4 px-3 text-center font-bold text-sm">
                Heure
              </div>
              {Array.from({ length: 7 }).map((_, i) => {
                const d = addDays(currentWeekStart, i)
                const isToday = d.getTime() === today.getTime()
                return (
                  <div
                    key={i}
                    className={`py-4 px-3 text-center font-bold text-sm ${
                      isToday 
                        ? 'bg-[var(--sage)] text-white' 
                        : 'bg-[var(--espresso)] text-white'
                    }`}
                  >
                    <span className="block mb-1 text-xs opacity-90">{dayNames[i]}</span>
                    <span className="font-fraunces text-xl">{d.getDate()}</span>
                  </div>
                )
              })}

              {/* Time slots */}
              {hours.map((hour) => (
                <>
                  <div key={`time-${hour}`} className="bg-[var(--cream)] py-3 px-2 text-center text-sm font-bold text-[var(--espresso)]">
                    {hour}h
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const cellDate = addDays(currentWeekStart, dayIndex)
                    const key = `${formatDateKey(cellDate)}-${hour}`
                    const slot = slots[key]

                    let bgClass = 'bg-white'
                    let content = null
                    let isClickable = false

                    if (slot) {
                      if (slot.status === 'disponible') {
                        bgClass = 'bg-green-50 hover:bg-green-100'
                        content = (
                          <div className="bg-[var(--sage)] text-white py-2 px-2 rounded-xl text-xs font-bold text-center shadow-md">
                            Dispo
                          </div>
                        )
                        isClickable = true
                      } else if (slot.status === 'reserve') {
                        if (slot.student_name === student?.name) {
                          bgClass = 'bg-orange-50 hover:bg-orange-100'
                          content = (
                            <div className="bg-[var(--caramel)] text-white py-2 px-2 rounded-xl text-xs font-bold shadow-md">
                              Mon cours
                            </div>
                          )
                          isClickable = true
                        } else {
                          bgClass = 'bg-gray-100'
                          content = (
                            <div className="bg-gray-400 text-white py-2 px-2 rounded-xl text-xs font-bold shadow-md">
                              Occupé
                            </div>
                          )
                        }
                      } else if (slot.status === 'done') {
                        bgClass = 'bg-gray-50'
                        content = (
                          <div className="bg-[var(--espresso)] text-white py-2 px-2 rounded-xl text-xs font-bold shadow-md">
                            ✓ Fait
                          </div>
                        )
                      } else if (slot.status === 'indisponible') {
                        bgClass = 'bg-[var(--cream)] opacity-60'
                      }
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => isClickable && handleCellClick(key)}
                        className={`${bgClass} min-h-[60px] p-2 ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''} transition-all duration-200`}
                      >
                        {content}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && modalSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">
                {slots[modalSlot]?.status === 'reserve' ? 'Votre réservation' : 'Réserver ce créneau'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--cream)] transition-all text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="bg-[var(--sage)] rounded-2xl p-6 text-center mb-6 text-white shadow-lg">
              <div className="font-fraunces text-2xl font-bold mb-1">
                {(() => {
                  const [year, month, day] = modalSlot.split('-')
                  return `${day}/${month}/${year}`
                })()}
              </div>
              <div className="text-lg font-semibold opacity-90 flex items-center justify-center gap-2">
                <Clock size={18} />
                {modalSlot.split('-')[3]}h00
              </div>
            </div>
            
            <div className="space-y-3">
              {slots[modalSlot]?.status === 'disponible' ? (
                <>
                  <button
                    onClick={handleReserve}
                    className="w-full py-4 bg-[var(--sage)] text-white rounded-2xl font-bold text-base hover:bg-[var(--sage)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Réserver ce créneau
                  </button>
                  <button
                    onClick={() => setShowRecurrenceModal(true)}
                    className="w-full py-4 bg-[var(--caramel)] text-white rounded-2xl font-bold text-base hover:bg-[var(--caramel)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                  >
                    <Repeat size={20} />
                    Réserver chaque semaine
                  </button>
                  <p className="text-xs text-center text-[var(--espresso-light)]">
                    Réservez ce créneau une fois ou de façon récurrente
                  </p>
                </>
              ) : (
                <>
                  <div className="text-center py-3 px-4 bg-[var(--cream)] rounded-xl mb-4">
                    <p className="text-sm text-[var(--espresso)] font-medium">
                      Ce créneau est réservé pour vous
                    </p>
                  </div>
                  <button
                    onClick={handleCancelReservation}
                    className="w-full py-4 bg-transparent text-red-600 rounded-2xl font-bold text-base border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Annuler la réservation
                  </button>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-[var(--cream)] text-[var(--espresso)] rounded-2xl font-semibold text-base hover:bg-[var(--sand)] transition-all cursor-pointer border-none"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Récurrence */}
      {showRecurrenceModal && modalSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-5">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Réservation récurrente</h2>
              <button
                onClick={() => {
                  setShowRecurrenceModal(false)
                  setRecurrenceEndDate('')
                }}
                className="text-2xl text-[var(--espresso-light)] hover:text-[var(--espresso)] bg-transparent border-none cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--cream)] transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-[var(--caramel)] to-[var(--caramel)]/70 rounded-2xl p-4 mb-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Repeat size={20} />
                <span className="font-semibold">Réservation hebdomadaire</span>
              </div>
              <p className="text-sm opacity-90">
                Ce créneau sera réservé chaque semaine (même jour, même heure) si disponible.
              </p>
            </div>

            <div className="bg-[var(--sage)] rounded-2xl p-4 text-center mb-6 text-white">
              <div className="font-fraunces text-xl font-bold mb-1">
                {(() => {
                  const [year, month, day] = modalSlot.split('-')
                  const date = new Date(`${year}-${month}-${day}`)
                  return date.toLocaleDateString('fr-FR', { weekday: 'long' })
                })()}s à {modalSlot.split('-')[3]}h00
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                Jusqu'à quelle date ?
              </label>
              <input
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                min={modalSlot ? `${modalSlot.split('-')[0]}-${modalSlot.split('-')[1]}-${modalSlot.split('-')[2]}` : ''}
                className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--caramel)] focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRecurringReservation}
                disabled={!recurrenceEndDate}
                className="w-full py-4 bg-[var(--sage)] text-white rounded-2xl font-bold text-base hover:bg-[var(--sage)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={20} />
                Réserver tous les créneaux
              </button>

              <button
                onClick={() => {
                  setShowRecurrenceModal(false)
                  setRecurrenceEndDate('')
                }}
                className="w-full py-4 bg-[var(--cream)] text-[var(--espresso)] rounded-2xl font-semibold text-base hover:bg-[var(--sand)] transition-all cursor-pointer border-none"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}