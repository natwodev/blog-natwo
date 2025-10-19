import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FiShare2 } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { Post as PostType } from '../data/posts'

export default function Post() {
  const { id } = useParams()
  const [copiedToast, setCopiedToast] = useState(false)
  const [post, setPost] = useState<PostType | undefined>(() => undefined)

  // Lazy-load the heavy posts content only on detail page
  useEffect(() => {
    let cancelled = false
    if (!id) return
    import('../data/posts').then(mod => {
      if (cancelled) return
      const found = mod.posts.find(p => p.id === id)
      setPost(found)
    })
    return () => { cancelled = true }
  }, [id])

  if (!post) return <div className="max-w-3xl mx-auto px-6 py-12 text-white/80">Đang tải bài viết...</div>
  // Always render internal detail; external posts will also show excerpt/content here


  const handleShare = async () => {
    const url = globalThis.location?.href || ''

    // Clipboard API
    if (globalThis.navigator?.clipboard?.writeText) {
      try {
        await globalThis.navigator.clipboard.writeText(url)
        setCopiedToast(true)
        globalThis.setTimeout(() => setCopiedToast(false), 2200)
        return
      } catch {
        // fallback below
      }
    }

    // Legacy fallback for older Safari/iOS
    try {
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.top = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
      setCopiedToast(true)
      globalThis.setTimeout(() => setCopiedToast(false), 2200)
    } catch {
      // ignore
    }
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-sm text-white/70 flex items-center gap-2">
        <Link to="/blog" className="text-brand-cyan/90 hover:underline">Blog</Link>
        <span>/</span>
        <span>{new Date(post.date).toLocaleDateString()}</span>
      </div>

      <h1 className="mt-3 text-3xl md:text-5xl font-semibold bg-gradient-to-r from-white to-white/85 bg-clip-text text-transparent">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/75">
        <button onClick={handleShare} aria-label="Chia sẻ bài viết" className="ml-auto inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 bg-white/8 text-brand-cyan/90 hover:bg-white/10">
          <FiShare2 />
        </button>
      </div>

      {post.image && (
        <div className="mt-6 rounded-2xl overflow-hidden border border-white/10">
          <img src={post.image} alt={post.title} className="w-full object-cover max-h-[420px]" />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/80">
        {post.tags.map(t => (
          <span key={t} className="px-2 py-0.5 rounded-full bg-white/8 border border-white/15">{t}</span>
        ))}
      </div>

      <div className="prose prose-invert mt-8 max-w-none">
        {post.content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              img: ({ src, alt }) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="rounded-lg border border-white/10 my-6 w-full object-cover max-h-[400px]"
                />
              ),
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                const inline = !match
                return !inline && match ? (
                  <pre className="overflow-x-auto my-4 text-sm md:text-base leading-relaxed">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-white/10 px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium text-white mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-white/90 leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="text-white/90 mb-4 ml-4 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="text-white/90 mb-4 ml-4 space-y-1">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="list-disc">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-brand-cyan/50 pl-4 italic text-white/80 my-4">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-white/90 italic">{children}</em>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        ) : (
          <p className="text-white/90 leading-relaxed">{post.excerpt}</p>
        )}
      </div>

      {/* Toast */}
      {copiedToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="rounded-lg bg-white/10 border border-white/15 backdrop-blur px-4 py-2 text-sm text-white shadow-lg animate-fade-in">
            Đã sao chép liên kết bài viết
          </div>
        </div>
      )}
    </article>
  )
}


