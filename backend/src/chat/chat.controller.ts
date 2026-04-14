import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common'
import { ChatService } from './chat.service'
import { SendMessageDto } from './dto/send-message.dto'

@Controller('documents/:documentId/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll(@Param('documentId') documentId: string) {
    return this.chatService.findAll(documentId)
  }

  @Post('messages')
  send(@Param('documentId') documentId: string, @Body() dto: SendMessageDto) {
    return this.chatService.send(documentId, dto)
  }

  @Delete('messages')
  @HttpCode(204)
  clear(@Param('documentId') documentId: string) {
    return this.chatService.clear(documentId)
  }
}
