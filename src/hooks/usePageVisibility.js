import { useEffect, useRef } from 'react'

/**
 * Hook pour rafraîchir les données automatiquement
 * @param {Function} onVisible - Callback à exécuter lors du refresh
 * @param {Object} options - Options de configuration
 * @param {number} options.pollingInterval - Intervalle de polling en ms (défaut: 30000 = 30s)
 * @param {boolean} options.enablePolling - Activer le polling automatique (défaut: true)
 */
export function usePageVisibility(onVisible, options = {}) {
  const {
    pollingInterval = 30000, // 30 secondes par défaut
    enablePolling = true
  } = options

  const callbackRef = useRef(onVisible)
  const lastRefreshRef = useRef(Date.now())

  // Toujours garder la dernière version du callback
  useEffect(() => {
    callbackRef.current = onVisible
  }, [onVisible])

  // Visibility change + Focus handlers
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Éviter les doubles appels rapprochés
        const now = Date.now()
        if (now - lastRefreshRef.current > 1000) {
          lastRefreshRef.current = now
          console.log('🔄 Page visible - refresh données')
          callbackRef.current?.()
        }
      }
    }

    const handleFocus = () => {
      // Éviter les doubles appels avec visibilitychange
      const now = Date.now()
      if (now - lastRefreshRef.current > 2000) {
        lastRefreshRef.current = now
        console.log('🔄 Focus window - refresh données')
        callbackRef.current?.()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Polling automatique
  useEffect(() => {
    if (!enablePolling) return

    const interval = setInterval(() => {
      // Ne faire le polling que si la page est visible
      if (document.visibilityState === 'visible') {
        console.log('🔄 Polling auto - refresh données')
        lastRefreshRef.current = Date.now()
        callbackRef.current?.()
      }
    }, pollingInterval)

    return () => clearInterval(interval)
  }, [pollingInterval, enablePolling])
}