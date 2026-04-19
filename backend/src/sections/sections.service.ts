import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(documentId: string) {
    await this.assertDocumentExists(documentId)
    return this.prisma.section.findMany({
      where: { documentId },
      orderBy: { order: 'asc' },
    })
  }

  async create(documentId: string, dto: CreateSectionDto) {
    await this.assertDocumentExists(documentId)
    const count = await this.prisma.section.count({ where: { documentId } })
    const number = (count + 1).toString().padStart(2, '0')
    return this.prisma.section.create({
      data: {
        title: dto.title,
        content: dto.content ?? '',
        order: dto.order ?? count,
        number,
        documentId,
      },
    })
  }

  async update(id: string, dto: UpdateSectionDto) {
    await this.findOne(id)
    return this.prisma.section.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.section.delete({ where: { id } })
  }

  private async findOne(id: string) {
    const section = await this.prisma.section.findUnique({ where: { id } })
    if (!section) throw new NotFoundException(`Section ${id} not found`)
    return section
  }

  private async assertDocumentExists(documentId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id: documentId } })
    if (!doc) throw new NotFoundException(`Document ${documentId} not found`)
  }
}
