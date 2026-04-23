import { Section, ChatMessage } from '@prisma/client'

export function buildSystemPrompt(sections: Section[]): string {
  const sectionContext =
    sections.length > 0
      ? sections
          .sort((a, b) => a.order - b.order)
          .map((s) => `Section ${s.number}: ${s.title}\n${s.content || '(empty)'}`)
          .join('\n\n')
      : '(no sections yet)'

  return `You are a business document writing assistant. You help users write, improve, and refine sections of business documents.

Current document sections:
${sectionContext}

Guidelines:
- Be concise and professional
- When suggesting content for a section, provide clear, structured text
- Reference specific section numbers when relevant
- If asked to write content, provide ready-to-use text the user can insert directly`
}

export function buildMessages(
  history: ChatMessage[],
  userText: string,
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const historyMessages = history
    .filter((m) => m.role === 'user' || m.role === 'ai')
    .map((m) => ({
      role: m.role === 'ai' ? ('assistant' as const) : ('user' as const),
      content: m.text,
    }))

  return [...historyMessages, { role: 'user' as const, content: userText }]
}
