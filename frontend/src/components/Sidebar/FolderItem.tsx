import { useState } from 'react'
import type { Folder } from '../../types'
import styles from './Sidebar.module.css'

interface Props {
  folder: Folder
  activeFileId: string
  onSelectFile: (id: string) => void
}

const STATUS_COLOR: Record<string, string> = {
  done: '#1D9E75',
  draft: '#EF9F27',
  empty: '#B4B2A9',
}

export default function FolderItem({ folder, activeFileId, onSelectFile }: Props) {
  const [open, setOpen] = useState(folder.id === 'moderta')

  return (
    <div className={styles.folder}>
      <button className={styles.folderRow} onClick={() => setOpen(!open)}>
        <span className={styles.arrow}>{open ? '▾' : '▸'}</span>
        <span className={styles.folderName}>{folder.name}</span>
        <span className={styles.badge}>{folder.files.length}</span>
      </button>

      {open && (
        <div className={styles.children}>
          {folder.files.map((file) => (
            <button
              key={file.id}
              className={`${styles.fileRow} ${file.id === activeFileId ? styles.selected : ''}`}
              onClick={() => onSelectFile(file.id)}
            >
              <span
                className={styles.dot}
                style={{ background: STATUS_COLOR[file.status] }}
              />
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileType}>{file.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
