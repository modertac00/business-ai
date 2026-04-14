import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import styles from './Chat.module.css'

interface Props {
  messages: ChatMessage[]
  docTitle: string
  input: string
  onInputChange: (v: string) => void
  onSend: (text: string) => void
}

export default function ChatPanel({ messages, docTitle, input, onInputChange, onSend }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
        <div ref={bottomRef} />
      </div>

      <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
    </aside>
  )
}
