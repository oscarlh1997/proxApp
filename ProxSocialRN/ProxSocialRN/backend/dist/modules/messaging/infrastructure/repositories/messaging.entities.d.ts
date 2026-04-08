import { UserEntity } from '../../../user/infrastructure/repositories/user.entity';
export declare class ConversationEntity {
    id: string;
    createdAt: number;
}
export declare class ConversationMemberEntity {
    id: string;
    conversationId: string;
    userId: string;
    conversation: ConversationEntity;
    user: UserEntity;
}
export declare class MessageEntity {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: number;
    conversation: ConversationEntity;
    sender: UserEntity;
}
