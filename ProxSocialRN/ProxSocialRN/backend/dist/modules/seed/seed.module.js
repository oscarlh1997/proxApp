"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seed_service_1 = require("./seed.service");
const seed_controller_1 = require("./seed.controller");
const user_entity_1 = require("../user/infrastructure/repositories/user.entity");
const user_interest_entity_1 = require("../user/infrastructure/repositories/user-interest.entity");
const user_social_link_entity_1 = require("../user/infrastructure/repositories/user-social-link.entity");
const feed_entities_1 = require("../feed/infrastructure/repositories/feed.entities");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, user_interest_entity_1.UserInterestEntity, user_social_link_entity_1.UserSocialLinkEntity, feed_entities_1.PostEntity, feed_entities_1.PostTagEntity])],
        controllers: [seed_controller_1.SeedController],
        providers: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map