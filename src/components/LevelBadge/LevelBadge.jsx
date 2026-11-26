import { useId } from 'react'
import { Lock, Check } from 'lucide-react'
import { levelConfig } from '../../data/levels'
import styles from './LevelBadge.module.css'

const SHAPES = [
  'M60 4 L112 34 L112 94 L60 128 L8 94 L8 34 Z',
  'M60 4 L112 20 C112 72 100 108 60 128 C20 108 8 72 8 20 Z',
  'M38 4 H82 L116 38 V94 L82 128 H38 L4 94 V38 Z',
  'M60 2 L116 66 L60 130 L4 66 Z',
  'M60 6 A60 60 0 1 1 59.9 6 Z',
]
const FACE = 'translate(60 66) scale(.84) translate(-60 -66)'

export default function LevelBadge({ n, size = 96, state = 'done' }) {
  const id = useId().replace(/:/g, '')
  const h = levelConfig(n).hue
  const shape = SHAPES[(n - 1) % 5]
  const tier = Math.min(4, Math.floor((n - 1) / 5))
  const gems = tier + 1
  const fontSize = n > 99 ? 30 : n > 9 ? 40 : 48
  const c = (s, l, a) => `hsl(${h} ${s}% ${l}%${a ? ` / ${a}` : ''})`

  return (
    <span className={`${styles.wrap} ${styles[state]}`} style={{ '--h': h, '--s': size + 'px' }}>
      <span className={styles.art}>
        <svg viewBox="0 -14 120 154" width={size} height={(size * 154) / 120} role="img" aria-label={`Level ${n} badge`}>
          <defs>
            <linearGradient id={id + 'r'} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={c(85, 80)} />
              <stop offset=".45" stopColor={c(70, 52)} />
              <stop offset="1" stopColor={c(65, 22)} />
            </linearGradient>
            <radialGradient id={id + 'f'} cx=".5" cy=".28" r=".95">
              <stop offset="0" stopColor={c(45, 28)} />
              <stop offset="1" stopColor={c(55, 7)} />
            </radialGradient>
            <linearGradient id={id + 't'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor={c(85, 80)} />
            </linearGradient>
            <linearGradient id={id + 'g'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity=".28" />
              <stop offset=".5" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={id + 'c'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe9a8" />
              <stop offset="1" stopColor="#c8902f" />
            </linearGradient>
          </defs>

          {tier >= 4 && <circle cx="60" cy="66" r="68" fill="none" stroke={c(80, 65, 0.4)} strokeWidth="1.5" strokeDasharray="2 6" />}

          {tier >= 2 && (
            <g fill="none" stroke={c(70, 62)} strokeLinecap="round">
              <path d="M12 100 C-4 82 -4 50 14 30" strokeWidth="3.5" strokeDasharray="7 4" />
              <path d="M108 100 C124 82 124 50 106 30" strokeWidth="3.5" strokeDasharray="7 4" />
            </g>
          )}

          {tier >= 3 && <path d="M42 6 L47 -10 L60 3 L73 -10 L78 6 Z" fill={`url(#${id}c)`} stroke="#7d5a16" strokeWidth="1" strokeLinejoin="round" />}

          <path d={shape} fill={`url(#${id}r)`} />
          <path d={shape} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.2" />
          <g transform={FACE}>
            <path d={shape} fill={`url(#${id}f)`} stroke={c(80, 70, 0.75)} strokeWidth="1.6" />
            <path d={shape} fill={`url(#${id}g)`} />
          </g>

          {state !== 'locked' && (
            <>
              <text x="60" y="47" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="3" fill={c(60, 78)} opacity=".85">LEVEL</text>
              <text x="60" y="84" textAnchor="middle" fontSize={fontSize} fontWeight="800" fill={`url(#${id}t)`} stroke="rgba(0,0,0,.55)" strokeWidth=".7">{n}</text>
            </>
          )}

          {Array.from({ length: gems }, (_, i) => (
            <circle key={i} cx={60 + (i - (gems - 1) / 2) * 9} cy="100" r="3.2" fill={`hsl(${(h + 40) % 360} 85% 66%)`} stroke="#ffffff" strokeOpacity=".7" strokeWidth=".8" />
          ))}
        </svg>
      </span>
      {state === 'locked' && <Lock className={styles.lock} size={Math.round(size * 0.26)} />}
      {state === 'done' && <span className={styles.check}><Check size={Math.round(size * 0.18)} strokeWidth={3} /></span>}
    </span>
  )
}