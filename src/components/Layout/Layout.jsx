import { NavLink, Outlet } from 'react-router-dom'
import { Home, Map, Gift, Trophy, User } from 'lucide-react'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import styles from './Layout.module.css'

const tabs = [
  { to: '/Lvl-Dashboard', label: 'Home', icon: Home, end: true },
  { to: '/Lvl-Dashboard/levels', label: 'Levels', icon: Map },
  { to: '/Lvl-Dashboard/rewards', label: 'Rewards', icon: Gift },
  { to: '/Lvl-Dashboard/ranks', label: 'Ranks', icon: Trophy },
  { to: '/Lvl-Dashboard/profile', label: 'Profile', icon: User },
]

// Shared layout: navigation on every page (top bar on desktop, bottom bar on phones)
export default function Layout() {
  return (
    <>
      <div className={styles.topbar}><b className={styles.mobileLogo}>VELOOP</b><ThemeToggle /></div>
      <nav className={styles.nav} aria-label="Main">
        <b className={styles.logo}>VELOOP</b>
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? styles.active : '')}><Icon size={20} /><small>{label}</small></NavLink>
        ))}
        <ThemeToggle className={styles.navToggle} />
      </nav>
      <div className={styles.page}><Outlet /></div>
    </>
  )
}