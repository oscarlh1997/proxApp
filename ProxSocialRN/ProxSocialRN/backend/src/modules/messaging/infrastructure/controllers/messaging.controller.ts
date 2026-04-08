import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { MessagingService } from '../../application/messaging.service';

@ApiTags('messaging')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/conversations')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get()
  getConversations(@CurrentUser('id') userId: string) {
    return this.messagingService.getConversations(userId);
  }

  @Post()
  async createConversation(@CurrentUser('id') userId: string, @Body() body: { targetUserId: string }) {
    const id = await this.messagingService.findOrCreateConversation(userId, body.targetUserId);
    return { id };
  }

  @Get(':id/messages')
  getMessages(@Param('id') conversationId: string) {
    return this.messagingService.getMessages(conversationId);
  }

  @Post(':id/messages')
  sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() body: { text: string },
  ) {
    return this.messagingService.sendMessage(userId, conversationId, body.text);
  }
}
