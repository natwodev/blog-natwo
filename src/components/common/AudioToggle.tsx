import { useEffect, useMemo, useState } from 'react'
import { getGlobalAudio } from '../../audio/globalAudio'

export default function AudioToggle({ src, size = 'md', showLabel = true }: { readonly src: string; readonly size?: 'sm' | 'md'; readonly showLabel?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const classes = useMemo(() => {
    if (!showLabel) {
      return size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'
    }
    return size === 'sm' ? 'h-10 px-4 text-sm' : 'h-11 px-5'
  }, [size, showLabel])

  useEffect(() => {
    const a = getGlobalAudio(src, 0.4, false)
    if (!a) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    setIsPlaying(!a.paused)

    return () => {
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
    }
  }, [src])

  function toggle() {
    const a = getGlobalAudio(src, 0.4, false)
    if (!a) return
    if (a.paused) {
      a.play().catch(() => {})
    } else {
      a.pause()
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded-xl neon-border bg-white/5 hover:bg-white/10 transition inline-flex items-center justify-center gap-2 ${classes}`}
      aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
    >
      {isPlaying ? (
        // Speaker with sound waves (on)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10v4a1 1 0 001 1h3l4.243 3.182A1 1 0 0013 17.382V6.618a1 1 0 00-1.757-.8L7 9H4a1 1 0 00-1 1z"/>
          <path d="M16.5 8.5a1 1 0 011.414 0A5 5 0 0119 12a5 5 0 01-1.086 3.5 1 1 0 11-1.528-1.28c.4-.477.614-1.317.614-2.22 0-.903-.214-1.743-.614-2.22a1 1 0 010-1.28z"/>
          <path d="M19.5 6.5a1 1 0 011.414 0A8 8 0 0122 12a8 8 0 01-1.086 5.5 1 1 0 11-1.528-1.28C19.86 15.47 20 13.83 20 12c0-1.83-.14-3.47-.614-4.22a1 1 0 010-1.28z"/>
        </svg>
      ) : (
        // Muted speaker (off) - Clean design
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10v4a1 1 0 001 1h3l4.243 3.182A1 1 0 0013 17.382V6.618a1 1 0 00-1.757-.8L7 9H4a1 1 0 00-1 1z"/>
          <path d="M16 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )}
      {showLabel && (
        <span className="text-sm md:text-base">{isPlaying ? 'Tắt nhạc' : 'Mở nhạc'}</span>
      )}
    </button>
  )
}


