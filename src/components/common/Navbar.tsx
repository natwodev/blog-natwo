import { useState } from 'react'
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
