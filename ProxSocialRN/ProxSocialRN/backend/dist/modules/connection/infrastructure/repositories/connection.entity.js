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
exports.ConnectionEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../user/infrastructure/repositories/user.entity");
let ConnectionEntity = class ConnectionEntity {
};
exports.ConnectionEntity = ConnectionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ConnectionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requester_id' }),
    __metadata("design:type", String)
], ConnectionEntity.prototype, "requesterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_id' }),
    __metadata("design:type", String)
], ConnectionEntity.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'pending' }),
    __metadata("design:type", String)
], ConnectionEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'bigint' }),
    __metadata("design:type", Number)
], ConnectionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requester_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ConnectionEntity.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'target_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ConnectionEntity.prototype, "target", void 0);
exports.ConnectionEntity = ConnectionEntity = __decorate([
    (0, typeorm_1.Entity)('connections')
], ConnectionEntity);
//# sourceMappingURL=connection.entity.js.map