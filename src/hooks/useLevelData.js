import { useState, useEffect, useCallback } from 'react'
import { user } from '../data/levelData'

export default function useLevelData() {
  const [status, setStatus] = useState('loading')
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