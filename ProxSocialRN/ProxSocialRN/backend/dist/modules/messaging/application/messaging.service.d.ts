import { Repository } from 'typeorm';
import { ConversationEntity, ConversationMemberEntity, MessageEntity } from '../infrastructure/repositories/messaging.entities';
import { RedisService } from '../../../config/redis.service';
export declare class MessagingService {
    private readonly convos;
    private readonly members;
    private readonly messages;
    private readonly redis;
    constructor(convos: Repository<ConversationEntity>, members: Repository<ConversationMemberEntity>, messages: Repository<MessageEntity>, redis: RedisService);
    getConversations(userId: string): Promise<{
        id: string;
        members: {
            id: string;
            display_name: string;
            avatar_seed: string;
        }[];
        lastText: string | null;
        lastAt: number | null;
    }[]>;
    findOrCreateConversation(userId: string, targetUserId: string): Promise<string>;
    getMessages(conversationId: string): Promise<{
        id: string;
        senderId: string;
        senderName: string;
        senderAvatarSeed: string;
        text: string;
        createdAt: number;
    }[]>;
    sendMessage(userId: string, conversationId: string, text: string): Promise<{
        id: string;
    }>;
}
