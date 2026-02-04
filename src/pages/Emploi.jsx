import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { usePageVisibility } from '../hooks/usePageVisibility'
import { Calendar, Clock, Sparkles, CheckCircle, XCircle, MousePointer2, Repeat, X, Link, Unlink, RefreshCw, ExternalLink, Loader2 } from 'lucide-react'
import { useTier } from '../hooks/useTier.jsx'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar.jsx'

export default function Emploi() {
  const [user, setUser] = useState(null);
  const { isPro, hasFeature } = useTier()
  const { isConnected: isGoogleConnected, isLoading: googleLoading, error: googleError, connect: connectGoogle, disconnect: disconnectGoogle, syncSlots: syncToGoogle, hasGoogleClientId } = useGoogleCalendar()

  // Google Calendar Modal
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [syncResult, setSyncResult] = useState(null)

  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()))
  const [slots, setSlots] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [modalSlot, setModalSlot] = useState(null)
  const [loading, setLoading] = useState(true)

  // Multi-sélection
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [selectedSlots, setSelectedSlots] = useState([])
  const [showMultiModal, setShowMultiModal] = useState(false)

  // Récurrence (Pro only)
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false)
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('')
  const [showMultiRecurrenceModal, setShowMultiRecurrenceModal] = useState(false)
  const [multiRecurrenceEndDate, setMultiRecurrenceEndDate] = useState('')

  usePageVisibility(() => {
    if (user) {
      fetchSlots()
    }
  })

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  useEffect(() => {
    // Récupère l'utilisateur actuel
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    // Écoute les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchSlots()
    }
  }, [user, currentWeekStart])

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

  const fetchSlots = async () => {
    if (!user) return
    setLoading(true)

    const weekStart = formatDateKey(currentWeekStart)
    const weekEnd = formatDateKey(addDays(currentWeekStart, 6))

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', user.id)
      .gte('slot_date', weekStart)
      .lte('slot_date', weekEnd)

    if (error) {
      console.error('Erreur chargement créneaux:', error)
    } else {
      const slotsObj = {}
      data?.forEach(slot => {
        const key = `${slot.slot_date}-${slot.slot_hour}`
        slotsObj[key] = {
          id: slot.id,
          status: slot.status,
          student_name: slot.student_name,
          notes: slot.notes
        }
      })
      setSlots(slotsObj)
    }
    setLoading(false)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekEnd = addDays(currentWeekStart, 6)
  const weekDisplay = `${currentWeekStart.getDate()} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`

  const handleCellClick = (key) => {
    if (multiSelectMode) {
      // Mode multi-sélection : ajouter/retirer de la sélection
      setSelectedSlots(prev => {
        if (prev.includes(key)) {
          return prev.filter(k => k !== key)
        }
        return [...prev, key]
      })
    } else {
      // Mode normal : ouvrir le modal
      setModalSlot(key)
      setShowModal(true)
    }
  }

  // Toggle multi-select mode
  const toggleMultiSelectMode = () => {
    if (multiSelectMode) {
      setSelectedSlots([])
    }
    setMultiSelectMode(!multiSelectMode)
  }

  // Appliquer une action à tous les créneaux sélectionnés
  const handleMultiAction = async (status) => {
    if (selectedSlots.length === 0) return

    for (const slotKey of selectedSlots) {
      const [year, month, day, hour] = slotKey.split('-')
      const slotDate = `${year}-${month}-${day}`
      const slotHour = parseInt(hour)
      const existingSlot = slots[slotKey]

      if (existingSlot?.id) {
        await supabase
          .from('schedules')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', existingSlot.id)
      } else {
        const { data } = await supabase
          .from('schedules')
          .insert({
            user_id: user.id,
            slot_date: slotDate,
            slot_hour: slotHour,
            status
          })
          .select('id')
          .single()

        if (data) {
          setSlots(prev => ({
            ...prev,
            [slotKey]: { id: data.id, status }
          }))
        }
      }
    }

    // Rafraîchir les données
    await fetchSlots()
    setSelectedSlots([])
    setShowMultiModal(false)
  }

  // Supprimer tous les créneaux sélectionnés
  const handleMultiDelete = async () => {
    if (selectedSlots.length === 0) return

    for (const slotKey of selectedSlots) {
      const existingSlot = slots[slotKey]
      if (existingSlot?.id) {
        await supabase
          .from('schedules')
          .delete()
          .eq('id', existingSlot.id)
      }
    }

    await fetchSlots()
    setSelectedSlots([])
    setShowMultiModal(false)
  }

  // Créer des créneaux récurrents (Pro only)
  const handleRecurringSlots = async (status) => {
    if (!isPro || !modalSlot || !recurrenceEndDate) return

    const [year, month, day, hour] = modalSlot.split('-')
    const startDate = new Date(`${year}-${month}-${day}`)
    const endDate = new Date(recurrenceEndDate)
    const slotHour = parseInt(hour)

    const slotsToCreate = []
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateKey = formatDateKey(currentDate)
      const key = `${dateKey}-${slotHour}`

      // Ne pas créer si le créneau existe déjà
      if (!slots[key]) {
        slotsToCreate.push({
          user_id: user.id,
          slot_date: dateKey,
          slot_hour: slotHour,
          status
        })
      }

      // Avancer d'une semaine
      currentDate.setDate(currentDate.getDate() + 7)
    }

    if (slotsToCreate.length > 0) {
      const { error } = await supabase
        .from('schedules')
        .insert(slotsToCreate)

      if (error) {
        console.error('Erreur création récurrence:', error)
        alert('Erreur lors de la création des créneaux récurrents')
        return
      }
    }

    await fetchSlots()
    setShowRecurrenceModal(false)
    setShowModal(false)
    setRecurrenceEndDate('')
    setModalSlot(null)
  }

  // Créer des créneaux récurrents à partir de la multi-sélection (Pro only)
  const handleMultiRecurringSlots = async (status) => {
    if (!isPro || selectedSlots.length === 0 || !multiRecurrenceEndDate) return

    const endDate = new Date(multiRecurrenceEndDate)
    const slotsToCreate = []

    for (const slotKey of selectedSlots) {
      const [year, month, day, hour] = slotKey.split('-')
      const startDate = new Date(`${year}-${month}-${day}`)
      const slotHour = parseInt(hour)

      let currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        const dateKey = formatDateKey(currentDate)
        const key = `${dateKey}-${slotHour}`

        // Ne pas créer si le créneau existe déjà
        if (!slots[key] && !slotsToCreate.some(s => s.slot_date === dateKey && s.slot_hour === slotHour)) {
          slotsToCreate.push({
            user_id: user.id,
            slot_date: dateKey,
            slot_hour: slotHour,
            status
          })
        }

        // Avancer d'une semaine
        currentDate.setDate(currentDate.getDate() + 7)
      }
    }

    if (slotsToCreate.length > 0) {
      const { error } = await supabase
        .from('schedules')
        .insert(slotsToCreate)

      if (error) {
        console.error('Erreur création récurrence multi:', error)
        alert('Erreur lors de la création des créneaux récurrents')
        return
      }
    }

    await fetchSlots()
    setShowMultiRecurrenceModal(false)
    setShowMultiModal(false)
    setMultiRecurrenceEndDate('')
    setSelectedSlots([])
    setMultiSelectMode(false)
  }

  const handleSaveSlot = async (status) => {
    if (!modalSlot || !user) return

    const [year, month, day, hour] = modalSlot.split('-')
    const slotDate = `${year}-${month}-${day}`
    const slotHour = parseInt(hour)

    const existingSlot = slots[modalSlot]

    if (existingSlot?.id) {
      const { error } = await supabase
        .from('schedules')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', existingSlot.id)

      if (error) {
        console.error('Erreur mise à jour:', error)
        alert('Erreur lors de la mise à jour')
        return
      }
    } else {
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          user_id: user.id,
          slot_date: slotDate,
          slot_hour: slotHour,
          status
        })
        .select('id')
        .single()

      if (error) {
        console.error('Erreur création:', error)
        alert('Erreur lors de la création')
        return
      }

      setSlots(prev => ({
        ...prev,
        [modalSlot]: { id: data.id, status }
      }))
      setShowModal(false)
      setModalSlot(null)
      return
    }

    setSlots(prev => ({
      ...prev,
      [modalSlot]: { ...prev[modalSlot], status }
    }))
    setShowModal(false)
    setModalSlot(null)
  }

  const handleDeleteSlot = async () => {
    if (!modalSlot) return

    const existingSlot = slots[modalSlot]
    if (!existingSlot?.id) {
      setShowModal(false)
      return
    }

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', existingSlot.id)

    if (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression')
      return
    }

    setSlots(prev => {
      const newSlots = { ...prev }
      delete newSlots[modalSlot]
      return newSlots
    })
    setShowModal(false)
    setModalSlot(null)
  }

  // Stats
  const totalSlots = Object.keys(slots).length
  const disponibles = Object.values(slots).filter(s => s.status === 'disponible').length
  const reserves = Object.values(slots).filter(s => s.status === 'reserve').length
  const valides = Object.values(slots).filter(s => s.status === 'done').length

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

  return (
    <main className="flex-1 py-8 px-5 md:px-10 bg-[var(--cream)] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 mb-3 md:mb-4 px-3 md:px-4 py-1.5 md:py-2 bg-[var(--caramel)]/10 rounded-full text-xs md:text-sm font-medium text-[var(--caramel)]">
            <Sparkles size={14} className="md:w-4 md:h-4" />
            Emploi du temps
          </div>
          <h1 className="font-fraunces text-2xl sm:text-3xl md:text-5xl text-[var(--espresso)] font-bold mb-2 md:mb-3">
            Votre planning
          </h1>
          <p className="text-[var(--espresso-light)] text-sm md:text-lg">
            Gérez vos créneaux et réservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-[var(--caramel)]/10 rounded-lg md:rounded-xl flex items-center justify-center">
                <Calendar className="text-[var(--caramel)]" size={16} />
              </div>
            </div>
            <div className="font-fraunces text-2xl md:text-4xl text-[var(--espresso)] font-bold mb-0.5 md:mb-1">{totalSlots}</div>
            <div className="text-xs md:text-sm text-[var(--espresso-light)]">Créneaux</div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-600" size={16} />
              </div>
            </div>
            <div className="font-fraunces text-2xl md:text-4xl text-[var(--espresso)] font-bold mb-0.5 md:mb-1">{disponibles}</div>
            <div className="text-xs md:text-sm text-[var(--espresso-light)]">Disponibles</div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <Clock className="text-orange-600" size={16} />
              </div>
            </div>
            <div className="font-fraunces text-2xl md:text-4xl text-[var(--espresso)] font-bold mb-0.5 md:mb-1">{reserves}</div>
            <div className="text-xs md:text-sm text-[var(--espresso-light)]">Réservés</div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <CheckCircle className="text-gray-600" size={16} />
              </div>
            </div>
            <div className="font-fraunces text-2xl md:text-4xl text-[var(--espresso)] font-bold mb-0.5 md:mb-1">{valides}</div>
            <div className="text-xs md:text-sm text-[var(--espresso-light)]">Validés</div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 md:mb-6 bg-white py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl shadow-lg">
          <button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            className="hidden sm:block py-2 md:py-3 px-4 md:px-6 bg-transparent border-2 border-[var(--sand)] text-[var(--espresso)] rounded-full text-xs md:text-sm font-semibold hover:bg-[var(--cream)] transition-all cursor-pointer"
          >
            ← Précédent
          </button>
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-center">
            <button
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
              className="sm:hidden py-2 px-3 bg-transparent border-2 border-[var(--sand)] text-[var(--espresso)] rounded-full text-xs font-semibold cursor-pointer"
            >
              ←
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <span className="font-fraunces text-sm md:text-lg font-bold text-[var(--espresso)]">{weekDisplay}</span>
              <button
                onClick={() => setCurrentWeekStart(getMonday(new Date()))}
                className="py-1.5 md:py-2 px-3 md:px-4 bg-[var(--caramel)] text-white rounded-full text-xs md:text-sm font-semibold cursor-pointer border-none hover:bg-[var(--caramel)]/90 transition-all"
              >
                Aujourd'hui
              </button>
            </div>
            <button
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
              className="sm:hidden py-2 px-3 bg-transparent border-2 border-[var(--sand)] text-[var(--espresso)] rounded-full text-xs font-semibold cursor-pointer"
            >
              →
            </button>
          </div>
          <button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            className="hidden sm:block py-2 md:py-3 px-4 md:px-6 bg-transparent border-2 border-[var(--sand)] text-[var(--espresso)] rounded-full text-xs md:text-sm font-semibold hover:bg-[var(--cream)] transition-all cursor-pointer"
          >
            Suivant →
          </button>
        </div>

        {/* Multi-select toggle + Google Calendar + Legend */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-6 mb-4 md:mb-6 items-start lg:items-center justify-between bg-white py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl shadow-md">
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={toggleMultiSelectMode}
              className={`flex items-center gap-1.5 md:gap-2 py-1.5 md:py-2 px-3 md:px-4 rounded-full font-semibold text-xs md:text-sm transition-all cursor-pointer border-2 ${
                multiSelectMode
                  ? 'bg-[var(--caramel)] text-white border-[var(--caramel)]'
                  : 'bg-transparent text-[var(--espresso)] border-[var(--sand)] hover:border-[var(--caramel)]'
              }`}
            >
              <MousePointer2 size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">{multiSelectMode ? 'Mode sélection actif' : 'Multi-sélection'}</span>
              <span className="sm:hidden">{multiSelectMode ? 'Actif' : 'Multi'}</span>
            </button>

            {/* Google Calendar - Premium only */}
            {hasFeature('googleCalendar') ? (
              <button
                onClick={() => setShowGoogleModal(true)}
                className={`flex items-center gap-1.5 md:gap-2 py-1.5 md:py-2 px-3 md:px-4 rounded-full font-semibold text-xs md:text-sm transition-all cursor-pointer border-2 ${
                  isGoogleConnected
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-transparent text-[var(--espresso)] border-[var(--sand)] hover:border-green-500'
                }`}
              >
                {isGoogleConnected ? <Link size={14} /> : <Calendar size={14} />}
                <span className="hidden sm:inline">{isGoogleConnected ? 'Google Calendar' : 'Google Calendar'}</span>
                <span className="sm:hidden">GCal</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  disabled
                  className="flex items-center gap-1.5 md:gap-2 py-1.5 md:py-2 px-3 md:px-4 rounded-full font-semibold text-xs md:text-sm bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
                >
                  <Calendar size={14} />
                  <span className="hidden sm:inline">Google Calendar</span>
                  <span className="sm:hidden">GCal</span>
                </button>
                <span className="absolute -top-2 -right-2 bg-[var(--caramel)] text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full font-bold">
                  PREMIUM
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 md:gap-6 flex-wrap items-center">
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-[var(--espresso)]">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-md md:rounded-lg bg-[var(--sage)]" />
              <span>Dispo</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-[var(--espresso)]">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-md md:rounded-lg bg-[var(--caramel)]" />
              <span>Réservé</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-[var(--espresso)]">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-md md:rounded-lg bg-[var(--espresso)]" />
              <span>Validé</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-[var(--espresso)]">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-md md:rounded-lg bg-[var(--sand)]" />
              <span>Indispo</span>
            </div>
          </div>
        </div>

        {/* Barre d'actions multi-sélection */}
        {multiSelectMode && selectedSlots.length > 0 && (
          <div className="fixed bottom-4 md:bottom-6 left-2 right-2 md:left-1/2 md:right-auto md:-translate-x-1/2 bg-[var(--espresso)] text-white py-3 md:py-4 px-4 md:px-8 rounded-xl md:rounded-2xl shadow-2xl z-40 flex flex-col sm:flex-row items-center gap-3 md:gap-6">
            <span className="font-semibold text-sm md:text-base">{selectedSlots.length} créneau(x)</span>
            <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowMultiModal(true)}
                className="flex-1 sm:flex-none py-2 px-3 md:px-4 bg-[var(--sage)] rounded-full font-semibold text-xs md:text-sm hover:bg-[var(--sage)]/80 transition-all cursor-pointer border-none"
              >
                Appliquer
              </button>
              <button
                onClick={() => setSelectedSlots([])}
                className="flex-1 sm:flex-none py-2 px-3 md:px-4 bg-white/20 rounded-full font-semibold text-xs md:text-sm hover:bg-white/30 transition-all cursor-pointer border-none"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Créneaux programmés */}
        {(reserves > 0 || valides > 0) && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-3 md:p-4 mb-4 md:mb-6">
            <h3 className="font-semibold text-xs md:text-sm text-[var(--espresso)] mb-2 md:mb-3 flex items-center gap-2">
              <Calendar size={14} className="text-[var(--caramel)]" />
              Créneaux de la semaine ({reserves + valides})
            </h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {hours.map((hour) =>
                Array.from({ length: 7 }).map((_, dayIndex) => {
                  const cellDate = addDays(currentWeekStart, dayIndex)
                  const key = `${formatDateKey(cellDate)}-${hour}`
                  const slot = slots[key]

                  if (!slot || (slot.status !== 'reserve' && slot.status !== 'done')) return null

                  const dateStr = cellDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })

                  return (
                    <div
                      key={key}
                      className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 text-white rounded-lg text-[10px] md:text-xs font-semibold hover:shadow-md transition-all cursor-pointer ${
                        slot.status === 'done' ? 'bg-[var(--espresso)]' : 'bg-[#c29672]'
                      }`}
                      onClick={() => handleCellClick(key)}
                      title={`${slot.student_name || 'Élève'} - ${slot.notes || 'Cliquez pour gérer'}`}
                    >
                      <Clock size={10} className="md:w-3 md:h-3" />
                      <span className="hidden sm:inline">{dateStr} • </span>{hour}h
                      {slot.student_name && <span className="opacity-80 hidden md:inline">- {slot.student_name}</span>}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-xl md:rounded-3xl p-3 md:p-6 shadow-2xl overflow-x-auto -mx-2 md:mx-0">
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block w-12 h-12 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-[var(--espresso-light)] font-medium">Chargement de votre planning...</div>
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
                        ? 'bg-gradient-to-br from-[var(--caramel)] to-[var(--caramel)]/70 text-white' 
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

                    if (slot) {
                      if (slot.status === 'disponible') {
                        bgClass = 'bg-green-50 hover:bg-green-100'
                        content = (
                          <div className="bg-[var(--sage)] text-white py-2 px-2 rounded-xl text-xs font-bold text-center shadow-md">
                            Dispo
                          </div>
                        )
                      } else if (slot.status === 'indisponible') {
                        bgClass = 'bg-[var(--cream)] opacity-60'
                      } else if (slot.status === 'reserve') {
                        bgClass = 'bg-orange-50 hover:bg-orange-100'
                        content = (
                          <div className="bg-[var(--caramel)] text-white py-2 px-2 rounded-xl text-xs font-bold shadow-md text-center">
                            {slot.student_name || 'Réservé'}
                          </div>
                        )
                      } else if (slot.status === 'done') {
                        bgClass = 'bg-gray-50'
                        content = (
                          <div className="bg-[var(--espresso)] text-white py-2 px-2 rounded-xl text-xs font-bold shadow-md">
                            ✓ Validé
                          </div>
                        )
                      }
                    }

                    const isSelected = selectedSlots.includes(key)

                    return (
                      <div
                        key={key}
                        onClick={() => handleCellClick(key)}
                        className={`${bgClass} min-h-[60px] p-2 cursor-pointer hover:shadow-lg transition-all duration-200 relative ${
                          isSelected ? 'ring-2 ring-[var(--caramel)] ring-offset-2' : ''
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-[var(--caramel)] rounded-full flex items-center justify-center">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        )}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Gérer le créneau</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-2xl text-[var(--espresso-light)] hover:text-[var(--espresso)] bg-transparent border-none cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--cream)] transition-all"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-[var(--caramel)] to-[var(--caramel)]/70 rounded-2xl p-6 text-center mb-6 text-white shadow-lg">
              <div className="font-fraunces text-2xl font-bold mb-1">
                {modalSlot && (() => {
                  const [year, month, day] = modalSlot.split('-')
                  return `${day}/${month}/${year}`
                })()}
              </div>
              <div className="text-lg font-semibold opacity-90 flex items-center justify-center gap-2">
                <Clock size={18} />
                {modalSlot && modalSlot.split('-')[3]}h00
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleSaveSlot('disponible')}
                className="w-full py-4 bg-[var(--sage)] text-white rounded-2xl font-bold text-base hover:bg-[var(--sage)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Marquer disponible
              </button>
              
              {/* Bouton récurrence (Pro only) */}
              {isPro ? (
                <button
                  onClick={() => setShowRecurrenceModal(true)}
                  className="w-full py-4 bg-[var(--caramel)] text-white rounded-2xl font-bold text-base hover:bg-[var(--caramel)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  <Repeat size={20} />
                  Créer récurrence hebdo
                </button>
              ) : (
                <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold text-base text-center flex items-center justify-center gap-2 relative">
                  <Repeat size={20} />
                  Récurrence hebdo
                  <span className="absolute -top-2 -right-2 bg-[var(--sage)] text-white text-xs px-2 py-1 rounded-full">PRO</span>
                </div>
              )}

              {slots[modalSlot]?.id && (
                <button
                  onClick={handleDeleteSlot}
                  className="w-full py-4 bg-transparent text-red-600 rounded-2xl font-bold text-base border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <XCircle size={20} />
                  Supprimer le créneau
                </button>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-[var(--cream)] text-[var(--espresso)] rounded-2xl font-semibold text-base hover:bg-[var(--sand)] transition-all cursor-pointer border-none"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Multi-sélection */}
      {showMultiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Actions groupées</h2>
              <button
                onClick={() => setShowMultiModal(false)}
                className="text-2xl text-[var(--espresso-light)] hover:text-[var(--espresso)] bg-transparent border-none cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--cream)] transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-[var(--cream)] rounded-2xl p-4 mb-6 text-center">
              <span className="text-3xl font-fraunces font-bold text-[var(--espresso)]">{selectedSlots.length}</span>
              <p className="text-sm text-[var(--espresso-light)]">créneau(x) sélectionné(s)</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleMultiAction('disponible')}
                className="w-full py-4 bg-[var(--sage)] text-white rounded-2xl font-bold text-base hover:bg-[var(--sage)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Tous disponibles
              </button>

              <button
                onClick={() => handleMultiAction('indisponible')}
                className="w-full py-4 bg-[var(--sand)] text-[var(--espresso)] rounded-2xl font-bold text-base hover:bg-[var(--sand)]/80 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Tous indisponibles
              </button>

              {/* Bouton récurrence multi (Pro only) */}
              {isPro ? (
                <button
                  onClick={() => setShowMultiRecurrenceModal(true)}
                  className="w-full py-4 bg-[var(--caramel)] text-white rounded-2xl font-bold text-base hover:bg-[var(--caramel)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  <Repeat size={20} />
                  Récurrence hebdo pour tous
                </button>
              ) : (
                <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold text-base text-center flex items-center justify-center gap-2 relative">
                  <Repeat size={20} />
                  Récurrence hebdo
                  <span className="absolute -top-2 -right-2 bg-[var(--sage)] text-white text-xs px-2 py-1 rounded-full">PRO</span>
                </div>
              )}

              <button
                onClick={handleMultiDelete}
                className="w-full py-4 bg-transparent text-red-600 rounded-2xl font-bold text-base border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Supprimer tous
              </button>

              <button
                onClick={() => setShowMultiModal(false)}
                className="w-full py-4 bg-[var(--cream)] text-[var(--espresso)] rounded-2xl font-semibold text-base hover:bg-[var(--sand)] transition-all cursor-pointer border-none"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Récurrence (Pro) */}
      {showRecurrenceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-5">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Récurrence hebdo</h2>
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

            <div className="bg-gradient-to-br from-[var(--sage)] to-[var(--sage)]/70 rounded-2xl p-4 mb-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Repeat size={20} />
                <span className="font-semibold">Créer ce créneau chaque semaine</span>
              </div>
              <p className="text-sm opacity-90">
                Le créneau sera créé automatiquement chaque semaine jusqu'à la date de fin.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                Date de fin de récurrence
              </label>
              <input
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                min={modalSlot ? `${modalSlot.split('-')[0]}-${modalSlot.split('-')[1]}-${modalSlot.split('-')[2]}` : ''}
                className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleRecurringSlots('disponible')}
                disabled={!recurrenceEndDate}
                className="w-full py-4 bg-[var(--sage)] text-white rounded-2xl font-bold text-base hover:bg-[var(--sage)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={20} />
                Créer comme disponibles
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

      {/* Modal Récurrence Multi-sélection (Pro) */}
      {showMultiRecurrenceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-5">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Récurrence multiple</h2>
              <button
                onClick={() => {
                  setShowMultiRecurrenceModal(false)
                  setMultiRecurrenceEndDate('')
                }}
                className="text-2xl text-[var(--espresso-light)] hover:text-[var(--espresso)] bg-transparent border-none cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--cream)] transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-[var(--caramel)] to-[var(--caramel)]/70 rounded-2xl p-4 mb-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Repeat size={20} />
                <span className="font-semibold">{selectedSlots.length} créneau(x) sélectionné(s)</span>
              </div>
              <p className="text-sm opacity-90">
                Chaque créneau sera reproduit chaque semaine jusqu'à la date de fin.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                Date de fin de récurrence
              </label>
              <input
                type="date"
                value={multiRecurrenceEndDate}
                onChange={(e) => setMultiRecurrenceEndDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--caramel)] focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleMultiRecurringSlots('disponible')}
                disabled={!multiRecurrenceEndDate}
                className="w-full py-4 bg-[var(--sage)] text-white rounded-2xl font-bold text-base hover:bg-[var(--sage)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={20} />
                Créer tous comme disponibles
              </button>

              <button
                onClick={() => {
                  setShowMultiRecurrenceModal(false)
                  setMultiRecurrenceEndDate('')
                }}
                className="w-full py-4 bg-[var(--cream)] text-[var(--espresso)] rounded-2xl font-semibold text-base hover:bg-[var(--sand)] transition-all cursor-pointer border-none"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Google Calendar (Premium) */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Google Calendar</h2>
              <button
                onClick={() => {
                  setShowGoogleModal(false)
                  setSyncResult(null)
                }}
                className="text-2xl text-[var(--espresso-light)] hover:text-[var(--espresso)] bg-transparent border-none cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--cream)] transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Status de connexion */}
            <div className={`rounded-2xl p-4 mb-6 ${isGoogleConnected ? 'bg-green-50' : 'bg-[var(--cream)]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isGoogleConnected ? 'bg-green-500' : 'bg-gray-200'}`}>
                  {isGoogleConnected ? (
                    <CheckCircle className="text-white" size={24} />
                  ) : (
                    <Calendar className="text-gray-500" size={24} />
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${isGoogleConnected ? 'text-green-700' : 'text-[var(--espresso)]'}`}>
                    {isGoogleConnected ? 'Connecté à Google Calendar' : 'Non connecté'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isGoogleConnected
                      ? 'Vous pouvez synchroniser vos créneaux'
                      : 'Connectez-vous pour synchroniser vos créneaux'}
                  </p>
                </div>
              </div>
            </div>

            {/* Message d'erreur */}
            {googleError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">
                {googleError}
              </div>
            )}

            {/* Résultat de sync */}
            {syncResult && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mb-6 text-sm">
                <p className="font-semibold mb-1">Synchronisation terminée !</p>
                <p>{syncResult.success} créneau(x) ajouté(s) à Google Calendar</p>
                {syncResult.failed > 0 && (
                  <p className="text-red-600">{syncResult.failed} échec(s)</p>
                )}
              </div>
            )}

            {/* Avertissement si pas de Client ID */}
            {!hasGoogleClientId && (
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl mb-6 text-sm">
                <p className="font-semibold mb-1">Configuration requise</p>
                <p>L'intégration Google Calendar nécessite une configuration. Contactez l'administrateur.</p>
              </div>
            )}

            <div className="space-y-3">
              {!isGoogleConnected ? (
                <button
                  onClick={connectGoogle}
                  disabled={googleLoading || !hasGoogleClientId}
                  className="w-full py-4 bg-[#4285F4] text-white rounded-2xl font-bold text-base hover:bg-[#3367D6] hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ExternalLink size={20} />
                  )}
                  {googleLoading ? 'Connexion...' : 'Se connecter avec Google'}
                </button>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      try {
                        const result = await syncToGoogle(slots, currentWeekStart)
                        setSyncResult(result)
                      } catch (err) {
                        console.error('Erreur sync:', err)
                      }
                    }}
                    disabled={googleLoading}
                    className="w-full py-4 bg-[var(--sage)] text-white rounded-2xl font-bold text-base hover:bg-[var(--sage)]/90 hover:shadow-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {googleLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <RefreshCw size={20} />
                    )}
                    {googleLoading ? 'Synchronisation...' : 'Synchroniser la semaine'}
                  </button>

                  <button
                    onClick={disconnectGoogle}
                    className="w-full py-4 bg-transparent text-red-600 rounded-2xl font-bold text-base border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Unlink size={20} />
                    Déconnecter Google Calendar
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setShowGoogleModal(false)
                  setSyncResult(null)
                }}
                className="w-full py-4 bg-[var(--cream)] text-[var(--espresso)] rounded-2xl font-semibold text-base hover:bg-[var(--sand)] transition-all cursor-pointer border-none"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}