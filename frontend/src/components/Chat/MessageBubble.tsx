import type { ChatMessage } from '../../types'
import styles from './Chat.module.css'

interface Props {
  message: ChatMessage
  onChipClick: (text: string) => void
}

export default function MessageBubble({ message, onChipClick }: Props) {
  const isAI = message.role === 'ai'

  return (
    <div className={`${styles.msg} ${isAI ? styles.ai : styles.user}`}>
      <div className={`${styles.avatar} ${isAI ? styles.avatarAI : styles.avatarUser}`}>
        {isAI ? 'AI' : 'TJ'}
      </div>
      <div className={styles.msgContent}>
        <div className={styles.bubble}>{message.text}</div>

        {message.sectionIndicator && (
          <div className={styles.indicator}>
            <span className={styles.pulseDot} />
            Editing — {message.sectionIndicator}
          </div>
        )}

        {message.chips && message.chips.length > 0 && (
          <div className={styles.chips}>
            {message.chips.map((chip) => (
              <button key={chip} className={styles.chip} onClick={() => onChipClick(chip)}>
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
