import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/common/Navbar'
import FooterSwitch from './components/common/FooterSwitch'
import ScrollToTop from './components/common/ScrollToTop'
import TitleUpdater from './components/common/TitleUpdater'
import { BrowserRouter } from 'react-router-dom'
import AutoplayAudio from './components/common/AutoplayAudio'
const songUrl = new URL('./audio/hachimi.mp3', import.meta.url).href

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Navbar />
          <ScrollToTop />
          <TitleUpdater />
          <AutoplayAudio src={songUrl} />
          <App />
          <FooterSwitch />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
