import { useEffect, useRef } from 'react'

export function usePageVisibility(onVisible) {
  const callbackRef = useRef(onVisible)

  // Toujours garder la dernière version du callback
  useEffect(() => {
    callbackRef.current = onVisible
  }, [onVisible])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        callbackRef.current?.()
      }
    }

    const handleFocus = () => {
      callbackRef.current?.()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, []) // Pas de dépendance - les listeners sont créés une seule fois
}