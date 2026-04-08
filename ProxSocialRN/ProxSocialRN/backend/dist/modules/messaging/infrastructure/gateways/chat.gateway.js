"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const messaging_service_1 = require("../../application/messaging.service");
let ChatGateway = class ChatGateway {
    constructor(jwtService, messagingService) {
        this.jwtService = jwtService;
        this.messagingService = messagingService;
        this.logger = new common_1.Logger('ChatGateway');
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.query?.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.id;
            client.userId = userId;
            if (!this.userSockets.has(userId))
                this.userSockets.set(userId, new Set());
            this.userSockets.get(userId).add(client.id);
            this.logger.log(`User ${userId} connected (socket ${client.id})`);
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.userId;
        if (userId) {
            this.userSockets.get(userId)?.delete(client.id);
            if (this.userSockets.get(userId)?.size === 0)
                this.userSockets.delete(userId);
        }
    }
    handleJoin(client, data) {
        client.join(`convo:${data.conversationId}`);
    }
    handleLeave(client, data) {
        client.leave(`convo:${data.conversationId}`);
    }
    async handleMessage(client, data) {
        const userId = client.userId;
        if (!userId)
            return;
        const result = await this.messagingService.sendMessage(userId, data.conversationId, data.text);
        this.server.to(`convo:${data.conversationId}`).emit('newMessage', {
            id: result.id,
            conversationId: data.conversationId,
            senderId: userId,
            text: data.text,
            createdAt: Date.now(),
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/chat',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        messaging_service_1.MessagingService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map