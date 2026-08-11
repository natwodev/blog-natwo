import { useEffect, useState } from 'react'
import { readVisitCount, incrementVisitCount } from '../lib/visitCounter'

type CounterState = {
  count: number | null
  loading: boolean
  error: string | null
}

/**
 * Đếm & hiển thị lượt truy cập bằng Firestore (project 'tracnghiem-visits').
 * Mỗi phiên trình duyệt chỉ tăng một lần; hiển thị ngay số đã cache rồi đồng bộ với server.
 */
export function usePageViewCounter(namespace: string, key: string) {
  const sessionKey = `pv:${namespace}:${key}`
  const cacheKey = `pv:cache:${namespace}:${key}`
  const docId = `${namespace}_${key}`

  const getCachedCount = (): number | null => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const parsed = Number.parseInt(cached, 10)
        if (!Number.isNaN(parsed)) return parsed
      }
    } catch {
      // Bỏ qua lỗi localStorage (chế độ riêng tư…)
    }
    return null
  }

  const setCachedCount = (count: number) => {
    try {
      localStorage.setItem(cacheKey, count.toString())
    } catch {
      // Bỏ qua lỗi localStorage
    }
  }

  const [state, setState] = useState<CounterState>({
    count: getCachedCount(), // hiện số cache ngay lập tức
    loading: true,
    error: null,
  })

  useEffect(() => {
    let aborted = false

    async function run() {
      try {
        const hasCounted = sessionStorage.getItem(sessionKey) === '1'
        // Phiên này đã tăng rồi → chỉ đọc; chưa → tăng 1 lần.
        const count = hasCounted
          ? await readVisitCount(docId)
          : await incrementVisitCount(docId)

        if (aborted) return

        if (!hasCounted && count !== null) {
          sessionStorage.setItem(sessionKey, '1')
        }
        if (count !== null) {
          setCachedCount(count)
          setState({ count, loading: false, error: null })
        } else {
          // Firebase chưa sẵn sàng → dùng số cache nếu có
          const cached = getCachedCount()
          setState({ count: cached, loading: false, error: cached === null ? 'unavailable' : null })
        }
      } catch (e: unknown) {
        if (aborted) return
        const message = e instanceof Error ? e.message : 'Unknown error'
        console.error('Lỗi đếm lượt truy cập:', message)
        const cached = getCachedCount()
        setState({ count: cached, loading: false, error: cached === null ? message : null })
      }
    }

    run()
    return () => {
      aborted = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, key])

  return state
}
