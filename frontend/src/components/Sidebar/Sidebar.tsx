import { useState } from 'react'
import type { Folder } from '../../types'
import FolderItem from './FolderItem'
import NameModal from '../UI/NameModal'
import styles from './Sidebar.module.css'

interface Props {
  folders: Folder[]
  activeFileId: string
  onSelectFile: (id: string) => void
  onAddFolder: (name: string) => void
  onAddDocument: (folderId: string, name: string) => void
  loading?: boolean
}

export default function Sidebar({
  folders,
  activeFileId,
  onSelectFile,
  onAddFolder,
  onAddDocument,
  loading,
}: Readonly<Props>) {
  const [showModal, setShowModal] = useState(false)

  const handleConfirm = (name: string) => {
    onAddFolder(name)
    setShowModal(false)
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <span className={styles.title}>Workspace</span>
          <button
            className={styles.iconBtn}
            onClick={() => setShowModal(true)}
            title="New workspace"
          >
            +
          </button>
        </div>

        <div className={styles.tree}>
          {loading && <span className={styles.loading}>Loading…</span>}
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              activeFileId={activeFileId}
              onSelectFile={onSelectFile}
              onAddDocument={onAddDocument}
            />
          ))}
        </div>
      </aside>

      {showModal && (
        <NameModal
          title="New Workspace"
          placeholder="e.g. Moderta ESG"
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  )
}
