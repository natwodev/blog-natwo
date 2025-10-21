import { javaResources, jsResources, csharpResources, flutterResources } from '../../data/resources'
import { motion } from 'framer-motion'

export default function ResourceLinks() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-2xl font-poppins font-semibold">Tài liệu & Bài viết hay</motion.h2>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-brand-cyan mb-4">Java</h3>
          <ul className="space-y-3 flex-1">
            {javaResources.map((r, i) => (
              <motion.li key={r.url} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.03 }}>
                <a href={r.url} target="_blank" rel="noreferrer" className="group block">
                  <div className="flex items-start gap-2">
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan flex-shrink-0 mt-0.5">{r.source ?? 'Link'}</span>
                    <span className="text-white/85 hover:text-white underline decoration-transparent group-hover:decoration-brand-cyan transition-[text-decoration-color] duration-300 text-sm leading-relaxed">{r.title}</span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-brand-cyan mb-4">JavaScript</h3>
          <ul className="space-y-3 flex-1">
            {jsResources.map((r, i) => (
              <motion.li key={r.url} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.03 }}>
                <a href={r.url} target="_blank" rel="noreferrer" className="group block">
                  <div className="flex items-start gap-2">
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan flex-shrink-0 mt-0.5">{r.source ?? 'Link'}</span>
                    <span className="text-white/85 hover:text-white underline decoration-transparent group-hover:decoration-brand-cyan transition-[text-decoration-color] duration-300 text-sm leading-relaxed">{r.title}</span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-brand-cyan mb-4">C#</h3>
          <ul className="space-y-3 flex-1">
            {csharpResources.map((r, i) => (
              <motion.li key={r.url} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.03 }}>
                <a href={r.url} target="_blank" rel="noreferrer" className="group block">
                  <div className="flex items-start gap-2">
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan flex-shrink-0 mt-0.5">{r.source ?? 'Link'}</span>
                    <span className="text-white/85 hover:text-white underline decoration-transparent group-hover:decoration-brand-cyan transition-[text-decoration-color] duration-300 text-sm leading-relaxed">{r.title}</span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-brand-cyan mb-4">Flutter</h3>
          <ul className="space-y-3 flex-1">
            {flutterResources.map((r, i) => (
              <motion.li key={r.url} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.03 }}>
                <a href={r.url} target="_blank" rel="noreferrer" className="group block">
                  <div className="flex items-start gap-2">
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan flex-shrink-0 mt-0.5">{r.source ?? 'Link'}</span>
                    <span className="text-white/85 hover:text-white underline decoration-transparent group-hover:decoration-brand-cyan transition-[text-decoration-color] duration-300 text-sm leading-relaxed">{r.title}</span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

