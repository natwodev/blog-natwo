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
  const sessionKey = `pv:${namespace}:${key}`
  const cacheKey = `pv:cache:${namespace}:${key}`
  
  // Lấy count từ cache nếu có (để hiển thị ngay) - chỉ gọi một lần khi init
  const getInitialCachedCount = (): number | null => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const parsed = Number.parseInt(cached, 10)
        if (!Number.isNaN(parsed)) return parsed
      }
    } catch {
      // Ignore localStorage errors
    }
    return null
  }
  
  const [state, setState] = useState<CounterState>({ 
    count: getInitialCachedCount(), // Hiển thị cached count ngay lập tức
    loading: true, 
    error: null 
  })

  useEffect(() => {
    let aborted = false
    
    // Lấy count từ cache nếu có
    const getCachedCount = (): number | null => {
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = Number.parseInt(cached, 10)
          if (!Number.isNaN(parsed)) return parsed
        }
      } catch {
        // Ignore localStorage errors
      }
      return null
    }
    
    // Lưu count vào cache
    const setCachedCount = (count: number) => {
      try {
        localStorage.setItem(cacheKey, count.toString())
      } catch {
        // Ignore localStorage errors
      }
    }
    
    // API base URL - có thể cấu hình qua environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

    // Helper function với timeout và retry
    async function fetchWithTimeout(url: string, options: RequestInit, timeout = 5000, retries = 2): Promise<Response> {
      for (let i = 0; i <= retries; i++) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), timeout)
          
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          })
          
          clearTimeout(timeoutId)
          return response
        } catch (error) {
          if (i === retries) throw error
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
      throw new Error('Max retries exceeded')
    }

    async function fetchViews() {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/views`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        5000, // 5 second timeout
        2     // 2 retries
      )
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = (await response.json()) as { count?: number }
      return data.count ?? null
    }

    async function incrementViews() {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/views/hit`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        5000, // 5 second timeout
        2     // 2 retries
      )
      
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
            if (currentCount !== null) {
              setCachedCount(currentCount)
            }
            setState({ count: currentCount ?? getCachedCount(), loading: false, error: null })
          }
          return
        }
        
        // Tăng lượt truy cập trên server
        const newCount = await incrementViews()
        
        if (!aborted) {
          // Đánh dấu đã tăng lượt truy cập trong session này
          sessionStorage.setItem(sessionKey, '1')
          if (newCount !== null) {
            setCachedCount(newCount)
          }
          setState({ count: newCount ?? getCachedCount(), loading: false, error: null })
        }
      } catch (e: unknown) {
        if (!aborted) {
          const message = e instanceof Error ? e.message : 'Unknown error'
          console.error('Error fetching page views:', message)
          
          // Luôn thử dùng cached count nếu có
          const cachedCount = getCachedCount()
          
          // Nếu đã có count trong sessionStorage từ lần trước, thử lấy lại
          const hasCounted = sessionStorage.getItem(sessionKey) === '1'
          if (hasCounted) {
            // Thử fetch lại một lần nữa
            try {
              const currentCount = await fetchViews()
              if (!aborted) {
                if (currentCount !== null) {
                  setCachedCount(currentCount)
                }
                setState({ count: currentCount ?? cachedCount, loading: false, error: null })
                return
              }
            } catch {
              // Nếu vẫn lỗi, dùng cached count nếu có
              setState({ 
                count: cachedCount, 
                loading: false, 
                error: cachedCount ? null : message // Chỉ hiển thị error nếu không có cache
              })
            }
          } else {
            // Dùng cached count nếu có, không thì hiển thị error
            setState({ 
              count: cachedCount, 
              loading: false, 
              error: cachedCount ? null : message 
            })
          }
        }
      }
    }

    run()
    
    return () => {
      aborted = true
    }
  }, [namespace, key, sessionKey, cacheKey])

  return state
}


