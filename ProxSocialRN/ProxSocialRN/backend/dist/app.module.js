"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const typeorm_config_1 = require("./config/typeorm.config");
const redis_module_1 = require("./config/redis.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const proximity_module_1 = require("./modules/proximity/proximity.module");
const feed_module_1 = require("./modules/feed/feed.module");
const messaging_module_1 = require("./modules/messaging/messaging.module");
const connection_module_1 = require("./modules/connection/connection.module");
const seed_module_1 = require("./modules/seed/seed.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: typeorm_config_1.typeOrmConfig,
            }),
            redis_module_1.RedisModule,
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            proximity_module_1.ProximityModule,
            feed_module_1.FeedModule,
            messaging_module_1.MessagingModule,
            connection_module_1.ConnectionModule,
            seed_module_1.SeedModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map