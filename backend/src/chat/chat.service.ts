import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SendMessageDto } from './dto/send-message.dto'

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(documentId: string) {
    await this.assertDocumentExists(documentId)
    return this.prisma.chatMessage.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async send(documentId: string, dto: SendMessageDto) {
    await this.assertDocumentExists(documentId)
    return this.prisma.chatMessage.create({
      data: {
        role: 'user',
        text: dto.text,
        documentId,
      },
    })
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
