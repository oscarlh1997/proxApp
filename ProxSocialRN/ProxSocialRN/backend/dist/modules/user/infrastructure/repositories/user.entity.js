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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const user_interest_entity_1 = require("./user-interest.entity");
const user_social_link_entity_1 = require("./user-social-link.entity");
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash' }),
    __metadata("design:type", String)
], UserEntity.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_name', length: 100, default: '' }),
    __metadata("design:type", String)
], UserEntity.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], UserEntity.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar_seed', length: 50, default: '' }),
    __metadata("design:type", String)
], UserEntity.prototype, "avatarSeed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'relationship_status', length: 30, default: 'no_especificado' }),
    __metadata("design:type", String)
], UserEntity.prototype, "relationshipStatus", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_updated_at', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "locationUpdatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "visible", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_interest_entity_1.UserInterestEntity, (i) => i.user, { cascade: true, eager: false }),
    __metadata("design:type", Array)
], UserEntity.prototype, "interests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_social_link_entity_1.UserSocialLinkEntity, (l) => l.user, { cascade: true, eager: false }),
    __metadata("design:type", Array)
], UserEntity.prototype, "socialLinks", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
//# sourceMappingURL=user.entity.js.map