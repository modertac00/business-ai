import { useState } from 'react'
import type { DocSection } from '../../types'
import styles from './Editor.module.css'

interface Props {
  section: DocSection
  onUpdate: (id: string, content: string) => void
}

const TAG_CLASS: Record<string, string> = {
  done: styles.tagDone,
  writing: styles.tagWriting,
  empty: styles.tagEmpty,
}
const TAG_LABEL: Record<string, string> = {
  done: 'done',
  writing: 'writing…',
  empty: 'empty',
}

export default function SectionCard({ section, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(section.content)

  function save() {
    onUpdate(section.id, draft)
    setEditing(false)
  }

  return (
    <div className={`${styles.section} ${section.status === 'writing' ? styles.generating : ''}`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>
          {section.number} — {section.title}
        </span>
        <span className={`${styles.tag} ${TAG_CLASS[section.status]}`}>
          {TAG_LABEL[section.status]}
        </span>
      </div>

      <div className={styles.sectionBody}>
        {editing ? (
          <>
            <textarea
              className={styles.editArea}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={save}>Save</button>
              <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        ) : section.status === 'empty' ? (
          <>
            <p className={styles.emptyText}>Not yet generated — ask the AI to write this section.</p>
            <button className={styles.generateBtn} onClick={() => setEditing(true)}>
              + write manually or generate with AI
            </button>
          </>
        ) : (
          <>
            <p className={styles.sectionText}>
              {section.content}
              {section.status === 'writing' && <span className={styles.cursor} />}
            </p>
            <button className={styles.editBtn} onClick={() => setEditing(true)}>
              ✎ edit this section
            </button>
          </>
        )}
      </div>
    </div>
  )
}
