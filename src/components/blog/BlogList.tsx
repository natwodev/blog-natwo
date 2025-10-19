import { postsIndex } from '../../data/posts.index'
import BlogCard from './BlogCard'

export default function BlogList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {postsIndex.map(p => (
        <BlogCard key={p.id} post={p} />
      ))}
    </div>
  )
}

