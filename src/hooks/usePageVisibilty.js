import { useEffect } from 'react'

export function usePageVisibility(onVisible) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        onVisible()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', onVisible)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', onVisible)
    }
  }, [onVisible])
}