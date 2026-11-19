import watch from '../../assets/icon-watch.png'
import daily from '../../assets/icon-daily.png'
import refer from '../../assets/icon-refer.png'
import game from '../../assets/icon-xp-catcher.png'
import mini from '../../assets/icon-mini-games.png'
import streak from '../../assets/icon-streak.png'
import { earnItems } from '../../data/levelData'
import shared from '../../styles/shared.module.css'
import styles from './EarnMoreXP.module.css'

const icons = { watch, daily, refer, game, mini, streak }

export default function EarnMoreXP() {
  const handleClick = (item) => {
    if (item.id === 'game') window.scrollTo({ top: 0, behavior: 'smooth' })
    else alert(`${item.title}: connect the existing route here.`)
  }

  return (
    <section className={shared.card} aria-label="Earn more XP and rewards">
      <h3 className={shared.cardTitle}>Earn More XP & Rewards</h3>
      <div className={styles.grid}>
        {earnItems.map((item) => {
                    const soon = item.status === 'soon'
          return (
            <button key={item.id} className={styles.cardBtn} disabled={soon} onClick={() => handleClick(item)}>
              <img src={icons[item.id]} alt="" width="44" height="44" className={styles.icon} />
              <span className={styles.text}>
                <b>{item.title}</b>
                <small>{item.text}</small>
                <em>{soon ? 'Coming Soon' : item.xp}</em>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
