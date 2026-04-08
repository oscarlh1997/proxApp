import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagingService } from '../../application/messaging.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly messagingService;
    server: Server;
    private logger;
    private userSockets;
    constructor(jwtService: JwtService, messagingService: MessagingService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, data: {
        conversationId: string;
    }): void;
    handleLeave(client: Socket, data: {
        conversationId: string;
    }): void;
    handleMessage(client: Socket, data: {
        conversationId: string;
        text: string;
    }): Promise<void>;
}
