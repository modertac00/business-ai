import { useState } from 'react'
import type { Folder } from '../../types'
import NameModal from '../UI/NameModal'
import styles from './Sidebar.module.css'

interface Props {
  folder: Folder
  activeFileId: string
  onSelectFile: (id: string) => void
  onAddDocument: (folderId: string, name: string) => void
}

const STATUS_COLOR: Record<string, string> = {
  done: '#1D9E75',
  draft: '#EF9F27',
  empty: '#B4B2A9',
}

export default function FolderItem({
  folder,
  activeFileId,
  onSelectFile,
  onAddDocument,
}: Readonly<Props>) {
  const [open, setOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const handleConfirm = (name: string) => {
    onAddDocument(folder.id, name)
    setShowModal(false)
  }

  return (
    <>
      <div className={styles.folder}>
        <div className={styles.folderRow}>
          <button className={styles.folderToggle} onClick={() => setOpen(!open)}>
            <span className={styles.arrow}>{open ? '▾' : '▸'}</span>
            <span className={styles.folderName}>{folder.name}</span>
            <span className={styles.badge}>{folder.files.length}</span>
          </button>
          <button
            className={styles.addDocBtn}
            onClick={() => setShowModal(true)}
            title="New document"
          >
            +
          </button>
        </div>

        {open && (
          <div className={styles.children}>
            {folder.files.map((file) => (
              <button
                key={file.id}
                className={`${styles.fileRow} ${file.id === activeFileId ? styles.selected : ''}`}
                onClick={() => onSelectFile(file.id)}
              >
                <span className={styles.dot} style={{ background: STATUS_COLOR[file.status] }} />
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileType}>{file.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NameModal
          title="New Document"
          placeholder="e.g. Carbon Report 2025"
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  )
}
