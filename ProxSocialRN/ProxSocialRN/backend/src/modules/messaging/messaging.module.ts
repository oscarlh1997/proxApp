import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConversationEntity, ConversationMemberEntity, MessageEntity } from './infrastructure/repositories/messaging.entities';
import { MessagingService } from './application/messaging.service';
import { MessagingController } from './infrastructure/controllers/messaging.controller';
import { ChatGateway } from './infrastructure/gateways/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, ConversationMemberEntity, MessageEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [MessagingController],
  providers: [MessagingService, ChatGateway],
  exports: [MessagingService],
})
export class MessagingModule {}
