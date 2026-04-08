"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const feed_entities_1 = require("./infrastructure/repositories/feed.entities");
const user_entity_1 = require("../user/infrastructure/repositories/user.entity");
const feed_service_1 = require("./application/feed.service");
const feed_controller_1 = require("./infrastructure/controllers/feed.controller");
let FeedModule = class FeedModule {
};
exports.FeedModule = FeedModule;
exports.FeedModule = FeedModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([feed_entities_1.PostEntity, feed_entities_1.PostTagEntity, feed_entities_1.LikeEntity, feed_entities_1.SaveEntity, feed_entities_1.CommentEntity, user_entity_1.UserEntity])],
        controllers: [feed_controller_1.FeedController],
        providers: [feed_service_1.FeedService],
        exports: [feed_service_1.FeedService],
    })
], FeedModule);
//# sourceMappingURL=feed.module.js.map