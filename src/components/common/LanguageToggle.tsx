import { useLanguage } from '../../hooks/useLanguage'
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const { i18n } = useTranslation()
  const other = lang === 'vi' ? 'en' : 'vi'
  // Mã 2 ký tự của ngôn ngữ đang dùng (vi-VN/en-US -> VI/EN)
  const current = (lang.slice(0, 2) || 'vi').toUpperCase()

  const handleLanguageChange = () => {
    setLang(other)
    i18n.changeLanguage(other)
  }

  return (
    <button
      aria-label={`Ngôn ngữ: ${current}. Chuyển sang ${other.toUpperCase()}`}
      title={`Ngôn ngữ: ${current} — bấm để chuyển sang ${other.toUpperCase()}`}
      onClick={handleLanguageChange}
      className="h-10 w-10 rounded-xl neon-border bg-white/5 hover:bg-white/10 text-sm font-semibold leading-none whitespace-nowrap flex items-center justify-center"
    >
      {current}
    </button>
  )
}

