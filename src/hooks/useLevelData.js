import { useState, useEffect, useCallback } from 'react'
import { user } from '../data/levelData'

// Simulates an API call. Open /Lvl-Dashboard?error=1 to see the error state.
export default function useLevelData() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [data, setData] = useState(null)

  const load = useCallback(() => {
    setStatus('loading')
    setTimeout(() => {
      if (new URLSearchParams(window.location.search).get('error')) return setStatus('error')
      setData(user)
      setStatus('ready')
    }, 900)
  }, [])

  useEffect(() => { load() }, [load])
  return { status, data, reload: load }
}
