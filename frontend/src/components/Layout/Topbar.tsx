import styles from './Topbar.module.css'

interface Props {
  onExport?: () => void
}

const TABS = ['Editor', 'Preview', 'History']

export default function Topbar({ onExport }: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.logo}>
        doc<span className={styles.accent}>.</span>ai
      </div>

      <nav className={styles.tabs}>
        {TABS.map((tab, i) => (
          <button key={tab} className={`${styles.tab} ${i === 0 ? styles.active : ''}`}>
            {tab}
          </button>
        ))}
      </nav>

      <div className={styles.right}>
        <button className={styles.exportBtn} onClick={onExport}>Export</button>
        <div className={styles.avatar}>TJ</div>
      </div>
    </header>
  )
}
