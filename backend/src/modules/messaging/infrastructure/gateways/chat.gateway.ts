import {
  ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { MessagingService, MessageView } from '../../application/messaging.service';

type AuthedSocket = Socket & { data: { userId?: string } };

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('ChatGateway');

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagingService: MessagingService,
  ) {}

  handleConnection(client: AuthedSocket) {
    try {
      const token = client.handshake.auth?.token ?? client.handshake.query?.token;
      client.data.userId = this.jwtService.verify<{ id: string }>(String(token)).id;
    } catch {
      client.disconnect(true);
    }
  }

  broadcast(msg: MessageView) {
    this.server.to(`convo:${msg.conversationId}`).emit('newMessage', msg);
  }

  // Acks ({ ok, error }) para que el cliente sepa si falló y pueda reintentar por HTTP
  @SubscribeMessage('join')
  async handleJoin(@ConnectedSocket() client: AuthedSocket, @MessageBody() data: { conversationId: string }) {
    try {
      await this.messagingService.assertMember(client.data.userId!, data?.conversationId);
      await client.join(`convo:${data.conversationId}`);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }

  @SubscribeMessage('leave')
  async handleLeave(@ConnectedSocket() client: AuthedSocket, @MessageBody() data: { conversationId: string }) {
    await client.leave(`convo:${data?.conversationId}`);
    return { ok: true };
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { conversationId: string; text: string },
  ) {
    try {
      const msg = await this.messagingService.sendMessage(client.data.userId!, data?.conversationId, data?.text);
      this.broadcast(msg);
      return { ok: true, message: msg };
    } catch (e) {
      this.logger.warn(`message rechazado: ${(e as Error).message}`);
      return { ok: false, error: (e as Error).message };
    }
  }
}
