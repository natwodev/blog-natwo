import { useEffect, useState } from 'react'

type CounterState = {
  count: number | null
  loading: boolean
  error: string | null
}

/**
 * Tracks and displays page views using sessionStorage.
 * Increments the count each time the page is visited in the current session.
 */
export function usePageViewCounter(namespace: string, key: string) {
  const [state, setState] = useState<CounterState>({ count: null, loading: true, error: null })

  useEffect(() => {
    try {
      const sessionKey = `pv:${namespace}:${key}`
      
      // Get current count from sessionStorage
      const storedCount = sessionStorage.getItem(sessionKey)
      let currentCount = storedCount ? Number.parseInt(storedCount, 10) : 0
      
      // Increment the count
      currentCount += 1
      
      // Save back to sessionStorage
      sessionStorage.setItem(sessionKey, currentCount.toString())
      
      // Update state
      setState({ count: currentCount, loading: false, error: null })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      setState({ count: null, loading: false, error: message })
    }
  }, [namespace, key])

  return state
}


