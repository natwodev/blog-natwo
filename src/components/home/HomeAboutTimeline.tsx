import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useCountUp } from '../../hooks/useCountUp'

const items = [
  {
    id: 'avatar',
    side: 'left' as const,
    title: 'Xin chào! Mình là',
    name: 'Nguyễn Huỳnh Nam',
    role: 'Developer – Java & JavaScript',
    desc: 'Đam mê lập trình mạng, UI hiện đại và 3D nhẹ.',
    counters: { projects: 12, posts: 24 },
  },
  {
    id: 'work',
    side: 'right' as const,
    title: 'Công việc / Học tập',
    desc: 'Tập trung vào Java Networking, React/Three.js và tối ưu UX/UI.',
  },
  {
    id: 'goal',
    side: 'left' as const,
    title: 'Mục tiêu',
    desc: 'Xây dựng blog chia sẻ kiến thức, portfolio chuyên nghiệp và đóng góp cộng đồng.',
  },
  {
    id: 'contact',
    side: 'right' as const,
    title: 'Liên hệ',
    desc: 'Mở hợp tác/trao đổi học thuật. GitHub, LinkedIn, Email.',
  },
]

export default function HomeAboutTimeline() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const rows = useMemo(() => {
    const pairs: { left?: typeof items[number]; right?: typeof items[number] }[] = []
    for (let i = 0; i < items.length; i += 2) {
      pairs.push({ left: items[i], right: items[i + 1] })
    }
    return pairs
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-2xl md:text-3xl font-poppins font-semibold">Giới thiệu</motion.h2>

      <div className="mt-10 relative">
        <motion.div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-[3px] bg-gradient-to-b from-brand-cyan/60 to-brand-purple/60"
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />

        <div className="space-y-12">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="md:grid md:grid-cols-2 md:gap-10 items-start">
              {/* Left card */}
              <motion.div
                initial={{ opacity: 0, x: -50, y: 18 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, delay: rowIdx * 0.05 }}
                className="relative md:pr-10"
              >
                {row.left && (
                  <AboutCard
                    side="left"
                    item={row.left}
                    active={activeId === row.left.id}
                    onClick={() => setActiveId(activeId === row.left!.id ? null : row.left!.id)}
                  />
                )}
              </motion.div>

              {/* Right card */}
              <motion.div
                initial={{ opacity: 0, x: 50, y: 18 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, delay: 0.08 + rowIdx * 0.05 }}
                className="relative md:pl-10 mt-10 md:mt-0"
              >
                {row.right && (
                  <AboutCard
                    side="right"
                    item={row.right}
                    active={activeId === row.right.id}
                    onClick={() => setActiveId(activeId === row.right!.id ? null : row.right!.id)}
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutCard({ side, item, active, onClick }: { side: 'left' | 'right'; item: typeof items[number]; active: boolean; onClick: () => void }) {
  const dotSideClass = side === 'left' ? 'right' : 'left'
  const dotColor = side === 'left' ? 'bg-brand-cyan' : 'bg-brand-purple'
  const isAvatar = !!item.counters
  const projects = useCountUp(item.counters?.projects ?? 0, 1000, active || true)
  const posts = useCountUp(item.counters?.posts ?? 0, 1200, active || true)

  const hoverScale = isAvatar ? 1.07 : 1.03
  const paddingClass = isAvatar ? 'p-6 md:p-7' : 'p-5'
  const nameClass = isAvatar ? 'text-2xl md:text-3xl font-semibold' : 'text-xl font-semibold'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.98 }}
      animate={{ scale: active ? 1.08 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className={`group relative w-full text-left rounded-2xl ${paddingClass} bg-white/6 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_10px_40px_rgba(0,201,167,0.18)]`}
    >
      {/* dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className={`hidden md:block absolute -${dotSideClass}-[10px] top-3 w-4 h-4 rounded-full ${dotColor} shadow-[0_0_22px_rgba(0,201,167,0.7)]`}
      />

      <div className="flex items-start gap-5">
        {!isAvatar && (
          <div className="mt-1 shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/30 to-brand-purple/30 border border-white/10 grid place-items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
        )}
        <div>
          {item.name ? (
            <>
              <div className="text-white/70 text-sm group-hover:text-white/80 transition-colors">{item.title}</div>
              <div className={nameClass}>{item.name}</div>
              <motion.div initial={{ opacity: 0.85 }} animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 3.6, repeat: Infinity }} className="inline-block mt-1 px-2 py-0.5 text-xs md:text-sm rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan/90 group-hover:bg-brand-cyan/15 group-hover:border-brand-cyan/40">
                {item.role}
              </motion.div>
            </>
          ) : (
            <div className="text-lg font-semibold">{item.title}</div>
          )}
          <p className="mt-2 text-white/75 leading-relaxed group-hover:text-white/85 transition-colors">{item.desc}</p>

          {isAvatar && (
            <div className="mt-4 flex gap-6 text-sm text-white/80">
              <div className="flex items-baseline gap-1"><span className="text-2xl md:text-3xl font-semibold text-brand-cyan">{projects}</span><span>Projects</span></div>
              <div className="flex items-baseline gap-1"><span className="text-2xl md:text-3xl font-semibold text-brand-cyan">{posts}</span><span>Posts</span></div>
            </div>
          )}
        </div>
      </div>

      {/* hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-brand-cyan/0 group-hover:ring-2 group-hover:ring-brand-cyan/70 transition" />
    </motion.button>
  )
}
