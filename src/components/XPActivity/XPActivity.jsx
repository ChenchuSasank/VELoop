import { Link } from 'react-router-dom'
import orb from '../../assets/xp-orb.png'
import coin from '../../assets/ve-coin.png'
import shared from '../../styles/shared.module.css'
import styles from './XPActivity.module.css'

export default function XPActivity({ items, xpToday = 0, vesToday = 0 }) {
  return (
    <section className={shared.card} aria-label="Recent activity">
      <h3 className={shared.cardTitle}>Recent Activity</h3>
      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Your XP journey starts here.</p>
          <Link to="/Lvl-Dashboard/levels" className={shared.goldBtn}>Start Earning XP</Link>
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
          <span><img src={orb} alt="" /> {xpToday} XP <small>Total Earned</small></span>
          <span><img src={coin} alt="" /> {vesToday} VEs <small>Total Earned</small></span>
        </div>
      </div>
    </section>
  )
}
