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
exports.UserRepositoryAdapter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const user_interest_entity_1 = require("./user-interest.entity");
const user_social_link_entity_1 = require("./user-social-link.entity");
let UserRepositoryAdapter = class UserRepositoryAdapter {
    constructor(users, interests, socialLinks) {
        this.users = users;
        this.interests = interests;
        this.socialLinks = socialLinks;
    }
    async findById(id) {
        const u = await this.users.findOne({ where: { id } });
        if (!u)
            return null;
        return this.toProfile(u);
    }
    async findByEmail(email) {
        const u = await this.users.findOne({ where: { email } });
        if (!u)
            return null;
        const profile = await this.toProfile(u);
        return { ...profile, passwordHash: u.passwordHash };
    }
    async findByUsername(username) {
        const u = await this.users.findOne({ where: { username } });
        if (!u)
            return null;
        return this.toProfile(u);
    }
    async create(data) {
        const entity = this.users.create({
            username: data.username,
            email: data.email,
            passwordHash: data.passwordHash,
            displayName: data.displayName,
            avatarSeed: data.avatarSeed,
        });
        const saved = await this.users.save(entity);
        return this.toProfile(saved);
    }
    async update(id, data) {
        const updates = {};
        if (data.displayName !== undefined)
            updates.displayName = data.displayName;
        if (data.bio !== undefined)
            updates.bio = data.bio;
        if (data.avatarSeed !== undefined)
            updates.avatarSeed = data.avatarSeed;
        if (data.relationshipStatus !== undefined)
            updates.relationshipStatus = data.relationshipStatus;
        if (data.visible !== undefined)
            updates.visible = data.visible;
        if (Object.keys(updates).length > 0) {
            await this.users.update(id, updates);
        }
        if (data.interests !== undefined) {
            await this.interests.delete({ userId: id });
            if (data.interests.length > 0) {
                await this.interests.save(data.interests.map((tag) => this.interests.create({ userId: id, tag })));
            }
        }
        if (data.socialLinks !== undefined) {
            await this.socialLinks.delete({ userId: id });
            if (data.socialLinks.length > 0) {
                await this.socialLinks.save(data.socialLinks.map((l) => this.socialLinks.create({ userId: id, platform: l.platform, url: l.url, handle: l.handle })));
            }
        }
        return this.findById(id);
    }
    async updateLocation(id, lat, lon) {
        await this.users
            .createQueryBuilder()
            .update()
            .set({
            latitude: lat,
            longitude: lon,
            location: () => `ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography`,
            locationUpdatedAt: Date.now(),
        })
            .where('id = :id', { id })
            .execute();
    }
    async findNearby(lat, lon, radiusKm, excludeId, userIds) {
        const radiusM = radiusKm * 1000;
        let qb = this.users
            .createQueryBuilder('u')
            .addSelect(`ST_Distance(u.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)`, 'distance_m')
            .where('u.id != :excludeId')
            .andWhere('u.visible = true')
            .andWhere('u.location IS NOT NULL')
            .andWhere(`ST_DWithin(u.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radiusM)`)
            .andWhere('u.location_updated_at > :staleTs')
            .setParameters({ lat, lon, excludeId, radiusM, staleTs: Date.now() - 30 * 60 * 1000 })
            .orderBy('distance_m', 'ASC')
            .limit(100);
        if (userIds?.length) {
            qb = qb.andWhere('u.id IN (:...userIds)', { userIds });
        }
        const raw = await qb.getRawAndEntities();
        return Promise.all(raw.entities.map(async (entity, i) => {
            const profile = await this.toProfile(entity);
            const distanceM = Math.round(parseFloat(raw.raw[i].distance_m || '0'));
            return { ...profile, distanceM };
        }));
    }
    async toProfile(u) {
        const ints = await this.interests.find({ where: { userId: u.id } });
        const links = await this.socialLinks.find({ where: { userId: u.id } });
        return {
            id: u.id,
            username: u.username,
            displayName: u.displayName,
            bio: u.bio,
            avatarSeed: u.avatarSeed,
            relationshipStatus: u.relationshipStatus,
            interests: ints.map((i) => i.tag),
            socialLinks: links.map((l) => ({ id: l.id, platform: l.platform, url: l.url, handle: l.handle })),
            visible: u.visible,
            latitude: u.latitude,
            longitude: u.longitude,
        };
    }
};
exports.UserRepositoryAdapter = UserRepositoryAdapter;
exports.UserRepositoryAdapter = UserRepositoryAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_interest_entity_1.UserInterestEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_social_link_entity_1.UserSocialLinkEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserRepositoryAdapter);
//# sourceMappingURL=user-repository.adapter.js.map