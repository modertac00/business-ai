import type { Folder } from '../../types'
import FolderItem from './FolderItem'
import styles from './Sidebar.module.css'

interface Props {
  folders: Folder[]
  activeFileId: string
  onSelectFile: (id: string) => void
  onAddFolder: () => void
  onNewDoc: () => void
}

export default function Sidebar({ folders, activeFileId, onSelectFile, onAddFolder, onNewDoc }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>Workspace</span>
        <button className={styles.iconBtn} onClick={onAddFolder} title="New folder">+</button>
      </div>

      <div className={styles.tree}>
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>

      <button className={styles.newDocBtn} onClick={onNewDoc}>
        + new document
      </button>
    </aside>
  )
}
