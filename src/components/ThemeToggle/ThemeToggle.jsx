import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import styles from './ThemeToggle.module.css'

// Quick button: switches between light and dark
export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button className={`${styles.btn} ${className}`} onClick={toggle} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

// Full chooser (Light / Dark / Auto) used on the Profile page
export function ThemeSelect() {
  const { mode, setMode } = useTheme()
  const options = [['light', 'Light'], ['dark', 'Dark'], ['system', 'Auto']]
  return (
    <div className={styles.select} role="radiogroup" aria-label="Theme">
      {options.map(([value, label]) => (
        <button key={value} role="radio" aria-checked={mode === value} className={mode === value ? styles.on : ''} onClick={() => setMode(value)}>{label}</button>
      ))}
    </div>
  )
}