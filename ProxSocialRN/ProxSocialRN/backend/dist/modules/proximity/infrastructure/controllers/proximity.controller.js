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
exports.ProximityController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../../../common/decorators/current-user.decorator");
const proximity_service_1 = require("../../application/proximity.service");
let ProximityController = class ProximityController {
    constructor(proximityService) {
        this.proximityService = proximityService;
    }
    async updateLocation(userId, body) {
        await this.proximityService.updateLocation(userId, body.latitude, body.longitude);
        return { ok: true };
    }
    async getNearby(userId, radius, lat, lon) {
        const r = parseFloat(radius || '0.5');
        const latitude = lat ? parseFloat(lat) : undefined;
        const longitude = lon ? parseFloat(lon) : undefined;
        if (latitude && longitude) {
            await this.proximityService.updateLocation(userId, latitude, longitude);
            return this.proximityService.findNearby(userId, latitude, longitude, r);
        }
        return this.proximityService.findNearby(userId, 0, 0, r);
    }
};
exports.ProximityController = ProximityController;
__decorate([
    (0, common_1.Post)('location'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProximityController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('radius')),
    __param(2, (0, common_1.Query)('lat')),
    __param(3, (0, common_1.Query)('lon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProximityController.prototype, "getNearby", null);
exports.ProximityController = ProximityController = __decorate([
    (0, swagger_1.ApiTags)('proximity'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [proximity_service_1.ProximityService])
], ProximityController);
//# sourceMappingURL=proximity.controller.js.map