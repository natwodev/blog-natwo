import { Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Projects from './pages/Projects'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Timeline2022 from './pages/timeline/2022'
import Timeline2023 from './pages/timeline/2023'
import Timeline2024 from './pages/timeline/2024'
import Timeline2025 from './pages/timeline/2025'
import Contact from './pages/Contact'
import Post from './pages/Post'
import Project from './pages/Project'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<Post />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<Project />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/timeline/2022" element={<Timeline2022 />} />
      <Route path="/timeline/2023" element={<Timeline2023 />} />
      <Route path="/timeline/2024" element={<Timeline2024 />} />
      <Route path="/timeline/2025" element={<Timeline2025 />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
