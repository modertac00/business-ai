import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(folderId: string) {
    return this.prisma.document.findMany({
      where: { folderId },
      orderBy: { createdAt: 'asc' },
      include: { sections: { orderBy: { order: 'asc' } } },
    })
  }

  async findOne(id: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { sections: { orderBy: { order: 'asc' } } },
    })
    if (!doc) throw new NotFoundException(`Document ${id} not found`)
    return doc
  }

  create(folderId: string, dto: CreateDocumentDto) {
    return this.prisma.document.create({
      data: {
        name: dto.name,
        type: dto.type,
        status: dto.status ?? 'empty',
        folderId,
      },
    })
  }

  async update(id: string, dto: UpdateDocumentDto) {
    await this.findOne(id)
    return this.prisma.document.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.document.delete({ where: { id } })
  }
}
