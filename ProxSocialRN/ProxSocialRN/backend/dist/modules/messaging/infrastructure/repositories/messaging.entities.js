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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEntity = exports.ConversationMemberEntity = exports.ConversationEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../user/infrastructure/repositories/user.entity");
let ConversationEntity = class ConversationEntity {
};
exports.ConversationEntity = ConversationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ConversationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'bigint' }),
    __metadata("design:type", Number)
], ConversationEntity.prototype, "createdAt", void 0);
exports.ConversationEntity = ConversationEntity = __decorate([
    (0, typeorm_1.Entity)('conversations')
], ConversationEntity);
let ConversationMemberEntity = class ConversationMemberEntity {
};
exports.ConversationMemberEntity = ConversationMemberEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ConversationMemberEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversation_id' }),
    __metadata("design:type", String)
], ConversationMemberEntity.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], ConversationMemberEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ConversationEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'conversation_id' }),
    __metadata("design:type", ConversationEntity)
], ConversationMemberEntity.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ConversationMemberEntity.prototype, "user", void 0);
exports.ConversationMemberEntity = ConversationMemberEntity = __decorate([
    (0, typeorm_1.Entity)('conversation_members')
], ConversationMemberEntity);
let MessageEntity = class MessageEntity {
};
exports.MessageEntity = MessageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MessageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversation_id' }),
    __metadata("design:type", String)
], MessageEntity.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sender_id' }),
    __metadata("design:type", String)
], MessageEntity.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MessageEntity.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'bigint' }),
    __metadata("design:type", Number)
], MessageEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ConversationEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'conversation_id' }),
    __metadata("design:type", ConversationEntity)
], MessageEntity.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], MessageEntity.prototype, "sender", void 0);
exports.MessageEntity = MessageEntity = __decorate([
    (0, typeorm_1.Entity)('messages')
], MessageEntity);
//# sourceMappingURL=messaging.entities.js.map