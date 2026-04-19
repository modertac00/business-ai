import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { FoldersModule } from './folders/folders.module'
import { DocumentsModule } from './documents/documents.module'
import { ChatModule } from './chat/chat.module'
import { SectionsModule } from './sections/sections.module'

@Module({
  imports: [PrismaModule, FoldersModule, DocumentsModule, ChatModule, SectionsModule],
})
export class AppModule {}
