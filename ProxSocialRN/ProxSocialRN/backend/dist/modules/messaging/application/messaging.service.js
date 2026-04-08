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
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const messaging_entities_1 = require("../infrastructure/repositories/messaging.entities");
const redis_service_1 = require("../../../config/redis.service");
let MessagingService = class MessagingService {
    constructor(convos, members, messages, redis) {
        this.convos = convos;
        this.members = members;
        this.messages = messages;
        this.redis = redis;
    }
    async getConversations(userId) {
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
    async findOrCreateConversation(userId, targetUserId) {
        const myMemberships = await this.members.find({ where: { userId } });
        for (const m of myMemberships) {
            const hasTgt = await this.members.findOne({ where: { conversationId: m.conversationId, userId: targetUserId } });
            if (hasTgt)
                return m.conversationId;
        }
        const convo = this.convos.create({ createdAt: Date.now() });
        const saved = await this.convos.save(convo);
        await this.members.save([
            this.members.create({ conversationId: saved.id, userId }),
            this.members.create({ conversationId: saved.id, userId: targetUserId }),
        ]);
        return saved.id;
    }
    async getMessages(conversationId) {
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
    async sendMessage(userId, conversationId, text) {
        const msg = this.messages.create({ conversationId, senderId: userId, text, createdAt: Date.now() });
        const saved = await this.messages.save(msg);
        await this.redis.publish(`chat:${conversationId}`, JSON.stringify({
            id: saved.id, senderId: userId, text, createdAt: Number(saved.createdAt),
        }));
        return { id: saved.id };
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(messaging_entities_1.ConversationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(messaging_entities_1.ConversationMemberEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(messaging_entities_1.MessageEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        redis_service_1.RedisService])
], MessagingService);
//# sourceMappingURL=messaging.service.js.map