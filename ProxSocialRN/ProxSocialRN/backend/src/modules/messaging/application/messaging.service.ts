import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity, ConversationMemberEntity, MessageEntity } from '../infrastructure/repositories/messaging.entities';
import { RedisService } from '../../../config/redis.service';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(ConversationEntity) private readonly convos: Repository<ConversationEntity>,
    @InjectRepository(ConversationMemberEntity) private readonly members: Repository<ConversationMemberEntity>,
    @InjectRepository(MessageEntity) private readonly messages: Repository<MessageEntity>,
    private readonly redis: RedisService,
  ) {}

  async getConversations(userId: string) {
    const memberships = await this.members.find({ where: { userId } });
    const results = [];

    for (const m of memberships) {
      const otherMembers = await this.members.find({
        where: { conversationId: m.conversationId },
        relations: ['user'],
      });
      const others = otherMembers
        .filter((om) => om.userId !== userId)
        .map((om) => ({ id: om.user.id, display_name: om.user.displayName, avatar_seed: om.user.avatarSeed }));

      const lastMsg = await this.messages.findOne({
        where: { conversationId: m.conversationId },
        order: { createdAt: 'DESC' },
      });

      results.push({
        id: m.conversationId,
        members: others,
        lastText: lastMsg?.text || null,
        lastAt: lastMsg ? Number(lastMsg.createdAt) : null,
      });
    }

    return results.sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0));
  }

  async findOrCreateConversation(userId: string, targetUserId: string): Promise<string> {
    // Buscar conversación existente
    const myMemberships = await this.members.find({ where: { userId } });
    for (const m of myMemberships) {
      const hasTgt = await this.members.findOne({ where: { conversationId: m.conversationId, userId: targetUserId } });
      if (hasTgt) return m.conversationId;
    }

    // Crear nueva
    const convo = this.convos.create({ createdAt: Date.now() });
    const saved = await this.convos.save(convo);
    await this.members.save([
      this.members.create({ conversationId: saved.id, userId }),
      this.members.create({ conversationId: saved.id, userId: targetUserId }),
    ]);
    return saved.id;
  }

  async getMessages(conversationId: string) {
    const msgs = await this.messages.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
    return msgs.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender.displayName,
      senderAvatarSeed: m.sender.avatarSeed,
      text: m.text,
      createdAt: Number(m.createdAt),
    }));
  }

  async sendMessage(userId: string, conversationId: string, text: string) {
    const msg = this.messages.create({ conversationId, senderId: userId, text, createdAt: Date.now() });
    const saved = await this.messages.save(msg);

    // Publicar por Redis pub/sub para WebSocket en tiempo real
    await this.redis.publish(`chat:${conversationId}`, JSON.stringify({
      id: saved.id, senderId: userId, text, createdAt: Number(saved.createdAt),
    }));

    return { id: saved.id };
  }
}
