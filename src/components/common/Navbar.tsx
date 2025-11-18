import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'
import AudioToggle from './AudioToggle'
import { useLanguage } from '../../hooks/useLanguage'

export default function Navbar() {
  const { lang } = useLanguage()
  const t = (vi: string, en: string) => (lang === 'vi' ? vi : en)
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg hover:bg-white/10 transition ${isActive ? 'text-brand-cyan' : 'text-white/80'}`

  const [isOpen, setIsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false)
      }
    }

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMoreOpen])

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/30 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-poppins text-lg">natwodev</Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navClass} end>{t('Trang chủ', 'Home')}</NavLink>
          <NavLink to="/blog" className={navClass}>{t('Blog', 'Blog')}</NavLink>
          <NavLink to="/projects" className={navClass}>{t('Dự án', 'Projects')}</NavLink>
          <NavLink to="/about" className={navClass}>{t('Giới thiệu', 'About')}</NavLink>
          <NavLink to="/contact" className={navClass}>{t('Liên hệ', 'Contact')}</NavLink>
          
          {/* More dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`px-3 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-1 ${
                isMoreOpen ? 'text-brand-cyan' : 'text-white/80'
              }`}
            >
              <span>{t('Thêm', 'More')}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isMoreOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg overflow-hidden z-50">
                <NavLink
                  to="/quiz"
                  onClick={() => setIsMoreOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 hover:bg-white/10 transition ${
                      isActive ? 'text-brand-cyan' : 'text-white/80'
                    }`
                  }
                >
                  {t('Thi trắc nghiệm', 'Quiz')}
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <AudioToggle
              src={new URL('../../audio/hachimi.mp3', import.meta.url).href}
              size="sm"
              showLabel={false}
            />
          </div>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-cyan/60"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 items-center">
            <NavLink onClick={() => setIsOpen(false)} to="/" className={navClass} end>{t('Trang chủ', 'Home')}</NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/blog" className={navClass}>{t('Blog', 'Blog')}</NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/projects" className={navClass}>{t('Dự án', 'Projects')}</NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/about" className={navClass}>{t('Giới thiệu', 'About')}</NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/contact" className={navClass}>{t('Liên hệ', 'Contact')}</NavLink>
            
            {/* More section in mobile */}
            <div className="w-full pt-2 mt-2 border-t border-white/10">
              <div className="text-white/60 text-sm px-3 py-2 mb-1">{t('Thêm', 'More')}</div>
              <NavLink onClick={() => setIsOpen(false)} to="/quiz" className={navClass}>{t('Thi trắc nghiệm', 'Quiz')}</NavLink>
            </div>
            
            {/* Mobile controls */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-3">
              <LanguageToggle />
              <AudioToggle
                src={new URL('../../audio/hachimi.mp3', import.meta.url).href}
                size="sm"
                showLabel={false}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
