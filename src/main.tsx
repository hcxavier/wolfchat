import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import { SettingsProvider } from './hooks/useSettings.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { AlertProvider } from './contexts/AlertContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ThemeProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </ThemeProvider>
    </SettingsProvider>
  </StrictMode>,
)