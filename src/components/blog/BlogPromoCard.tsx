import type { PostIndex } from '../../data/posts.index'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TagChip from '../common/TagChip'

export default function BlogPromoCard({ post, index }: { readonly post: PostIndex; readonly index: number }) {
  const Wrapper: React.ElementType = Link
  const wrapperProps = { to: `/blog/${post.id}` }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/7 transition"
    >
      <Wrapper {...wrapperProps} className="block relative h-full">
        {/* Media */}
        <div className="aspect-[16/9] w-full overflow-hidden">
          {post.image ? (
            <img src={post.image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-95" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-cyan/15 to-brand-purple/15" />
          )}
        </div>
        {/* Content */}
          <div className="p-4 md:p-5 flex flex-col h-full">
          <div className="flex flex-wrap items-center gap-2">
            <TagChip label={new Date(post.date).toLocaleDateString()} />
            {post.tags.map(t => (
              <TagChip key={t} label={t} />
            ))}
          </div>
          <h3 className="mt-2 text-lg md:text-xl font-semibold leading-snug">
            <span className="bg-gradient-to-r from-white to-white/85 bg-clip-text text-transparent">
              {post.title}
            </span>
          </h3>
          <p className="mt-1.5 text-white/75 text-sm md:text-[15px] leading-relaxed line-clamp-3">{post.excerpt}</p>
          <div className="mt-auto" />
        </div>
        {/* Hover & ring accent */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="absolute inset-0 ring-1 ring-brand-cyan/35 rounded-2xl" />
          <div className="absolute -inset-x-10 -bottom-10 h-40 blur-2xl bg-gradient-to-r from-brand-cyan/18 to-brand-purple/18" />
        </div>
      </Wrapper>
    </motion.div>
  )
}
