import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)
const KEY = 'veloopProgress'
const fresh = { unlocked: 1, stars: {}, xp: 0, bonus: 0 }

export function ProgressProvider({ children }) {
  const [p, setP] = useState(() => { try { return { ...fresh, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return fresh } })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { } }, [p])

  const complete = (n, stars) => setP((o) => ({
    unlocked: Math.max(o.unlocked, n + 1),
    stars: { ...o.stars, [n]: Math.max(o.stars[n] || 0, stars) },
    xp: o.xp + (o.stars[n] ? 0 : 20 + n * 2),
  }))
  const addBonus = (gain) => setP((o) => ({ ...o, bonus: (o.bonus || 0) + gain }))
  const reset = () => setP(fresh)
  const completed = p.unlocked - 1
  return <Ctx.Provider value={{ ...p, completed, complete, addBonus, reset }}>{children}</Ctx.Provider>
}
export const useProgress = () => useContext(Ctx)
