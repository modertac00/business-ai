import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { BedrockService } from '../ai/bedrock.service'
import { buildSystemPrompt, buildMessages } from '../ai/prompt.builder'
import { SendMessageDto } from './dto/send-message.dto'

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bedrock: BedrockService,
  ) {}

  async findAll(documentId: string) {
    await this.assertDocumentExists(documentId)
    return this.prisma.chatMessage.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async send(documentId: string, dto: SendMessageDto) {
    await this.assertDocumentExists(documentId)

    const userMessage = await this.prisma.chatMessage.create({
      data: { role: 'user', text: dto.text, documentId },
    })

    const [sections, history] = await Promise.all([
      this.prisma.section.findMany({
        where: { documentId },
        orderBy: { order: 'asc' },
      }),
      this.prisma.chatMessage.findMany({
        where: { documentId, id: { not: userMessage.id } },
        orderBy: { createdAt: 'asc' },
        take: 20,
      }),
    ])

    const systemPrompt = buildSystemPrompt(sections)
    const messages = buildMessages(history, dto.text)
    const aiText = await this.bedrock.converse(systemPrompt, messages)

    const aiMessage = await this.prisma.chatMessage.create({
      data: { role: 'ai', text: aiText, documentId },
    })

    return { userMessage, aiMessage }
  }

  async clear(documentId: string) {
    await this.assertDocumentExists(documentId)
    return this.prisma.chatMessage.deleteMany({ where: { documentId } })
  }

  private async assertDocumentExists(documentId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id: documentId } })
    if (!doc) throw new NotFoundException(`Document ${documentId} not found`)
  }
}
