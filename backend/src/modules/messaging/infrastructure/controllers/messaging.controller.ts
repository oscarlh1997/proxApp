import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { MAX_MESSAGE_LENGTH, MessagingService } from '../../application/messaging.service';
import { ChatGateway } from '../gateways/chat.gateway';

class CreateConversationBody {
  @IsUUID() targetUserId: string;
}

class SendMessageBody {
  @IsString() @Length(1, MAX_MESSAGE_LENGTH) text: string;
}

@ApiTags('messaging')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/conversations')
export class MessagingController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly gateway: ChatGateway,
  ) {}

  @Get()
  getConversations(@CurrentUser('id') userId: string) {
    return this.messagingService.getConversations(userId);
  }

  @Post()
  async createConversation(@CurrentUser('id') userId: string, @Body() body: CreateConversationBody) {
    return { id: await this.messagingService.findOrCreateConversation(userId, body.targetUserId) };
  }

  @Get(':id/messages')
  getMessages(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) conversationId: string) {
    return this.messagingService.getMessages(userId, conversationId);
  }

  @Post(':id/messages')
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) conversationId: string,
    @Body() body: SendMessageBody,
  ) {
    const msg = await this.messagingService.sendMessage(userId, conversationId, body.text);
    // Lo enviado por HTTP también llega en tiempo real a quien tenga el chat abierto
    this.gateway.broadcast(msg);
    return msg;
  }
}
