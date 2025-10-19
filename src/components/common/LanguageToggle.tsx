import { useLanguage } from '../../hooks/useLanguage'
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const { i18n } = useTranslation()
  const other = lang === 'vi' ? 'en' : 'vi'
  
  const handleLanguageChange = () => {
    setLang(other)
    i18n.changeLanguage(other)
  }
  
  return (
    <button
      aria-label="Toggle language"
      onClick={handleLanguageChange}
      className="h-10 w-10 rounded-xl neon-border bg-white/5 hover:bg-white/10 text-sm flex items-center justify-center"
    >
      {lang.toUpperCase()}
    </button>
  )
}

