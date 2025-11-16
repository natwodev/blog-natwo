import { useEffect, useState } from 'react'

type CounterState = {
  count: number | null
  loading: boolean
  error: string | null
}

/**
 * Tracks and displays page views using server API.
 * Increments the count on the server only once per browser session.
 */
export function usePageViewCounter(namespace: string, key: string) {
  const [state, setState] = useState<CounterState>({ count: null, loading: true, error: null })

  useEffect(() => {
    let aborted = false
    const sessionKey = `pv:${namespace}:${key}`
    
    // API base URL - có thể cấu hình qua environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

    async function fetchViews() {
      const response = await fetch(`${API_BASE_URL}/api/views`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = (await response.json()) as { count?: number }
      return data.count ?? null
    }

    async function incrementViews() {
      const response = await fetch(`${API_BASE_URL}/api/views/hit`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = (await response.json()) as { count?: number }
      return data.count ?? null
    }

    async function run() {
      try {
        // Kiểm tra xem đã tăng lượt truy cập trong session này chưa
        const hasCounted = sessionStorage.getItem(sessionKey) === '1'
        
        if (hasCounted) {
          // Đã tăng rồi, chỉ lấy lượt truy cập hiện tại
          const currentCount = await fetchViews()
          if (!aborted) {
            setState({ count: currentCount, loading: false, error: null })
          }
          return
        }
        
        // Tăng lượt truy cập trên server
        const newCount = await incrementViews()
        
        if (!aborted) {
          // Đánh dấu đã tăng lượt truy cập trong session này
          sessionStorage.setItem(sessionKey, '1')
          setState({ count: newCount, loading: false, error: null })
        }
      } catch (e: unknown) {
        if (!aborted) {
          const message = e instanceof Error ? e.message : 'Unknown error'
          console.error('Error fetching page views:', message)
          setState({ count: null, loading: false, error: message })
        }
      }
    }

    run()
    
    return () => {
      aborted = true
    }
  }, [namespace, key])

  return state
}


