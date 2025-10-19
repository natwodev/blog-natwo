import { postsIndex } from '../data/posts.index'
import BlogPromoCard from '../components/blog/BlogPromoCard'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BlogFilter from '../components/blog/BlogFilter'
import { useTypingEffect } from '../hooks/useTypingEffect'

export default function Blog() {
  const { t } = useTranslation()
  const tags = useMemo(() => Array.from(new Set(postsIndex.flatMap(p => p.tags))), [])
  const [active, setActive] = useState('All')
  const [query, setQuery] = useState('')
  const visible = useMemo(() => {
    const base = active === 'All' ? postsIndex : postsIndex.filter(p => p.tags.includes(active))
    const filtered = query.trim()
      ? base.filter(p =>
          [p.title, p.excerpt, ...(p.tags || [])]
            .join(' ') // simple search in fields
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      : base
    return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [active, query])

  const typedHeader = useTypingEffect(`${t('blog.title')} — ${t('blog.subtitle')}`, 40)

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 -top-16 h-40 blur-2xl bg-gradient-to-r from-brand-cyan/20 to-brand-purple/20" />
        <div className="max-w-6xl mx-auto px-6 py-16 relative">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-7xl font-poppins font-semibold">
            <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">{typedHeader || ' '}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-3 text-white/75 max-w-3xl">
            {t('blog.description')}
          </motion.p>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <BlogFilter tags={tags} active={active} onChange={setActive} />
            <div className="relative w-full md:w-80">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('blog.searchPlaceholder')}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-brand-cyan/50"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">✕</button>
              )}
            </div>
          </div>
          <div className="mt-3 text-white/60 text-sm">{visible.length} {t('blog.postsCount')}</div>
        </div>
      </section>

      {/* Media grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7 auto-rows-fr">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.4 }}>
                <BlogPromoCard post={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
          {visible.length === 0 && (
            <div className="col-span-full text-center text-white/70 py-16">{t('blog.noPosts')}</div>
          )}
        </div>
      </section>
    </div>
  )
}
