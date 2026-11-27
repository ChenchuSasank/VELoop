import { useNavigate } from 'react-router-dom'
import orb from '../../assets/xp-orb.png'
import coin from '../../assets/ve-coin.png'
import shared from '../../styles/shared.module.css'
import styles from './XPActivity.module.css'

export default function XPActivity({ items, totalXP = 0, totalVEs = 0 }) {
  const navigate = useNavigate()
  return (
    <section className={shared.card} aria-label="Recent activity">
      <h3 className={shared.cardTitle}>Recent Activity</h3>
      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Your XP journey starts here.</p>
          <button className={shared.goldBtn} onClick={() => navigate('/Lvl-Dashboard/levels')}>Start Earning XP</button>
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((a) => (
            <li key={a.id}>
              <div><b className={styles.xp}>{a.xp}</b><div>{a.title}</div></div>
              <small className={shared.muted}>{a.time}</small>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.summary}>
        <b>Today's Summary</b>
        <div>
          <span><img src={orb} alt="" /> {totalXP} XP <small>Total Earned</small></span>
          <span><img src={coin} alt="" /> {totalVEs} VEs <small>Total Earned</small></span>
        </div>
      </div>
    </section>
  )
}