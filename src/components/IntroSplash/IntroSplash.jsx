import styles from './IntroSplash.module.css'

export default function IntroSplash() {
  return (
    <div className={styles.wrap} aria-label="Loading VELOOP Rewards">
      <div className={styles.hex}><span>VE</span></div>
      <h1 className={styles.logo}>VELOOP</h1>
      <p>Level up your rewards</p>
      <div className={styles.line}><i /></div>
    </div>
  )
}