import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagingService } from '../../application/messaging.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');
  private userSockets = new Map<string, Set<string>>(); // userId -> socketIds

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagingService: MessagingService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) { client.disconnect(); return; }
      const payload = this.jwtService.verify(token as string);
      const userId = payload.id;
      (client as any).userId = userId;

      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);

      this.logger.log(`User ${userId} connected (socket ${client.id})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).userId;
    if (userId) {
      this.userSockets.get(userId)?.delete(client.id);
      if (this.userSockets.get(userId)?.size === 0) this.userSockets.delete(userId);
    }
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.join(`convo:${data.conversationId}`);
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.leave(`convo:${data.conversationId}`);
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string; text: string }) {
    const userId = (client as any).userId;
    if (!userId) return;

    const result = await this.messagingService.sendMessage(userId, data.conversationId, data.text);

    // Emitir a todos en la sala de conversación
    this.server.to(`convo:${data.conversationId}`).emit('newMessage', {
      id: result.id,
      conversationId: data.conversationId,
      senderId: userId,
      text: data.text,
      createdAt: Date.now(),
    });
  }
}
