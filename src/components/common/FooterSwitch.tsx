import { useLocation } from 'react-router-dom'
import Footer from './Footer'

export default function FooterSwitch() {
  const { pathname } = useLocation()
  const base = import.meta.env?.BASE_URL || '/'
  const normalizedBase = String(base).endsWith('/') ? String(base).slice(0, -1) : String(base)
  const normalizedPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  const isHome = normalizedPath === '/' || normalizedPath === normalizedBase || normalizedPath === ''
  // Hide footer on home and photobooth pages
  if (isHome || pathname === '/photobooth') return null
  return <Footer />
}
