import { useState } from 'react'
import XPCatcher from '../XPCatcher/XPCatcher'
import VEDash from '../VEDash/VEDash'
import styles from './GameHub.module.css'

// Lets the user switch between the two mini-games
export default function GameHub({ onReward }) {
  const [game, setGame] = useState('dash')
  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Choose a game">
        <button role="tab" aria-selected={game === 'dash'} className={game === 'dash' ? styles.on : ''} onClick={() => setGame('dash')}>VE Dash</button>
        <button role="tab" aria-selected={game === 'catcher'} className={game === 'catcher' ? styles.on : ''} onClick={() => setGame('catcher')}>XP Catcher</button>
      </div>
      {game === 'dash' ? <VEDash onReward={onReward} /> : <XPCatcher onReward={onReward} />}
    </div>
  )
}
