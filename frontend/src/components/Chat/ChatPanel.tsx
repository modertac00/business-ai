import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import styles from './Chat.module.css'

interface Props {
  readonly messages: ChatMessage[]
  readonly docTitle: string
  readonly input: string
  readonly sending: boolean
  readonly onInputChange: (v: string) => void
  readonly onSend: (text: string) => void
}

export default function ChatPanel({ messages, docTitle, input, sending, onInputChange, onSend }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  return (
    <aside className={styles.panel}>
      <div className={styles.panelTopbar}>
        <span className={styles.panelTitle}>Document Chat</span>
        <span className={styles.contextPill}>{docTitle}</span>
      </div>

      <div className={styles.messages}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onChipClick={onSend} />
        ))}
        {sending && (
          <div className={`${styles.msg} ${styles.ai}`}>
            <div className={`${styles.avatar} ${styles.avatarAI}`}>AI</div>
            <div className={styles.msgContent}>
              <div className={styles.bubble}>Thinking…</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput value={input} onChange={onInputChange} onSend={onSend} disabled={sending} />
    </aside>
  )
}
