import { useState, useEffect, useRef } from 'react'
import styles from './NameModal.module.css'

interface Props {
  title: string
  placeholder: string
  onConfirm: (name: string) => void
  onCancel: () => void
}

export default function NameModal({ title, placeholder, onConfirm, onCancel }: Readonly<Props>) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleConfirm = () => {
    const name = value.trim()
    if (!name) return
    onConfirm(name)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm()
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.title}>{title}</p>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={styles.confirmBtn} onClick={handleConfirm} disabled={!value.trim()}>
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
