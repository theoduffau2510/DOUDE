import { useState, useEffect, useCallback } from 'react'

// Configuration Google Calendar API
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const SCOPES = 'https://www.googleapis.com/auth/calendar.events'

export function useGoogleCalendar() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accessToken, setAccessToken] = useState(null)
  const [error, setError] = useState(null)

  // Vérifier si déjà connecté au chargement
  useEffect(() => {
    const savedToken = localStorage.getItem('google_calendar_token')
    const tokenExpiry = localStorage.getItem('google_calendar_token_expiry')

    if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      setAccessToken(savedToken)
      setIsConnected(true)
    } else {
      // Token expiré, nettoyer
      localStorage.removeItem('google_calendar_token')
      localStorage.removeItem('google_calendar_token_expiry')
    }
  }, [])

  // Charger le script Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Nettoyer le script si le composant est démonté
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  // Connexion à Google Calendar
  const connect = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Configuration Google Calendar manquante. Contactez l\'administrateur.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            setError('Erreur de connexion à Google Calendar')
            setIsLoading(false)
            return
          }

          // Sauvegarder le token
          const expiresIn = response.expires_in * 1000 // Convertir en ms
          localStorage.setItem('google_calendar_token', response.access_token)
          localStorage.setItem('google_calendar_token_expiry', (Date.now() + expiresIn).toString())

          setAccessToken(response.access_token)
          setIsConnected(true)
          setIsLoading(false)
        },
      })

      client.requestAccessToken()
    } catch (err) {
      console.error('Erreur Google OAuth:', err)
      setError('Impossible d\'initialiser la connexion Google')
      setIsLoading(false)
    }
  }, [])

  // Déconnexion
  const disconnect = useCallback(() => {
    localStorage.removeItem('google_calendar_token')
    localStorage.removeItem('google_calendar_token_expiry')
    setAccessToken(null)
    setIsConnected(false)
  }, [])

  // Créer un événement dans Google Calendar
  const createEvent = useCallback(async (event) => {
    if (!accessToken) {
      throw new Error('Non connecté à Google Calendar')
    }

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Erreur lors de la création de l\'événement')
    }

    return response.json()
  }, [accessToken])

  // Synchroniser les créneaux vers Google Calendar
  const syncSlots = useCallback(async (slots, weekStart) => {
    if (!accessToken) {
      throw new Error('Non connecté à Google Calendar')
    }

    setIsLoading(true)
    setError(null)

    const results = { success: 0, failed: 0 }

    try {
      for (const [key, slot] of Object.entries(slots)) {
        // Ne synchroniser que les créneaux réservés ou disponibles
        if (slot.status !== 'reserve' && slot.status !== 'disponible') continue

        const [year, month, day, hour] = key.split('-')
        const slotDate = new Date(`${year}-${month}-${day}T${hour.padStart(2, '0')}:00:00`)
        const endDate = new Date(slotDate.getTime() + 60 * 60 * 1000) // +1 heure

        const event = {
          summary: slot.status === 'reserve'
            ? `📚 Cours avec ${slot.student_name || 'Élève'}`
            : '✅ Créneau disponible',
          description: slot.notes || (slot.status === 'reserve'
            ? 'Cours réservé via Doude'
            : 'Créneau disponible pour réservation'),
          start: {
            dateTime: slotDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          colorId: slot.status === 'reserve' ? '6' : '10', // Orange pour réservé, vert pour disponible
        }

        try {
          await createEvent(event)
          results.success++
        } catch (err) {
          console.error('Erreur création événement:', err)
          results.failed++
        }
      }

      return results
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, createEvent])

  // Exporter un seul créneau vers Google Calendar
  const exportSlot = useCallback(async (slotKey, slot) => {
    if (!accessToken) {
      throw new Error('Non connecté à Google Calendar')
    }

    const [year, month, day, hour] = slotKey.split('-')
    const slotDate = new Date(`${year}-${month}-${day}T${hour.padStart(2, '0')}:00:00`)
    const endDate = new Date(slotDate.getTime() + 60 * 60 * 1000) // +1 heure

    const event = {
      summary: slot.status === 'reserve'
        ? `📚 Cours avec ${slot.student_name || 'Élève'}`
        : slot.status === 'done'
        ? `✓ Cours terminé - ${slot.student_name || 'Élève'}`
        : '✅ Créneau disponible',
      description: slot.notes || 'Synchronisé depuis Doude',
      start: {
        dateTime: slotDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      colorId: slot.status === 'reserve' ? '6' : slot.status === 'done' ? '8' : '10',
    }

    return createEvent(event)
  }, [accessToken, createEvent])

  return {
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    syncSlots,
    exportSlot,
    hasGoogleClientId: !!GOOGLE_CLIENT_ID,
  }
}
