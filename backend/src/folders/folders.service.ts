import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateFolderDto } from './dto/create-folder.dto'
import { UpdateFolderDto } from './dto/update-folder.dto'

@Injectable()
export class FoldersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.folder.findMany({
      orderBy: { createdAt: 'asc' },
      include: { documents: { select: { id: true, name: true, type: true, status: true } } },
    })
  }

  async findOne(id: string) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: { documents: { select: { id: true, name: true, type: true, status: true } } },
    })
    if (!folder) throw new NotFoundException(`Folder ${id} not found`)
    return folder
  }

  create(dto: CreateFolderDto) {
    return this.prisma.folder.create({ data: { name: dto.name } })
  }

  async update(id: string, dto: UpdateFolderDto) {
    await this.findOne(id)
    return this.prisma.folder.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.folder.delete({ where: { id } })
  }
}
