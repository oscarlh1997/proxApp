import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConversationEntity, ConversationMemberEntity, MessageEntity } from '../infrastructure/repositories/messaging.entities';
import { UserEntity } from '../../user/infrastructure/repositories/user.entity';

export const MAX_MESSAGE_LENGTH = 2000;

export interface MessageView {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: number;
}

@Injectable()
export class MessagingService {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  /** Una sola consulta: el otro participante y el último mensaje de cada chat. */
  async getConversations(userId: string) {
    const rows: any[] = await this.db.query(
      `SELECT c.id, u.id AS other_id, u.display_name, u.avatar_seed,
              lm.text AS last_text, lm.created_at AS last_at, lm.sender_id AS last_sender
         FROM conversation_members me
         JOIN conversations c ON c.id = me.conversation_id
         JOIN conversation_members o ON o.conversation_id = c.id AND o.user_id <> me.user_id
         JOIN users u ON u.id = o.user_id
         LEFT JOIN LATERAL (
           SELECT text, created_at, sender_id FROM messages m
            WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1
         ) lm ON true
        WHERE me.user_id = $1
        ORDER BY COALESCE(lm.created_at, c.created_at) DESC`,
      [userId],
    );
    return rows.map((r) => ({
      id: r.id,
      other: { id: r.other_id, displayName: r.display_name, avatarSeed: r.avatar_seed },
      lastText: r.last_text,
      lastAt: r.last_at ? Number(r.last_at) : null,
      lastFromMe: r.last_sender === userId,
    }));
  }

  async findOrCreateConversation(userId: string, targetUserId: string): Promise<string> {
    if (userId === targetUserId) throw new BadRequestException('No puedes escribirte a ti mismo');
    if (!(await this.db.getRepository(UserEntity).exist({ where: { id: targetUserId } }))) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const [existing] = await this.db.query(
      `SELECT a.conversation_id AS id FROM conversation_members a
         JOIN conversation_members b ON a.conversation_id = b.conversation_id
        WHERE a.user_id = $1 AND b.user_id = $2 LIMIT 1`,
      [userId, targetUserId],
    );
    if (existing) return existing.id;

    return this.db.transaction(async (tx) => {
      const convo = await tx.save(tx.create(ConversationEntity, { createdAt: Date.now() }));
      await tx.insert(ConversationMemberEntity, [
        { conversationId: convo.id, userId },
        { conversationId: convo.id, userId: targetUserId },
      ]);
      return convo.id;
    });
  }

  async assertMember(userId: string, conversationId: string): Promise<void> {
    const ok = await this.db.getRepository(ConversationMemberEntity).exist({ where: { conversationId, userId } });
    if (!ok) throw new ForbiddenException('No perteneces a esta conversación');
  }

  async getMessages(userId: string, conversationId: string): Promise<MessageView[]> {
    await this.assertMember(userId, conversationId);
    // Últimos 200, devueltos en orden cronológico
    const msgs = await this.db.getRepository(MessageEntity).find({
      where: { conversationId }, order: { createdAt: 'DESC' }, take: 200,
    });
    return msgs.reverse().map(toView);
  }

  async sendMessage(userId: string, conversationId: string, rawText: unknown): Promise<MessageView> {
    const text = typeof rawText === 'string' ? rawText.trim() : '';
    if (!text || text.length > MAX_MESSAGE_LENGTH) {
      throw new BadRequestException(`El mensaje debe tener entre 1 y ${MAX_MESSAGE_LENGTH} caracteres`);
    }
    await this.assertMember(userId, conversationId);
    const repo = this.db.getRepository(MessageEntity);
    const saved = await repo.save(repo.create({ conversationId, senderId: userId, text, createdAt: Date.now() }));
    return toView(saved);
  }
}

function toView(m: MessageEntity): MessageView {
  return { id: m.id, conversationId: m.conversationId, senderId: m.senderId, text: m.text, createdAt: Number(m.createdAt) };
}
