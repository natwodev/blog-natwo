import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { posts } from '../../data/posts'
import { projects } from '../../data/projects'

export default function TitleUpdater() {
  const location = useLocation()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const base = 'Huỳnh Nam'
    const path = location.pathname

    let title = base

    // Normalize without trailing slash
    const normalized = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path

    if (normalized === '/') {
      title = `${t('common.home', { defaultValue: 'Home' })} — ${base}`
    } else if (normalized === '/blog') {
      title = `${t('blog.title', { defaultValue: 'Blog' })} — ${base}`
    } else if (normalized.startsWith('/blog/')) {
      const id = normalized.split('/')[2]
      const post = posts.find(p => p.id === id)
      title = post ? `${post.title} — ${base}` : `${t('blog.title', { defaultValue: 'Blog' })} — ${base}`
    } else if (normalized === '/projects') {
      title = `${t('projects.title', { defaultValue: 'Projects' })} — ${base}`
    } else if (normalized.startsWith('/projects/')) {
      const id = normalized.split('/')[2]
      const project = projects.find(p => p.id === id)
      title = project ? `${project.name} — ${base}` : `${t('projects.title', { defaultValue: 'Projects' })} — ${base}`
    } else if (normalized === '/about') {
      title = `${t('about.title', { defaultValue: 'About' })} — ${base}`
    } else if (normalized === '/contact') {
      title = `${t('contact.title', { defaultValue: 'Contact' })} — ${base}`
    } else if (normalized.startsWith('/timeline/')) {
      const year = normalized.split('/')[2]
      title = `${t('common.milestone', { defaultValue: 'Milestone' })} ${year} — ${base}`
    }

    document.title = title
  }, [location.pathname, i18n.language, t])

  return null
}


