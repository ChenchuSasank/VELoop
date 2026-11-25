import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)
const KEY = 'veloopProgress'
const fresh = { unlocked: 1, stars: {}, xp: 0, ves: 0 }

export function ProgressProvider({ children }) {
  const [p, setP] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || fresh } catch { return fresh } })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(p)) }, [p])

  const complete = (n, stars, ves = 0) => setP((o) => ({
    unlocked: Math.max(o.unlocked, n + 1),
    stars: { ...o.stars, [n]: Math.max(o.stars[n] || 0, stars) },
    xp: o.xp + (o.stars[n] ? 0 : 20 + n * 2),
    ves: (o.ves || 0) + (o.stars[n] ? 0 : ves),
  }))
  const reset = () => setP(fresh)
  const completed = p.unlocked - 1
  return <Ctx.Provider value={{ ...p, completed, complete, reset }}>{children}</Ctx.Provider>
}
export const useProgress = () => useContext(Ctx)