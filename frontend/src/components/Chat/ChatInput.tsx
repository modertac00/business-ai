import { useRef } from 'react'
import { QUICK_PROMPTS } from '../../data/mockData'
import styles from './Chat.module.css'

interface Props {
  readonly value: string
  readonly disabled?: boolean
  readonly onChange: (v: string) => void
  readonly onSend: (text: string) => void
}

export default function ChatInput({ value, disabled = false, onChange, onSend }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(value)
    }
  }

  return (
    <div className={styles.inputArea}>
      <div className={styles.quickPrompts}>
        {QUICK_PROMPTS.map((p) => (
          <button key={p} className={styles.quickChip} onClick={() => onSend(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className={styles.inputBox}>
        <textarea
          ref={ref}
          className={styles.textarea}
          placeholder="Ask AI to write, edit, or restructure…"
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className={styles.sendBtn} onClick={() => onSend(value)} disabled={disabled}>↑</button>
      </div>
    </div>
  )
}
