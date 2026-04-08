import { MessagingService } from '../../application/messaging.service';
export declare class MessagingController {
    private readonly messagingService;
    constructor(messagingService: MessagingService);
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
    createConversation(userId: string, body: {
        targetUserId: string;
    }): Promise<{
        id: string;
    }>;
    getMessages(conversationId: string): Promise<{
        id: string;
        senderId: string;
        senderName: string;
        senderAvatarSeed: string;
        text: string;
        createdAt: number;
    }[]>;
    sendMessage(userId: string, conversationId: string, body: {
        text: string;
    }): Promise<{
        id: string;
    }>;
}
