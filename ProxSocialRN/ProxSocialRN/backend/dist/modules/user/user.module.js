"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./infrastructure/repositories/user.entity");
const user_interest_entity_1 = require("./infrastructure/repositories/user-interest.entity");
const user_social_link_entity_1 = require("./infrastructure/repositories/user-social-link.entity");
const user_repository_adapter_1 = require("./infrastructure/repositories/user-repository.adapter");
const user_service_1 = require("./application/user.service");
const user_controller_1 = require("./infrastructure/controllers/user.controller");
const user_repository_port_1 = require("./domain/ports/user-repository.port");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, user_interest_entity_1.UserInterestEntity, user_social_link_entity_1.UserSocialLinkEntity])],
        controllers: [user_controller_1.UserController],
        providers: [
            user_service_1.UserService,
            { provide: user_repository_port_1.USER_REPOSITORY, useClass: user_repository_adapter_1.UserRepositoryAdapter },
        ],
        exports: [user_service_1.UserService, user_repository_port_1.USER_REPOSITORY],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map