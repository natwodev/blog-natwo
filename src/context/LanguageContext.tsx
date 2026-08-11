import { useMemo, useState } from 'react';
import type { ReactNode } from 'react'
import { LanguageContext, type Lang } from './LanguageContextValue'

export function LanguageProvider({ children }: { readonly children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    // Chỉ lấy phần ngôn ngữ chính (en-US -> en) và giới hạn ở vi/en
    const saved = localStorage.getItem('cj-lang')?.slice(0, 2).toLowerCase()
    return saved === 'en' ? 'en' : 'vi'
  })

  const value = useMemo(() => ({ lang, setLang: (l: Lang) => {
    localStorage.setItem('cj-lang', l)
    setLang(l)
  }}), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}


