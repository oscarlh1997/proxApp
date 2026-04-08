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
exports.ConnectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const connection_entity_1 = require("../infrastructure/repositories/connection.entity");
let ConnectionService = class ConnectionService {
    constructor(repo) {
        this.repo = repo;
    }
    async connect(requesterId, targetId) {
        if (requesterId === targetId)
            throw new common_1.BadRequestException('No puedes conectar contigo mismo');
        const existing = await this.repo.findOne({ where: { requesterId, targetId } });
        if (existing)
            return { status: 'already_exists' };
        const reverse = await this.repo.findOne({ where: { requesterId: targetId, targetId: requesterId } });
        if (reverse)
            return { status: 'already_exists' };
        const conn = this.repo.create({ requesterId, targetId, status: 'pending', createdAt: Date.now() });
        await this.repo.save(conn);
        return { status: 'pending' };
    }
    async getConnections(userId) {
        const sent = await this.repo.find({ where: { requesterId: userId }, relations: ['target'] });
        const received = await this.repo.find({ where: { targetId: userId }, relations: ['requester'] });
        return {
            sent: sent.map((c) => ({
                id: c.id, targetId: c.targetId, status: c.status,
                displayName: c.target.displayName, avatarSeed: c.target.avatarSeed,
            })),
            received: received.map((c) => ({
                id: c.id, requesterId: c.requesterId, status: c.status,
                displayName: c.requester.displayName, avatarSeed: c.requester.avatarSeed,
            })),
        };
    }
    async acceptConnection(requesterId, targetId) {
        await this.repo.update({ requesterId, targetId }, { status: 'accepted' });
        return { ok: true };
    }
};
exports.ConnectionService = ConnectionService;
exports.ConnectionService = ConnectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(connection_entity_1.ConnectionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConnectionService);
//# sourceMappingURL=connection.service.js.map