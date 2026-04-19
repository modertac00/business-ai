import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common'
import { SectionsService } from './sections.service'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'

@Controller('documents/:documentId/sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  findAll(@Param('documentId') documentId: string) {
    return this.sectionsService.findAll(documentId)
  }

  @Post()
  create(@Param('documentId') documentId: string, @Body() dto: CreateSectionDto) {
    return this.sectionsService.create(documentId, dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(id)
  }
}
