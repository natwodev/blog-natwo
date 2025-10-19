import type { PostIndex } from '../../data/posts.index'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BlogCard({ post }: { readonly post: PostIndex }) {

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="h-full">
      <Link to={`/blog/${post.id}`} className="group block h-full">
        <div className="relative rounded-2xl bg-white/5 transition duration-300 neon-border hover:-translate-y-1 hover:bg-white/8 shadow-[0_0_0_rgba(0,201,167,0)] hover:shadow-[0_0_28px_rgba(0,201,167,0.22)] overflow-hidden h-full flex flex-col">
          {post.image && (
            <div className="h-40 w-full overflow-hidden">
              <img src={post.image} alt={post.title} className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition" />
            </div>
          )}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15">{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold inline-block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              <span className="relative">
                {post.title}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-brand-cyan transition-all duration-300 group-hover:w-full"></span>
              </span>
            </h3>
            <p className="mt-2 text-white/70 flex-1">{post.excerpt}</p>
            <div className="mt-3 flex gap-2 text-xs text-brand-cyan/90">
              {post.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
