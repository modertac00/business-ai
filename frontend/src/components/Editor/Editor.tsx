import type { DocSection } from '../../types'
import SectionCard from './SectionCard'
import styles from './Editor.module.css'

interface Props {
  title: string
  sections: DocSection[]
  activeDocumentId: string
  onTitleChange: (t: string) => void
  onUpdateSection: (id: string, content: string) => void
  onAddSection: () => void
}

export default function Editor({
  title,
  sections,
  activeDocumentId,
  onTitleChange,
  onUpdateSection,
  onAddSection,
}: Readonly<Props>) {
  if (!activeDocumentId) {
    return (
      <main className={styles.editor}>
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>Select a document from the sidebar to get started</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.editor}>
      <div className={styles.editorTopbar}>
        <input
          className={styles.titleInput}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <span className={styles.savedPill}>auto-saved</span>
        <div className={styles.actions}>
          <button className={styles.btn}>Share</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Publish</button>
        </div>
      </div>

      <div className={styles.body}>
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} onUpdate={onUpdateSection} />
        ))}
        <button className={styles.addSectionBtn} onClick={onAddSection}>
          + add section
        </button>
      </div>
    </main>
  )
}
