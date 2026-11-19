import { createContext, useContext, useEffect, useState } from 'react'

// mode: 'dark' | 'light' | 'system' (follow the device setting). Saved in the browser.
const KEY = 'veloopTheme'
const Ctx = createContext(null)
const systemTheme = () => (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => { try { return localStorage.getItem(KEY) || 'dark' } catch { return 'dark' } })
  const [system, setSystem] = useState(systemTheme)
  const theme = mode === 'system' ? system : mode // the theme actually shown

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const on = () => setSystem(mq.matches ? 'light' : 'dark')
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(KEY, mode) } catch {}
  }, [theme, mode])

  const toggle = () => setMode(theme === 'dark' ? 'light' : 'dark')
  return <Ctx.Provider value={{ mode, theme, setMode, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)