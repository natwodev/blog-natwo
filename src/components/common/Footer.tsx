import { useLanguage } from '../../hooks/useLanguage'
import { usePageViewCounter } from '../../hooks/usePageViewCounter'

export default function Footer() {
  const { lang } = useLanguage()
  const { count, loading, error } = usePageViewCounter('blog-natwo', 'site')

  // Hiển thị count nếu có, không thì hiển thị "—"
  // Ưu tiên: count > loading state
  const displayCount = count ?? '—'
  
  // Debug trong development
  if (import.meta.env.DEV) {
    console.log('PageViewCounter:', { count, loading, error })
  }

  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between">
        <p className="text-white/60">© {new Date().getFullYear()} natwo developer</p>
        <div className="flex items-center gap-6 text-white/70">
          <div className="text-sm">
            {lang === 'vi' ? 'Lượt truy cập:' : 'Visits:'} {displayCount}
            {error && import.meta.env.DEV && (
              <span className="text-red-400 text-xs ml-2">({error})</span>
            )}
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/natwodev" target="_blank" rel="noreferrer" className="hover:text-brand-cyan inline-flex items-center gap-2">
              <span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.13-4.56-5 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.28 9.28 0 0 1 5 0c1.9-1.32 2.74-1.05 2.74-1.05.56 1.41.21 2.45.11 2.71.64.72 1.03 1.63 1.03 2.74 0 3.88-2.34 4.73-4.57 4.98.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z"/></svg>
              </span>
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/nguy%E1%BB%85n-hu%E1%BB%B3nh-nam-b8b87938a/" target="_blank" rel="noreferrer" className="hover:text-brand-cyan inline-flex items-center gap-2">
              <span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.94 6.5A2.44 2.44 0 1 1 4.5 4.06 2.44 2.44 0 0 1 6.94 6.5ZM5 8.75h3.88V20H5Zm6.25 0h3.72v1.53h.05a4.08 4.08 0 0 1 3.67-2.02c3.93 0 4.65 2.59 4.65 5.96V20h-3.88v-4.7c0-1.12 0-2.55-1.56-2.55s-1.8 1.22-1.8 2.47V20H11.2Z"/></svg>
              </span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
