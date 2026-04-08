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
exports.ProximityService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../../config/redis.service");
const user_repository_port_1 = require("../../user/domain/ports/user-repository.port");
let ProximityService = class ProximityService {
    constructor(redis, userRepo) {
        this.redis = redis;
        this.userRepo = userRepo;
    }
    async updateLocation(userId, lat, lon) {
        await Promise.all([
            this.redis.setUserLocation(userId, lat, lon, 1800),
            this.userRepo.updateLocation(userId, lat, lon),
        ]);
    }
    async findNearby(userId, lat, lon, radiusKm = 0.5) {
        const redisResults = await this.redis.getNearbyUserIds(lat, lon, radiusKm);
        const nearbyIds = redisResults
            .filter((r) => r.id !== userId)
            .map((r) => r.id);
        if (nearbyIds.length > 0) {
            const profiles = await this.userRepo.findNearby(lat, lon, radiusKm, userId, nearbyIds);
            return profiles;
        }
        return this.userRepo.findNearby(lat, lon, radiusKm, userId);
    }
    async setInvisible(userId) {
        await this.redis.removeUserLocation(userId);
    }
};
exports.ProximityService = ProximityService;
exports.ProximityService = ProximityService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [redis_service_1.RedisService, Object])
], ProximityService);
//# sourceMappingURL=proximity.service.js.map